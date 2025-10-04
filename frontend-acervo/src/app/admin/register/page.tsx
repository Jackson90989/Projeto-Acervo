"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss"; // certifique-se que este arquivo existe

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post("https://backend-acervo.onrender.com/auth/register", {
        email,
        password,
      });

      alert("Cadastro realizado com sucesso!");
      router.push("/admin/login");
    } catch (err: any) {
      console.error("Erro no cadastro:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erro ao cadastrar");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Cadastro de Admin</h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button onClick={handleRegister} className={styles.button}>
          Cadastrar
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
