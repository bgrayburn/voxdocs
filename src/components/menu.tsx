import { download } from "@/util/fileUtil";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

type MenuProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

type InterfaceButton = {
  label: string;
  callback: () => void;
};

export const Menu = ({ text, setText }: MenuProps) => {
  const buttons: InterfaceButton[] = [
    {
      label: "copy",
      callback: () => {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard");
      },
    },
    {
      label: "load",
      callback: () => setText(prompt("Text to import:") || text),
    },
    {
      label: "save",
      callback: () => download(text, "", "text"),
    },
  ];

  return (
    <span className="flex-row float-right">
      {buttons.map((b) => (
        <Button
          type="button"
          key={b.label}
          id={`${b.label}-button`}
          className="m-1"
          onClick={b.callback}
        >
          {b.label}
        </Button>
      ))}
    </span>
  );
};
