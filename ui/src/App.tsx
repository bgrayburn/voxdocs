import hotkeys from "hotkeys-js";
import OpenAI from "openai";
import { SettingsModal } from "./components/SettingsModal";
import React from "react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { download } from "./util/FileUtil";
import { Settings } from "./types";

const SERVER_URL = "http://127.0.0.1:8000/";

const button_classes =
  "border-2 bg-black text-white w-fit p-3 rounded-full drop-showdow-md";
const button_menu_classes = `${button_classes} w-44`;

type InterfaceButton = {
  label: string;
  callback: () => void;
};

const defaultSettings = {
  OpenAI_API_Key: "",
  OpenAI_Assistant_ID: "",
};

function App() {
  const [text, setText] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const [settingsModalVisible, setSettingsModalVisible] =
    useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings");
    console.log(`storedSettings: ${storedSettings}`);
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      setSettingsModalVisible(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // async function submitInstruction(submittedInstruction: string) {
  //   setInstruction("");

  //   const req_data = { instruction: submittedInstruction };
  //   const response = await fetch(SERVER_URL, {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(req_data),
  //   });
  //   const res_obj = await response.json();

  //   if (response.ok) {
  //     console.log(res_obj);
  //     setText(res_obj.text);
  //   } else {
  //     return Promise.reject(new Error("server request failed"));
  //   }
  // }

  async function submitInstruction(submittedInstruction: string) {
    setInstruction("");

    const openai = new OpenAI({
      apiKey: settings.OpenAI_API_Key,
      dangerouslyAllowBrowser: true,
    });

    // Create a thread
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id);
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
    {
      label: "settings",
      callback: () => setSettingsModalVisible(true),
    },
  ];

  return (
    <div className="w-full h-screen">
      {settingsModalVisible && (
        <SettingsModal
          setSettings={setSettings}
          settings={settings}
          setSettingsModalVisible={setSettingsModalVisible}
        />
      )}
      <div className="App static p-5 flex flex-row h-screen">
        <div id="left-col" className="flex-auto flex mx-5 flex-col h-dvh">
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
      </div>
    </div>
  );
}

export default App;
