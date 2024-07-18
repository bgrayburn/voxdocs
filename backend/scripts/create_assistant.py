from openai import OpenAI

client = OpenAI()

instructions = "You are an assistant to someone editing a markdown document.  Please always return just the documents text after making any changes the user asked for. Don't write any new text unless explicitly asked to."

res = client.beta.assistants.create(
    name="voxdocs-instruct", instructions=instructions, model="gpt-4o"
)

print(res.id)
