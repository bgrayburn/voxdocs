import * as z from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL ?? "https://api.openai.com/v1", // Use the appropriate base URL for your environment
  apiKey: process.env.OPENAI_API_KEY,
});

const modelName = process.env.MODEL_NAME ?? "gpt-4o-mini";

const prompt =
  "You are an assistant to someone editing a markdown document.  Please always return just the documents text after making any changes the user asked for. Don't write any new text unless explicitly asked to.";

// Function to get a response conforming to the specified JSON schema
export async function getAssistantResponse<T extends z.ZodRawShape>(
  jsonInput: object,
  responseSchema: z.ZodObject<T>,
) {
  try {
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "user", content: prompt },
        { role: "user", content: JSON.stringify(jsonInput) },
      ],
      response_format: zodResponseFormat(responseSchema, "response_schema"),
    });

    const message = completion.choices[0].message;
    if (!message || !message.content) {
      throw new Error("No content in response");
    }

    const response = responseSchema.parse(JSON.parse(message.content));

    return response;
  } catch (error) {
    console.error("Error generating response:", error);

    // Determine the appropriate message for the new Error
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    throw new Error(errorMessage);
  }
}

// Example usage
// (async () => {
//   const userPrompt = 'title Grocery List';
//   const assistantResponse = await getAssistantResponse(userPrompt);
//   console.log('Assistant Response:', assistantResponse);
// })();
