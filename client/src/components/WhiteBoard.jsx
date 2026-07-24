import { Excalidraw } from "@excalidraw/excalidraw";

function Whiteboard() {
  return (
    <div
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <Excalidraw />
    </div>
  );
}

export default Whiteboard;