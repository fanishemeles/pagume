import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pagume AI 🌍</title>
        <meta
          name="description"
          content="Pagume AI — an African-built AI assistant "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Pagume AI 🌍</h1>
        <p style={styles.subtitle}>
          Intelligent conversations in <b>Amharic & English</b> — powered by 
          <span style={{ color: "#2f81f7" }}>Gemini 2.5 Flash</span>.
        </p>

        <Link href="/chat" style={styles.button}>
          🚀 Start Chatting
        </Link>

        <footer style={styles.footer}>
          <p>© 2025 Pagume AI • Built for Africa 🌍</p>
        </footer>
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
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "2rem",
  },
  title: { fontSize: "2.2rem", marginBottom: "1rem" },
  subtitle: { fontSize: "1.1rem", maxWidth: "500px", opacity: 0.9 },
  button: {
    marginTop: "2rem",
    background: "#22c55e",
    color: "#fff",
    textDecoration: "none",
    padding: "0.9rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
  },
  footer: { marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 },
};
