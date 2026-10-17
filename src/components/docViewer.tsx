import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  rehypeInteractiveCheckboxes,
  toggleCheckbox,
} from "@/util/markdownUtil";

type DocViewerProps = {
  text: string;
  setText: (text: string) => void;
};

export const DocViewer = ({ text, setText }: DocViewerProps) => (
  <span className="m-auto overflow-scroll rounded-md p-5">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeInteractiveCheckboxes]}
      components={{
        input: ({ node, ...props }) => {
          const offset = node?.properties["data-task-offset"];
          if (props.type !== "checkbox" || typeof offset !== "number") {
            return <input {...props} />;
          }

          return (
            <input
              {...props}
              disabled={false}
              onChange={() => setText(toggleCheckbox(text, offset))}
            />
          );
        },
      }}
    >
      {text ? text : "..."}
    </ReactMarkdown>
  </span>
);
