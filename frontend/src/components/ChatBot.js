import React, { useState } from "react";
import axios from "axios";
import API_URL from "../api";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, from: "user" };
    setMessages(prev => [...prev, userMsg]);

    try {
      const url = API_URL ? `${API_URL}/chat` : "/chat";
      console.log("Sending request to:", url);
      console.log("API_URL:", API_URL);
      
      const res = await axios.post(url, { text: input });
      const botMsg = {
        text: res.data.answer || res.data.message,
        from: "bot",
        source: res.data.source
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);
      
      const errorMsg = err.response?.data?.error || err.message || "Ошибка сервера";
      setMessages(prev => [...prev, { 
        text: `Ошибка: ${errorMsg}`, 
        from: "bot" 
      }]);
    }

    setInput("");
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>ChatBot</h2>
      <div style={{ border: "1px solid #ccc", padding: "0.5rem", height: "200px", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "user" ? "right" : "left" }}>
            <strong>{m.from === "user" ? "Вы" : "Бот"}:</strong> {m.text}
          </div>
        ))}
      </div>
      <input
        style={{ width: "70%" }}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
};

export default ChatBot;
