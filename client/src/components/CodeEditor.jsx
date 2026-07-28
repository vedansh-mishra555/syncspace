import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function CodeEditor({ code, onCodeChange }) {
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/code/run",
        {
          code,
        }
      );

      setOutput(res.data.output);
    } catch (err) {
      setOutput(
        err.response?.data?.output || "Something went wrong"
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: "55px",
          background: "#1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          color: "white",
        }}
      >
        <h3>main.js</h3>

        <button
          onClick={runCode}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ▶ Run
        </button>
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          options={{
            fontSize: 15,
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output */}
      <div
        style={{
          background: "#111827",
          color: "#22c55e",
          padding: "15px",
          minHeight: "100px",
          borderTop: "2px solid #334155",
        }}
      >
        <strong>Output</strong>

        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default CodeEditor;