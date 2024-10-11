import express, { Request, Response } from "express";
// import cors from 'cors';
import bodyParser from "body-parser";
import { getAssistantResponse } from "./util/openAIUtil";

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

app.post("/api/instruct", async (req: Request, res: Response) => {
  console.log("Incoming request");
  const { instruction, document } = req.body as RequestBody;

  const assistantRes = await getAssistantResponse({ instruction, document });

  if (!assistantRes.error) {
    res.json(assistantRes);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {};
