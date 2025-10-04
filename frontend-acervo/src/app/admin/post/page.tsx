"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function AdminPostPage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const [type, setType] = useState<"book" | "game">("book");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setHasMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsLogged(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !file) {
      setError("Você precisa estar logado e selecionar um arquivo.");
      setSuccessMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("file", file);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      await axios.post("https://backend-acervo.onrender.com/admin/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage(`${type === "book" ? "Livro" : "Jogo"} postado com sucesso!`);
      setTitle("");
      setDescription("");
      setFile(null);
      setCoverImage(null);
      setError("");
    } catch (err) {
      setError("Erro ao postar conteúdo");
      setSuccessMessage("");
      console.error(err);
    }
  };

  if (!hasMounted) return null;

  const mainFileLabel = type === "book" ? "Escolha arquivo do livro" : "Escolha arquivo do jogo";

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>
          Postar {type === "book" ? "Livro" : "Jogo"}
        </h1>

        {isLogged && (
          <button
            type="button"
            className={styles.logout}
            onClick={() => {
              localStorage.removeItem("token");
              setIsLogged(false);
              router.push("/admin/login");
            }}
          >
            Sair
          </button>
        )}

        <div className={styles.toggle}>
          <label>
            <input
              type="radio"
              checked={type === "book"}
              onChange={() => setType("book")}
            />
            Livro
          </label>
          <label>
            <input
              type="radio"
              checked={type === "game"}
              onChange={() => setType("game")}
            />
            Jogo
          </label>
        </div>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.input}
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className={styles.textarea}
        />

        <div className={styles.fileInputWrapper}>
          <input
            id="fileInput"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className={styles.fileInput}
          />
          <label htmlFor="fileInput" className={styles.fileLabel}>
            {file ? file.name : mainFileLabel}
          </label>
        </div>

        <div className={styles.fileInputWrapper}>
          <input
            id="coverInput"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            className={styles.fileInput}
          />
          <label htmlFor="coverInput" className={styles.fileLabel}>
            {coverImage ? coverImage.name : "Escolha a imagem da capa"}
          </label>
        </div>

        <button type="submit" className={styles.submit}>
          Enviar
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </div>
  );
}
