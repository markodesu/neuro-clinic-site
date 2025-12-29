import React from "react";
import FAQList from "./components/FAQList.js";
import ChatBot from "./components/ChatBot";
import QuestionsList from "./components/QuestionList";

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>Neuro Clinic</h1>
      <ChatBot />
      <FAQList />
      <QuestionsList />
    </div>
  );
}

export default App;
