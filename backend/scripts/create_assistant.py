from openai import OpenAI

client = OpenAI()

with open("../assistant/prompt.txt", "r") as f:
    instructions = f.read()

with open("../assistant/open-response.schema.json", "r") as f:
    schema = f.read()

res = client.beta.assistants.create(
    name="voxdocs-instruct-2",
    instructions=instructions,
    model="gpt-4o",
    temperature=0.1,
    response_format={"type": "json", "schema": schema},
)

print(res.id)
