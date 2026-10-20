import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAssistantResponse } from "./util/openAIUtil";
import { app } from "./app";

vi.mock("./util/openAIUtil", () => ({ getAssistantResponse: vi.fn() }));

describe("POST /api/instruct", () => {
  beforeEach(() => vi.resetAllMocks());

  it("passes the instruction and existing document to the assistant and returns its response", async () => {
    const result = { document: "# Groceries\n- Milk", message: "Added milk" };
    vi.mocked(getAssistantResponse).mockResolvedValue(result);

    const response = await request(app)
      .post("/api/instruct")
      .send({ instruction: "Add milk", document: "# Groceries" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(result);
    expect(getAssistantResponse).toHaveBeenCalledWith(
      "Add milk",
      "# Groceries",
      expect.anything(),
    );
    const schema = vi.mocked(getAssistantResponse).mock.calls[0][2];
    expect(schema.safeParse(result).success).toBe(true);
    expect(schema.safeParse({ document: 123 }).success).toBe(false);
  });

  it("returns a generic 502 response when the AI provider fails", async () => {
    vi.mocked(getAssistantResponse).mockRejectedValue(
      new Error("Private provider details"),
    );
    const response = await request(app)
      .post("/api/instruct")
      .send({ instruction: "Add milk", document: "" });
    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      error: "Failed to generate an assistant response",
    });
  });

  it("rejects malformed JSON before calling the assistant", async () => {
    const response = await request(app)
      .post("/api/instruct")
      .set("Content-Type", "application/json")
      .send('{"instruction":');
    expect(response.status).toBe(400);
    expect(getAssistantResponse).not.toHaveBeenCalled();
  });
});
