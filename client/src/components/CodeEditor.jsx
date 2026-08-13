import Editor from "@monaco-editor/react";
import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/CodeEditor.css";

function CodeEditor({ code, onCodeChange }) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // ============================
  // COPY CODE
  // ============================
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy code.");
    }
  };

  // ============================
  // DOWNLOAD CODE
  // ============================
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

  // ============================
  // RUN CODE
  // ============================
  const runCode = () => {
    setIsRunning(true);
    setOutput("");

    try {
      const logs = [];

      // Capture console.log
      const customConsole = {
        log: (...args) => {
          logs.push(
            args
              .map((arg) => {
                if (typeof arg === "object") {
                  return JSON.stringify(arg, null, 2);
                }

                return String(arg);
              })
              .join(" ")
          );
        },

        error: (...args) => {
          logs.push(
            "ERROR: " +
              args
                .map((arg) => String(arg))
                .join(" ")
          );
        },

        warn: (...args) => {
          logs.push(
            "WARNING: " +
              args
                .map((arg) => String(arg))
                .join(" ")
          );
        },
      };

      // Execute JavaScript
      const executeCode = new Function(
        "console",
        code
      );

      executeCode(customConsole);

      if (logs.length === 0) {
        setOutput("Code executed successfully.\nNo output.");
      } else {
        setOutput(logs.join("\n"));
      }

      toast.success("Code executed successfully!");
    } catch (error) {
      setOutput(`❌ ${error.name}: ${error.message}`);
      toast.error("Code execution failed!");
    }

    setIsRunning(false);
  };

  // ============================
  // CLEAR OUTPUT
  // ============================
  const clearOutput = () => {
    setOutput("");
  };

  return (
    <div className="editor-container">

      {/* ============================
          EDITOR HEADER
      ============================ */}
      <div className="editor-header">

        <div className="editor-title">
          <h3>💻 Collaborative Code Editor</h3>

          <span className="language-badge">
            JavaScript
          </span>
        </div>

        <div className="editor-actions">

          {/* RUN */}
          <button
            className="run-code-btn"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? "⏳ Running..." : "▶ Run Code"}
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

      {/* ============================
          MONACO EDITOR
      ============================ */}
      <Editor
        height="calc(100% - 60px)"
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
          wordWrap: "on",
          scrollBeyondLastLine: false,
          cursorBlinking: "smooth",
          renderWhitespace: "selection",
          padding: {
            top: 10,
          },
        }}
      />

      {/* ============================
          OUTPUT CONSOLE
      ============================ */}
      <div className="output-container">

        <div className="output-header">

          <span>🖥️ Output</span>

          <button onClick={clearOutput}>
            Clear
          </button>

        </div>

        <pre className="output-content">
          {output || "Run your JavaScript code to see the output here..."}
        </pre>

      </div>

    </div>
  );
}

export default CodeEditor;