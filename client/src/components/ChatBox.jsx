import { useEffect, useRef } from "react";
import "../styles/ChatBox.css";

function ChatBox({
  messages,
  message,
  setMessage,
  sendMessage,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-container">

      <div className="chat-header">
        💬 Room Chat
      </div>

      <div className="chat-messages">

        {messages.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            No messages yet...
          </p>
        ) : (
          messages.map((msg, index) => (
            <div className="message" key={index}>
              <strong>{msg.user}</strong>
              <p>{msg.text}</p>
            </div>
          ))
        )}

        <div ref={messagesEndRef}></div>

      </div>
      onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
}}

      <div className="chat-input">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatBox;