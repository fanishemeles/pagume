import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import logo from "../public/logo.png";
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const chatEndRef = useRef(null);

  // --- Load saved chat ---
  useEffect(() => {
    const saved = localStorage.getItem("pagume_chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // --- Save + scroll when updated ---
  useEffect(() => {
    localStorage.setItem("pagume_chat", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const categories = ["Agriculture", "Finance", "Health", "Education"];
  const handleCategory = (cat) => {
    const preset =
      language === "am"
        ? `እባክህ መረጃ ስጠኝ ስለ ${cat}.`
        : `Tell me something about ${cat}.`;
    setInput(preset);
  };

  // --- Typing effect helper ---
  async function typeReply(fullText) {
    let i = 0;
    const speed = 15; // milliseconds per character
    while (i <= fullText.length) {
      const partial = fullText.slice(0, i);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].text = partial;
        return copy;
      });
      await new Promise((r) => setTimeout(r, speed));
      i++;
    }
  }

  // --- Send message to Gemini backend ---
  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages((p) => [...p, { role: "user", text }]);
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

      const data = await res.json();
      const reply = (data.reply || "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .join("\n\n");

      // add empty ai message first
      setMessages((p) => [...p, { role: "ai", text: "" }]);
      await typeReply(reply);
    } catch (err) {
      setMessages((p) => [
        ...p,
        { role: "ai", text: "⚠️ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const clearChat = () => {
    if (confirm("Clear all messages?")) {
      setMessages([]);
      localStorage.removeItem("pagume_chat");
    }
  };

  return (
    <>
      <Head>
        <title>Pagume AI v4 🌍</title>
      </Head>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Pagume AI v4 🌍</h1>
          <div style={styles.logoBox}>
  <Image src={logo} alt="Pagume AI logo" width={64} height={64} />
</div>
          <p style={styles.subtitle}>
            Talk in{" "}
            <b>{language === "am" ? "አማርኛ (Amharic)" : "English"}</b> — Gemini 2.0 Flash
          </p>
          <div style={styles.topButtons}>
            <button
              style={language === "am" ? styles.activeBtn : styles.langBtn}
              onClick={() => setLanguage("am")}
            >
              🇪🇹 አማርኛ
            </button>
            <button
              style={language === "en" ? styles.activeBtn : styles.langBtn}
              onClick={() => setLanguage("en")}
            >
              🇬🇧 English
            </button>
            <button style={styles.clearBtn} onClick={clearChat}>
              🗑 Clear
            </button>
          </div>
        </header>

        <div style={styles.catRow}>
          {categories.map((c) => (
            <button key={c} style={styles.catBtn} onClick={() => handleCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        <section style={styles.chatBox}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#2f81f7" : "#222",
              }}
            >
              {m.text.split("\n").map((line, j) => (
                <p key={j} style={styles.paragraph}>
                  {line}
                </p>
              ))}
            </div>
          ))}
          {loading && <p style={styles.thinking}>Pagume AI is thinking …</p>}
          <div ref={chatEndRef} />
        </section>

        <footer style={styles.inputRow}>
          <textarea
            style={styles.input}
            placeholder={
              language === "am"
                ? "መልእክትዎን እዚህ ያዝ ..."
                : "Type your message..."
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
          <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>
            {loading ? "…" : "Send"}
          </button>
        </footer>
      </main>
    </>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  main: {
    background: "#0d0d0d",
    color: "#f3f3f3",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, sans-serif",
  },
  header: { textAlign: "center", paddingTop: "0.5rem" },
  title: { marginBottom: "0.3rem" },
  subtitle: { opacity: 0.8, marginBottom: "0.5rem" },
  topButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "0.4rem",
  },
  langBtn: {
    background: "#1a1a1a",
    color: "#ccc",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "0.3rem 0.8rem",
  },
  activeBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.3rem 0.8rem",
    fontWeight: 600,
  },
  clearBtn: {
    background: "#ff5555",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.3rem 0.8rem",
    fontWeight: 600,
  },
  catRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.4rem",
    padding: "0.3rem",
  },
  catBtn: {
    background: "#2f81f7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.3rem 0.7rem",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  chatBox: {
  flex: "none",           // disables auto full height
  height: "45vh",         // controls the message box height (~45% of screen)
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  padding: "0.8rem",
  margin: "0.5rem",
  border: "1px solid #222",
  borderRadius: "10px",
  scrollBehavior: "smooth",
},
  msg: {
    margin: "0.4rem 0",
    padding: "0.5rem 0.8rem",
    borderRadius: "10px",
    maxWidth: "80%",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  paragraph: { margin: "0.2rem 0" },
  thinking: {
    opacity: 0.6,
    fontStyle: "italic",
    fontSize: "0.9rem",
    marginTop: "0.3rem",
  },
  inputRow: {
    display: "flex",
    background: "#111",
    padding: "0.4rem",
    borderTop: "1px solid #222",
  },
  input: {
    flex: 1,
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem",
    background: "#000",
    color: "#fff",
    fontSize: "0.95rem",
    height: "2.2rem",
    resize: "none",
  },
  sendBtn: {
    marginLeft: "0.4rem",
    background: "#22c55e",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    padding: "0.4rem 0.9rem",
    cursor: "pointer",
  },
};