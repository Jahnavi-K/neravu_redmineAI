import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [url, setUrl] = useState(
    () => localStorage.getItem("redmine_url") ?? ""
  );

  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("redmine_api_key") ?? ""
  );

  const handleConnect = async () => {
    try {
      const response =
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
          response.data.user
        )
      );
      navigate("/dashboard");
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
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FB"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "450px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h1
          style={{
            color: "#1E3A5F",
            marginBottom: "5px",
            textAlign: "center",
            fontSize: "36px"
          }}
        >
          ನೆರವು
          {/* NERAVU */}
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px"
          }}
        >
          AI-powered Redmine Companion
        </p>

        <div>
          <label>Redmine URL</label>

          <input
            placeholder="http://localhost:3000"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px"
            }}
          />
        </div>

        <br />

        <div>
          <label>API Key</label>

          <input
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px"
            }}
          />
        </div>

        <br />

        <button
          onClick={handleConnect}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1E3A5F",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Connect to Redmine
        </button>
      </div>
    </div>
  );
}