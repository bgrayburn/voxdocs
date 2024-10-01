import json
import time
import os

import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class RequestObject(BaseModel):
    instruction: str
    document: str


origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# gets API Key from environment variable OPENAI_API_KEY
client = openai.OpenAI()

assistant_id = os.environ["OPENAI_ASSISTANT_ID"]

assistant = client.beta.assistants.retrieve(assistant_id)


@app.post("/")
def root(req: RequestObject):
    print("incoming request")
    thread = client.beta.threads.create()
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=json.dumps({"instruction": req.instruction, "document": req.document}),
    )
    run = client.beta.threads.runs.create(
        thread_id=thread.id, assistant_id=assistant_id
    )
    run_result = executeRun(run, thread)
    return run_result


def executeRun(run, thread):
    print("checking assistant status. ")
    # TODO: use async await here instead of while True
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

        if run.status == "completed":
            print("done!")
            messages = client.beta.threads.messages.list(thread_id=thread.id)

            message = "".join(
                [m.content[0].text.value for m in messages if m.role == "assistant"]
            )
            print(f"message: {message}")
            try:
                return json.loads(message)
            except Exception:
                return {
                    "message": "Response from OpenAI Server wasn't valid JSON",
                    "document": None,
                }

        elif run.status == "failed":
            print("request failed")
            breakpoint()
            return "ERROR: Request to OpenAI Failed"
        else:
            print("in progress...")
            print(f"{run.status}")
            time.sleep(1)
