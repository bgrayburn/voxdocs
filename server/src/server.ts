import { z } from "zod";
import express, { Request, Response } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import { getAssistantResponse } from "./util/openAIUtil";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TypeScript interface for request body
interface RequestBody {
  instruction: string;
  document: string;
}

// Initialize Express app
const app = express();

const InstructionResponseSchema = z.object({
  document: z.string().describe("The text of the updated document"),
  message: z.string().describe("The message to the user"),
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

if (process.env.ENV != "dev") {
  app.use(express.static(path.join(__dirname, "client")));

  app.get("*", (_, res: Response) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  });
}

app.post("/api/instruct", async (req: Request, res: Response) => {
  console.log("Incoming request");
  const { instruction, document } = req.body as RequestBody;

  const assistantRes = await getAssistantResponse(
    instruction,
    document,
    InstructionResponseSchema,
  );

  res.json(assistantRes);
});

// Start the server
app.listen(5000, "0.0.0.0", () => {
  console.log(`Server is running on port 5000`);
});

export {};
