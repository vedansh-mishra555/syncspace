import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import "../styles/CodeEditor.css";

function CodeEditor({ code, onCodeChange }) {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied successfully!");
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h3>💻 Collaborative Code Editor</h3>

        <button
          className="copy-code-btn"
          onClick={copyCode}
        >
          📋 Copy Code
        </button>
      </div>

      <Editor
        height="90vh"
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
        }}
      />
    </div>
  );
}

export default CodeEditor;