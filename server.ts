import express, { Request, Response } from "express";
// import cors from 'cors';
import bodyParser from "body-parser";
import OpenAI from "openai";

// TypeScript interface for request body
interface RequestBody {
  instruction: string;
  document: string;
}

// Initialize Express app
const app = express();

// Middleware
// app.use(cors());
app.use(bodyParser.json());

// OpenAI configuration using environment variables
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);
const assistantId = process.env.OPENAI_ASSISTANT_ID || "";

app.post("/api/instruct", async (req: Request, res: Response) => {
  console.log("Incoming request");
  const { instruction, document } = req.body as RequestBody;

  // Create a new thread
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: JSON.stringify({ instruction, document }),
      },
    ],
  });

  const threadId = thread.id;

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });

  if (run.status == "completed") {
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    if (lastMessage.content[0].type === "text") {
      const textValue = lastMessage.content[0].text.value;
      res.json(textValue);
    }
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {};
