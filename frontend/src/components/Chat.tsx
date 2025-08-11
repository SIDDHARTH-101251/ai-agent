import React, { useState, useRef, useEffect } from "react";
import { askBackend } from "../api";

export default function Chat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const content = input.trim();
    if (!content) return;
    setMessages((m) => [...m, { role: "user", text: content }]);
    setInput("");
    try {
      const res = await askBackend(content, sessionId);
      setSessionId(res.session_id);
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Error: ${err?.message || err}` },
      ]);
    }
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={onSend} className="input-row">
        <input
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
