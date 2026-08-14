import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import "./ChatWidget.css";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your Route Rakshak safety assistant. Ask me about road safety, emergency steps, or first aid tips.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const clearChat = () => {
  setMessages([
    {
      sender: "bot",
      text: "Hi! I'm your Route Rakshak safety assistant. Ask me about road safety, emergency steps, or first aid tips.",
    },
  ]);
};

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("policeToken");

      const response = await axios.post(
        `${BASE_URL}/api/ai/chat`,
        {
          message: input,
          history: newMessages.slice(-6),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([
        ...newMessages,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch (error) {
      console.log(error);
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Sorry, I couldn't respond right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          🤖
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
  <span>🤖 Safety Assistant</span>

  <div>
    <button
      className="chat-clear-btn"
      onClick={clearChat}
      title="Clear Chat"
    >
      🗑️
    </button>

    <button
      className="chat-close-btn"
      onClick={() => setIsOpen(false)}
    >
      ✕
    </button>
  </div>
</div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble chat-bubble-bot">
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Ask about safety..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-input"
            />
            <button onClick={sendMessage} className="chat-send-btn">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;