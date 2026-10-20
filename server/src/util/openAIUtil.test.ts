import { z } from "zod";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAssistantResponse } from "./openAIUtil";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("openai", () => ({
  default: class {
    chat = { completions: { create } };
  },
}));

const schema = z.object({ document: z.string(), message: z.string() });

describe("getAssistantResponse", () => {
  beforeEach(() => {
    create.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("sends the document and instruction using structured output and parses the result", async () => {
    const result = { document: "# Updated", message: "Done" };
    create.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(result) } }],
    });
    await expect(
      getAssistantResponse("Update title", "# Original", schema),
    ).resolves.toEqual(result);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          {
            role: "user",
            content: JSON.stringify({
              document: "# Original",
              instruction: "Update title",
            }),
          },
        ]),
        response_format: expect.objectContaining({ type: "json_schema" }),
      }),
    );
  });

  it.each([
    ["missing content", null],
    ["invalid JSON", "not json"],
    ["a response that violates the schema", '{"document":42,"message":"Done"}'],
  ])("rejects %s", async (_, content) => {
    create.mockResolvedValue({ choices: [{ message: { content } }] });
    await expect(getAssistantResponse("Update", "", schema)).rejects.toThrow();
  });

  it("propagates provider errors", async () => {
    create.mockRejectedValue(new Error("Provider unavailable"));
    await expect(getAssistantResponse("Update", "", schema)).rejects.toThrow(
      "Provider unavailable",
    );
  });
});
