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

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Animal Adoption Platform</h1>
      <p>Login to view animal records.</p>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Login</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ display: "block", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={{ display: "block", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <button onClick={login} style={{ padding: "0.5rem 1rem" }}>
          Login
        </button>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Animals</h2>

        <button
          onClick={fetchAnimals}
          disabled={!token}
          style={{ padding: "0.5rem 1rem" }}
        >
          Get Animals
        </button>

        <p>{message}</p>

        {animals.length === 0 ? (
          <p>No animals loaded yet.</p>
        ) : (
          <ul>
            {animals.map((animal) => (
              <li key={animal._id} style={{ marginBottom: "1rem" }}>
                <strong>{animal.name}</strong>
                <br />
                Species: {animal.species}
                <br />
                Breed: {animal.breed || "N/A"}
                <br />
                Age: {animal.age} {animal.ageUnit}
                <br />
                Sex: {animal.sex || "N/A"}
                <br />
                Status: {animal.verificationStatus || "N/A"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}