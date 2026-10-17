import type { Element, Root } from "hast";
import type { VFile } from "vfile";

// Generated checkbox inputs have no source position, so use their list item's.
export const rehypeInteractiveCheckboxes = () => (tree: Root, file: VFile) => {
  const markdown = String(file);

  const visit = (node: Root | Element) => {
    if (node.type === "element" && node.tagName === "li") {
      const start = node.position?.start.offset;
      if (start !== undefined) {
        const marker = /^(?:[-+*]|\d+[.)])[\t ]+\[[ xX]\]/.exec(
          markdown.slice(start),
        );
        if (marker) {
          const firstElement = node.children.find(
            (child) => child.type === "element",
          );
          const input =
            firstElement?.tagName === "p"
              ? firstElement.children.find((child) => child.type === "element")
              : firstElement;
          if (
            input?.type === "element" &&
            input.tagName === "input" &&
            input.properties.type === "checkbox"
          ) {
            input.properties["data-task-offset"] = start + marker[0].length - 3;
          }
        }
      }
    }

    for (const child of node.children) {
      if (child.type === "element") visit(child);
    }
  };

  visit(tree);
};

export const toggleCheckbox = (markdown: string, offset: number) => {
  const marker = markdown.slice(offset, offset + 3);
  if (!/^\[[ xX]\]$/.test(marker)) return markdown;

  const checked = marker === "[ ]" ? "x" : " ";
  return markdown.slice(0, offset + 1) + checked + markdown.slice(offset + 2);
};
