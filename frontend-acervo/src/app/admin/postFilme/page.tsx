"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function AdminPostMovie() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);
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

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !coverImage) {
      setError("Você precisa estar logado e selecionar uma imagem de capa.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("coverImage", coverImage);
    if (trailer) formData.append("trailer", trailer);

    try {
      await axios.post("https://backend-acervo.onrender.com/movies", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Filme postado com sucesso!");
      setTitle("");
      setDescription("");
      setCoverImage(null);
      setTrailer(null);
      setError("");
    } catch (err) {
      setError("Erro ao postar filme");
      setSuccessMessage("");
      console.error(err);
    }
  };

  if (!hasMounted) return null;

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className={styles.title}>Postar Filme</h1>

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
            id="coverInput"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            required
            className={styles.fileInput}
          />
          <label htmlFor="coverInput" className={styles.fileLabel}>
            {coverImage ? coverImage.name : "Escolha a imagem da capa"}
          </label>
        </div>

        <div className={styles.fileInputWrapper}>
          <input
            id="trailerInput"
            type="file"
            accept="video/*"
            onChange={(e) => setTrailer(e.target.files?.[0] || null)}
            className={styles.fileInput}
          />
          <label htmlFor="trailerInput" className={styles.fileLabel}>
            {trailer ? trailer.name : "Escolha o arquivo do trailer (opcional)"}
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
