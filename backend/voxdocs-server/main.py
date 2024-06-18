import time
import os

import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class RequestObject(BaseModel):
    instruction: str


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

assistant_id = os.environ["ASSISTANT_ID"]

thread = client.beta.threads.create()
assistant = client.beta.assistants.retrieve(assistant_id)


@app.post("/")
def root(req: RequestObject):
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=req.instruction,
    )
    run = client.beta.threads.runs.create(
        thread_id=thread.id, assistant_id=assistant_id
    )
    return {"text": executeRun(run)}


def executeRun(run):
    print("checking assistant status. ")
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

        if run.status == "completed":
            print("done!")
            messages = client.beta.threads.messages.list(thread_id=thread.id)

            print("messages: ")
            for message in messages:
                assert message.content[0].type == "text"
                print({"role": message.role, "message": message.content[0].text.value})

            break
        else:
            print("in progress...")
            time.sleep(5)
    return [m.content[0].text.value for m in messages if m.role == "assistant"][0]
