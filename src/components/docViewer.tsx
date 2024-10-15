import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type DocViewerProps = {
  text: string;
};

export const DocViewer = ({ text }: DocViewerProps) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {text ? text : "..."}
  </ReactMarkdown>
);
