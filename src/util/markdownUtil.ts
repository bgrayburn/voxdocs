export const toggleCheckbox = (markdown: string, index: number) => {
  const lines = markdown.split("\n");
  return lines
    .map((line, i) => {
      if (i === index) {
        if (line.startsWith("- [ ]")) {
          return line.replace("- [ ]", "- [x]");
        } else if (line.startsWith("- [x]")) {
          return line.replace("- [x]", "- [ ]");
        }
      }
      return line;
    })
    .join("\n");
};
