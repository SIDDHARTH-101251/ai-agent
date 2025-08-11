import React from "react";
import Chat from "./components/Chat";
import "./styles.css";

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>Gemini Chatbot</h1>
      </header>
      <Chat />
    </div>
  );
}
