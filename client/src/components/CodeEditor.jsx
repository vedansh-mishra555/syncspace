import Editor from "@monaco-editor/react";
import "../styles/CodeEditor.css";

function CodeEditor({ code, onCodeChange }) {
  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-left">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>

          <span className="editor-title">main.js</span>
        </div>

        <div className="editor-right">
          <span className="language">JavaScript</span>

          <button className="run-btn">
            ▶ Run
          </button>
        </div>
      </div>

      <div className="editor-body">
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
    </div>
  );
}

export default CodeEditor;