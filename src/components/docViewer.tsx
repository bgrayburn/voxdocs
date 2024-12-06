import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type DocViewerProps = {
  text: string;
};

export const DocViewer = ({ text }: DocViewerProps) => (
  <span className="m-auto overflow-scroll rounded-md p-5">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {text ? text : "..."}
    </ReactMarkdown>
  </span>
);
