import { download } from "../util/fileUtil";
import { toast } from "react-toastify";
import { button_menu_classes } from "../styles/buttons";

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
    <>
      {buttons.map((b) => (
        <button
          type="button"
          key={b.label}
          id={`${b.label}-button`}
          className={button_menu_classes}
          onClick={b.callback}
        >
          {b.label}
        </button>
      ))}
    </>
  );
};
