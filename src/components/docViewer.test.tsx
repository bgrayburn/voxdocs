// @vitest-environment jsdom
import "../setupTests";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DocViewer } from "./docViewer";

describe("DocViewer", () => {
  it("renders Markdown headings and an empty-document placeholder", () => {
    const { rerender } = render(
      <DocViewer text="# Groceries" setText={vi.fn()} />,
    );
    expect(
      screen.getByRole("heading", { name: "Groceries" }),
    ).toBeInTheDocument();
    rerender(<DocViewer text="" setText={vi.fn()} />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it.each([
    "- [ ] Milk\n- [x] Eggs",
    "1. [ ] Milk\n2. [x] Eggs",
    "- [ ] Milk\n\n- [x] Eggs",
    "- Parent\n  - [ ] Milk\n  - [x] Eggs",
    "> - [ ] Milk\n> - [x] Eggs",
  ])("updates the correct source task in %s", (markdown) => {
    const setText = vi.fn();
    render(<DocViewer text={markdown} setText={setText} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[1]).toBeEnabled();
    fireEvent.click(checkboxes[1]);
    expect(setText).toHaveBeenCalledWith(
      markdown.replace("[x] Eggs", "[ ] Eggs"),
    );
  });

  it("does not turn code examples into interactive tasks", () => {
    render(
      <DocViewer text={"```markdown\n- [ ] Example\n```"} setText={vi.fn()} />,
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
