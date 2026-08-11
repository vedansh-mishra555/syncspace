import Editor from "@monaco-editor/react";
import { useState } from "react";
import { toast } from "react-toastify";

import "../styles/CodeEditor.css";

function CodeEditor({ code, onCodeChange }) {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  // ===========================
  // COPY CODE
  // ===========================
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied successfully!");
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  // ===========================
  // DOWNLOAD CODE
  // ===========================
  const downloadCode = () => {
    const blob = new Blob([code], {
      type: "text/javascript",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "syncspace-code.js";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Code downloaded successfully!");
  };

  // ===========================
  // RUN CODE
  // ===========================
  const runCode = () => {
    setRunning(true);
    setOutput("");

    try {
      let result = "";

      const customConsole = {
        log: (...args) => {
          result += args
            .map((item) => {
              if (typeof item === "object") {
                return JSON.stringify(item);
              }

              return String(item);
            })
            .join(" ");

          result += "\n";
        },
      };

      const executeCode = new Function(
        "console",
        code
      );

      executeCode(customConsole);

      setOutput(
        result || "Code executed successfully."
      );

      toast.success("Code executed successfully!");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast.error("Code execution failed!");
    }

    setRunning(false);
  };

  // ===========================
  // CLEAR OUTPUT
  // ===========================
  const clearOutput = () => {
    setOutput("");
  };

  return (
    <div className="editor-container">

      {/* ===========================
          EDITOR HEADER
      =========================== */}
      <div className="editor-header">

        <div className="editor-title">
          <h3>
            💻 Collaborative Code Editor
          </h3>

          <span className="language-badge">
            JavaScript
          </span>
        </div>

        <div className="editor-actions">

          {/* RUN */}
          <button
            className="run-code-btn"
            onClick={runCode}
            disabled={running}
          >
            {running
              ? "⏳ Running..."
              : "▶ Run Code"}
          </button>

          {/* COPY */}
          <button
            className="copy-code-btn"
            onClick={copyCode}
          >
            📋 Copy Code
          </button>

          {/* DOWNLOAD */}
          <button
            className="download-code-btn"
            onClick={downloadCode}
          >
            ⬇ Download Code
          </button>

        </div>
      </div>

      {/* ===========================
          MONACO EDITOR
      =========================== */}
      <div className="monaco-wrapper">

        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) =>
            onCodeChange(value || "")
          }
          options={{
            fontSize: 15,

            minimap: {
              enabled: false,
            },

            automaticLayout: true,

            wordWrap: "on",

            scrollBeyondLastLine: false,

            cursorBlinking: "smooth",

            renderWhitespace: "selection",
          }}
        />

      </div>

      {/* ===========================
          OUTPUT CONSOLE
      =========================== */}
      <div className="output-container">

        <div className="output-header">

          <span>
            🖥️ Output
          </span>

          <button onClick={clearOutput}>
            Clear
          </button>

        </div>

        <pre className="output-content">
          {output ||
            "Run your JavaScript code to see the output here..."}
        </pre>

      </div>

    </div>
  );
}

export default CodeEditor;