"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
}

interface TokenPayload {
  userId: number;
  owner?: boolean;
  email: string;
}

export default function SolicitacoesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Verifica se o token é válido e se é do owner (mendes)
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token do localStorage:", token);
    if (!token) return router.push("/admin/login");

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      console.log("Payload decodificado:", decoded);
    
      if (!decoded.owner || decoded.email !== 'mendes') {

        setError("Acesso negado.");
            console.log("Usuário não é owner, redirecionando para login.");
        return router.push("/admin/post");
      }
    } catch (err) {
      console.error("Token inválido", err);
      return router.push("/admin/login");
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("https://backend-acervo.onrender.com/admin/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err: any) {
      console.error("Erro na requisição /admin/pending:", err.response || err);
        setError("Erro ao buscar usuários.");
        router.push("/admin/login");
      }
    };

    fetchData();
  }, [router]);

  const aprovarUsuario = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`https://backend-acervo.onrender.com/admin/approve/${id}`, null, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err);
      setError("Erro ao aprovar usuário.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Solicitações de Cadastro</h1>
      {error && <p style={styles.error}>{error}</p>}

      {users.length === 0 ? (
        <p style={styles.empty}>Nenhuma solicitação pendente.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} style={styles.card}>
            <span>{user.email}</span>
            <button style={styles.button} onClick={() => aprovarUsuario(user.id)}>
              Aprovar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "2rem",
    color: "#00f0ff",
    textShadow: "0 0 10px #00f0ff",
  },
  card: {
    backgroundColor: "#2e2e48",
    padding: "1rem 2rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 0 10px #111",
  },
  button: {
    backgroundColor: "#00ffb3",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#000",
    boxShadow: "0 0 10px #00ffb3",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  empty: {
    color: "#aaa",
    fontStyle: "italic",
  },
};
