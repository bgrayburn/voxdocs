import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt =
  "You are an assistant to someone editing a markdown document.  Please always return just the documents text after making any changes the user asked for. Don't write any new text unless explicitly asked to.";

const functions = [
  {
    name: "getInstructionResponse",
    description:
      "Provides a voxdocs instruction response in a structured JSON format",
    parameters: {
      type: "object",
      properties: {
        document: {
          type: "string",
          description: "The text of the updated document",
        },
        message: {
          type: "string",
          description: "The message to the user",
        },
      },
      required: ["document", "message"],
    },
  },
];

// Function to get a response conforming to the specified JSON schema
export async function getAssistantResponse(jsonInput) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
        { role: "user", content: JSON.stringify(jsonInput) },
      ],
      functions: functions,
      function_call: { name: "getInstructionResponse" },
    });

    // Extract the function call arguments (structured JSON)
    const functionArgs = completion.choices[0].message.function_call.arguments;
    const response = JSON.parse(functionArgs);

    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    return { error: "Failed to generate a valid JSON response." };
  }
}

// Example usage
// (async () => {
//   const userPrompt = 'title Grocery List';
//   const assistantResponse = await getAssistantResponse(userPrompt);
//   console.log('Assistant Response:', assistantResponse);
// })();
