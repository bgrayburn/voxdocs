from openai import OpenAI

client = OpenAI()

instructions = "You are an assistant to someone editing a markdown document.  Please always return just the documents text after making any changes the user asked for."

client.beta.assistants.create(
    name="voxdocs-dev", instructions=instructions, model="gpt-3.5-turbo"
)
