import { type Settings } from "../types";

type SettingsModalProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  setSettingsModalVisible: (visible: boolean) => void;
};

export const SettingsModal = ({
  settings,
  setSettings,
  setSettingsModalVisible,
}: SettingsModalProps) => {
  return (
    <div className="bg-white p-5 my-5 modal absolute w-half max-w-lg left-1/2 -translate-x-1/2 transition-all">
      <div className="modal-content">
        <button
          className="close-button absolute right-2 top-2"
          onClick={() => setSettingsModalVisible(false)}
        >
          X
        </button>
        <h2>Settings</h2>
        <form onSubmit={(evt) => evt.preventDefault()}>
          {Object.keys(settings).map((k) => (
            <div key={k} className="my-2">
              <label>{k}</label>
              <input
                className="border-2 mx-5 px-1"
                type="text"
                onInput={(evt) =>
                  setSettings({ ...settings, [k]: evt.currentTarget.value })
                }
                value={settings[k as keyof Settings] as string}
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};
