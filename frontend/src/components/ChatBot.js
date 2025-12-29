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
      const res = await axios.post(`${API_URL}/chat`, { text: input });
      const botMsg = {
        text: res.data.answer || res.data.message,
        from: "bot",
        source: res.data.source
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { text: "Ошибка сервера", from: "bot" }]);
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
