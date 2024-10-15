import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/loader.css";
import "./components/docViewer";
import { DocViewer } from "./components/docViewer";
import { Menu } from "./components/menu";
import { button_menu_classes } from "./styles/buttons";

const SERVER_URL = window.location;

function App() {
  const [text, setText] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const [showPendingAction, setShowPendingAction] = useState<boolean>(false);

  async function submitInstruction(submittedInstruction: string) {
    setInstruction("");
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
      const res_obj = await response.json();
      const document = res_obj.document;
      setText(document);
      const message = res_obj.message;
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

  return (
    <>
      <div className="App static md:p-5 flex flex-row h-screen w-screen">
        <div id="left-col" className="flex-auto flex md:mx-5 flex-col h-full">
          <div className="prose m-auto w-full overflow-scroll flex-1 bg-orange-100 rounded-md p-5">
            <DocViewer text={text} />
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
          <Menu text={text} setText={setText} />
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
