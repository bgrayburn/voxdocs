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

assistant_id = os.environ["OPENAI_ASSISTANT_ID"]

assistant = client.beta.assistants.retrieve(assistant_id)

thread = client.beta.threads.create()


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
    return {"text": executeRun(run, thread.id)}


def executeRun(run, thread_id):
    print("checking assistant status. ")
    # TODO: use async await here instead of while True
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

        if run.status == "completed":
            print("done!")
            messages = client.beta.threads.messages.list(thread_id=thread_id)

            print("messages: ")
            for message in messages:
                assert (message.content.__len__() == 0) or (
                    message.content[0].type == "text"
                )
                if message.content.__len__() > 0:
                    print(
                        {"role": message.role, "message": message.content[0].text.value}
                    )
                else:
                    print("empty message")

            break
        else:
            print("in progress...")
            time.sleep(5)

    return [
        m.content[0].text.value if m.content.__len__() > 0 else ""
        for m in messages
        if m.role == "assistant"
    ][0]
