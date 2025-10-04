"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import styles from "./page.module.scss";

interface TokenPayload {
  userId: number;
  email: string;
  approved: boolean;
  owner?: boolean;
  exp: number;
  iat: number;
}

export default function AdminLoginPage() {
  const [email, setText] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://backend-acervo.onrender.com/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<TokenPayload>(token);

      if (decoded.owner || decoded.email !== "mendes") {
        router.push("/admin/solicitacoes");
      } else {
        router.push("/admin/post");
      }
    } catch (err: any) {
      console.error(err);
      setError("Login inválido");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login do Admin</h1>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          autoComplete="current-password"
        />

        <button onClick={handleLogin} className={styles.button} type="button">
          Entrar
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
