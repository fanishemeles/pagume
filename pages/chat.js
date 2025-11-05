import { useState } from "react";
import Head from "next/head";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en"); // "am" or "en"

  // -------- CATEGORY SHORTCUTS --------
  const categories = ["Agriculture", "Finance", "Health", "Education"];
  function selectCategory(cat) {
    const preset =
      language === "am"
        ? `እባክህ መረጃ ስጠኝ ስለ ${cat}.`
        : `Tell me something about ${cat}.`;
    setInput(preset);
  }

  // -------- SEND MESSAGE --------
  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const langPrefix =
        language === "am"
          ? "Please reply only in Amharic: "
          : "Please reply in English: ";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: langPrefix + text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "(No response)" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // -------- RENDER --------
  return (
    <>
      <Head>
        <title>Pagume AI Chat v2 🌍</title>
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Pagume AI Chat v2 🌍</h1>
        <p style={styles.subtitle}>
          Talk to Pagume AI in <b>{language === "am" ? "አማርኛ" : "English"}</b>{" "}
          — powered by Gemini 2.0 Flash
        </p>

        {/* LANGUAGE TOGGLE */}
        <div style={styles.toggle}>
          <button
            style={language === "am" ? styles.activeBtn : styles.toggleBtn}
            onClick={() => setLanguage("am")}
          >
            🇪🇹 አማርኛ
          </button>
          <button
            style={language === "en" ? styles.activeBtn : styles.toggleBtn}
            onClick={() => setLanguage("en")}
          >
            🇬🇧 English
          </button>
        </div>

        {/* CATEGORY BUTTONS */}
        <div style={styles.catRow}>
          {categories.map((c) => (
            <button key={c} style={styles.catBtn} onClick={() => selectCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* CHAT BOX */}
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
          {loading && <p style={styles.thinking}>Pagume AI is typing …</p>}
        </div>

        {/* INPUT BAR */}
        <div style={styles.inputRow}>
          <textarea
            style={styles.input}
            placeholder={
              language === "am"
                ? "መልእክትዎን እዚህ ያዝ ..."
                : "Type your message here..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            style={styles.sendBtn}
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </main>
    </>
  );
}

// -------- INLINE STYLES --------
const styles = {
  main: {
    background: "#0d0d0d",
    color: "#f3f3f3",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    fontFamily: "system-ui, sans-serif",
  },
  title: { textAlign: "center", margin: "0.5rem 0" },
  subtitle: { textAlign: "center", opacity: 0.85, marginBottom: "1rem" },
  toggle: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  toggleBtn: {
    background: "#1f1f1f",
    color: "#eee",
    border: "1px solid #444",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
  },
  activeBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    fontWeight: 600,
  },
  catRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  catBtn: {
    background: "#2f81f7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
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
  thinking: { opacity: 0.6, fontStyle: "italic" },
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
  sendBtn: {
    marginLeft: "0.5rem",
    background: "#22c55e",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "0.6rem 1rem",
    cursor: "pointer",
  },
};