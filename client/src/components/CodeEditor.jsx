import Editor from "@monaco-editor/react";

function CodeEditor({ code, onCodeChange }) {
  return (
    <Editor
      height="100vh"
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
  );
}

export default CodeEditor;