import { describe, expect, it } from "vitest";
import { toggleCheckbox } from "./markdownUtil";

describe("toggleCheckbox", () => {
  it.each(["[ ]", "[x]", "[X]"])(
    "toggles %s without changing surrounding Markdown",
    (marker) => {
      const prefix = "# Groceries 🛒\n\n- ";
      const suffix = " Milk\n- [ ] Eggs\n";
      const markdown = prefix + marker + suffix;
      expect(toggleCheckbox(markdown, prefix.length)).toBe(
        prefix + (marker === "[ ]" ? "[x]" : "[ ]") + suffix,
      );
    },
  );

  it.each([-1, 0, 3, 100])("ignores invalid offsets (%s)", (offset) => {
    const markdown = "- [ ] Milk";
    expect(toggleCheckbox(markdown, offset)).toBe(markdown);
  });

  it("ignores text that is not a task marker", () => {
    expect(toggleCheckbox("- [a] Milk", 2)).toBe("- [a] Milk");
  });
});
