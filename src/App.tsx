import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/components/loader.css";
import "@/components/docViewer";
import { DocViewer } from "@/components/docViewer";
import { Menu } from "@/components/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <div className="App static md:p-5 flex flex-col h-screen w-screen bg-slate-400">
        <div id="topbar" className="w-full mb-2 flex-0">
          <Menu text={text} setText={setText} />
        </div>
        <div className="prose mx-auto w-3/4 sm:w-full overflow-scroll flex-1 bg-slate-100 rounded-md px-5">
          <DocViewer text={text} />
        </div>
        <div id="input-bar" className="w-full md:w-2/3 m-auto mt-5 flex-0">
          <form
            onSubmit={(evt) => {
              submitInstruction(instruction);
              evt.preventDefault();
            }}
            className="flex flex-row w-full"
          >
            <label htmlFor="instruction-input" className="sr-only">
              Instruction
            </label>
            <Input
              id="instruction-input"
              type="text"
              ref={chatbox}
              placeholder="Instruction to assistant..."
              className="flex-auto resize-none border-3 border-black px-5 md:rounded-tl-full md:rounded-bl-full"
              value={instruction}
              onChange={(evt) =>
                setInstruction((evt.target as HTMLInputElement).value)
              }
            />
            <Button
              id="instruct-button"
              type="submit"
              disabled={showPendingAction}
              className="md:rounded-tr-full md:rounded-br-full"
            >
              Submit
            </Button>
          </form>
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
