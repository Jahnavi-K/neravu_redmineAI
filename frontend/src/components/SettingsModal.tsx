import { useState } from "react";
import api from "../services/api";

type SettingsModalProps = {
  onClose: () => void;
};

export default function SettingsModal({
  onClose,
}: SettingsModalProps) {

  const [url, setUrl] = useState(
    localStorage.getItem("redmine_url") ?? ""
  );

  const [apiKey, setApiKey] = useState(
    localStorage.getItem("redmine_api_key") ?? ""
  );
  const saveSettings = async () => {
    try {

      await api.post("/settings", {
        redmine_url: url,
        api_key: apiKey
      });

      const loginResponse =
        await api.post(
          "/login",
          {
            redmine_url: url,
            api_key: apiKey
          }
        );

      localStorage.setItem(
        "redmine_url",
        url
      );

      localStorage.setItem(
        "redmine_api_key",
        apiKey
      );

      localStorage.setItem(
        "redmine_user",
        JSON.stringify(
          loginResponse.data.user
        )
      );

      alert("Settings saved");

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to Redmine"
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor:
          "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          width: "450px"
        }}
      >
        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Settings
        </h2>

        <div>
          <label>
            Redmine URL
          </label>

          <input
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px"
            }}
          />
        </div>

        <br />

        <div>
          <label>
            API Key
          </label>

          <input
            value={apiKey}
            onChange={(e) =>
              setApiKey(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px"
            }}
          />
        </div>

        <br />

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >
          <button
            onClick={saveSettings}
          >
            Save
          </button>

          <button
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}