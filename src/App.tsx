import React from "react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { download } from "./util/fileUtil";
// import { handleNetworkError } from './util/errorHandling'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/loader.css";

const SERVER_URL = window.location;

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
    setShowPendingAction(true);

    const req_data = { instruction: submittedInstruction, document: text };
    const response = await fetch(`${SERVER_URL}api/instruct`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req_data),
    });

    setShowPendingAction(false);
    if (response.ok) {
      setInstruction("");
      const res_obj = await response.json();
      console.log(res_obj);
      const document = JSON.parse(res_obj).document;
      console.log(`document: ${document}`);
      setText(document);
      const message = JSON.parse(res_obj).message;
      console.log(`message: ${message}`);
      if (message) {
        toast(message);
      }
    } else {
      toast("There was a network error, please try again");
      return Promise.reject(new Error("server request failed"));
    }
  }

  const chatbox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatbox?.current?.focus();
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
    <>
      <div className="App static md:p-5 flex flex-row h-screen w-screen">
        <div id="left-col" className="flex-auto flex md:mx-5 flex-col h-full">
          <div className="prose m-auto w-full overflow-scroll flex-1 bg-orange-100 rounded-md p-5">
            <ReactMarkdown>{text ? text : "..."}</ReactMarkdown>
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
                disabled={showPendingAction}
                className={`${button_menu_classes} rounded-tl-md rounded-bl-md`}
              >
                instruct
              </button>
            </form>
          </div>
        </div>
        <div id="right-col" className="md:w-44 flex-col">
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
      </div>
      <ToastContainer position="top-left" theme="colored" closeOnClick />
      {showPendingAction ? (
        <div className="fixed top-0 left-0 opacity-75 bg-black w-screen h-screen">
          <div className="loader" />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
