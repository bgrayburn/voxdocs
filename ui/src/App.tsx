import hotkeys from "hotkeys-js";
import React from "react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { download } from "./util/FileUtil";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ListItemRenderer } from "./components/CustomMarkdownComponents";

const SERVER_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

const button_classes =
  "border-2 bg-black text-white w-fit p-3 rounded-full drop-showdow-md";
const button_menu_classes = `${button_classes} w-44`;

type InterfaceButton = {
  label: string;
  callback: () => void;
};

function App() {
  const [text, setText] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const [showPendingAction, setShowPendingAction] = useState<boolean>(false);

  async function submitInstruction(submittedInstruction: string) {
    setInstruction("");
    setShowPendingAction(true);

    const req_data = { instruction: submittedInstruction, document: text };
    const response = await fetch(SERVER_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req_data),
    });
    const res_obj = await response.json();

    setShowPendingAction(false);
    if (response.ok) {
      console.log(`res_obj.document: ${res_obj.document}`);
      setText(res_obj.document);
      console.log(`res.message: ${res_obj.message}`);
      if (res_obj.message) {
        toast(res_obj.message);
      }
    } else {
      return Promise.reject(new Error("server request failed"));
    }
  }

  const chatbox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatbox?.current?.focus();
    hotkeys("ctrl+i", (evt, handler) => {
      evt.preventDefault();
      const instructButtonElement = document.getElementById("instruct-button");
      instructButtonElement?.click();
    });
  }, []);

  const buttons: InterfaceButton[] = [
    {
      label: "copy",
      callback: () => navigator.clipboard.writeText(text),
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
    <div className="App static p-5 flex flex-row h-screen">
      <div id="left-col" className="flex-auto flex mx-5 flex-col h-dvh">
        <div className="prose m-auto w-full overflow-scroll flex-1 bg-orange-100 rounded-md p-5">
          <ReactMarkdown components={{ li: ListItemRenderer }}>
            {text || "..."}
          </ReactMarkdown>
        </div>
        <div id="input-bar" className="w-3/4 m-auto">
          <form
            onSubmit={(evt) => {
              submitInstruction(instruction);
              evt.preventDefault();
            }}
            className="flex flex-row w-full"
          >
            <input
              type="text"
              ref={chatbox}
              className="flex-auto resize-none border-3 px-5 p-3 rounded-full rounded-tr-md rounded-br-md"
              value={instruction}
              onChange={(evt) =>
                setInstruction((evt.target as HTMLInputElement).value)
              }
            />
            <button
              id="instruct-button"
              type="submit"
              className={`${button_menu_classes} rounded-tl-md rounded-bl-md`}
            >
              instruct
            </button>
          </form>
        </div>
      </div>
      <div id="right-col" className="w-44 flex-col">
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
      </div>
      <ToastContainer position="top-left" theme="colored" closeOnClick />
    </div>
  );
}

export default App;
