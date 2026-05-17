"use client";

import { useState } from "react";

type Animal = {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  ageUnit?: string;
  sex?: string;
  verificationStatus?: string;
};

export default function Home() {
  const [email, setEmail] = useState("admin3@test.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState("");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("Logging in...");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Login failed");
      return;
    }

    setToken(data.token);
    setMessage("Login successful!");
  }

  async function fetchAnimals() {
    setMessage("Fetching animals...");

    const res = await fetch("/api/animals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || data.message || "Failed to fetch animals");
      return;
    }

    setAnimals(data.animals || data);
    setMessage("Animals loaded!");
  }

  function logout() {
    setToken("");
    setAnimals([]);
    setMessage("Logged out.");
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Animal Adoption Platform</h1>
        <p style={styles.subtitle}>
          Securely view animal records and verification details.
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Login</h2>

        <label style={styles.label}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={styles.input}
        />

        <div style={styles.buttonRow}>
          <button onClick={login} style={styles.primaryButton}>
            Login
          </button>

          {token && (
            <button onClick={logout} style={styles.secondaryButton}>
              Logout
            </button>
          )}
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </section>

      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Animals</h2>
          <button
            onClick={fetchAnimals}
            disabled={!token}
            style={{
              ...styles.primaryButton,
              opacity: token ? 1 : 0.5,
              cursor: token ? "pointer" : "not-allowed",
            }}
          >
            Get Animals
          </button>
        </div>

        {animals.length === 0 ? (
          <p style={styles.emptyText}>No animals loaded yet.</p>
        ) : (
          <div style={styles.grid}>
            {animals.map((animal) => (
              <article key={animal._id} style={styles.animalCard}>
                <h3 style={styles.animalName}>{animal.name}</h3>
                <p><strong>Species:</strong> {animal.species}</p>
                <p><strong>Breed:</strong> {animal.breed || "N/A"}</p>
                <p>
                  <strong>Age:</strong> {animal.age ?? "N/A"}{" "}
                  {animal.ageUnit || ""}
                </p>
                <p><strong>Sex:</strong> {animal.sex || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={styles.statusBadge}>
                    {animal.verificationStatus || "N/A"}
                  </span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    padding: "3rem",
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f8",
    color: "#1f2937",
  },
  hero: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#4b5563",
  },
  card: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "2rem",
    maxWidth: "900px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "0.25rem",
  },
  input: {
    display: "block",
    width: "100%",
    maxWidth: "400px",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  buttonRow: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  primaryButton: {
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#1f2937",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
  },
  animalCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem",
    background: "#f9fafb",
  },
  animalName: {
    fontSize: "1.3rem",
    marginBottom: "0.75rem",
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
};