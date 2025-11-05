import { useState } from "react";
import Head from "next/head";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "ai", text: data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "ai", text: "⚠️ " + e.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Pagume AI Chat 🌍</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Pagume AI Chat 🌍</h1>
        <p style={styles.subtitle}>
          Chat in Amharic or English — powered by Gemini 2.5 Flash
        </p>

        <div style={styles.chatBox}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#2f81f7" : "#333",
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && <p style={{ opacity: 0.7 }}>Thinking …</p>}
        </div>

        <div style={styles.inputRow}>
          <textarea
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button style={styles.button} onClick={sendMessage} disabled={loading}>
            {loading ? "…" : "Send"}
          </button>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    background: "#0e0e0e",
    color: "#f3f3f3",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", opacity: 0.8 },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "1rem",
    margin: "1rem 0",
    border: "1px solid #222",
    borderRadius: "10px",
  },
  msg: {
    margin: "0.4rem 0",
    padding: "0.6rem 0.9rem",
    borderRadius: "10px",
    maxWidth: "80%",
    lineHeight: 1.4,
  },
  inputRow: {
    display: "flex",
    background: "#1a1a1a",
    borderRadius: "8px",
    padding: "0.5rem",
  },
  input: {
    flex: 1,
    border: "none",
    borderRadius: "6px",
    padding: "0.6rem",
    background: "#000",
    color: "#fff",
    fontSize: "1rem",
  },
  button: {
    marginLeft: "0.5rem",
    background: "#22c55e",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "0.6rem 1rem",
    cursor: "pointer",
  },
};
