"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.scss";

interface Game {
  id: number;
  title: string;
  description: string;
  filePath: string;
  coverImagePath?: string;
}

export default function Jogos() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 5;

  useEffect(() => {
    axios.get("https://backend-acervo.onrender.com/games").then((res) => {
      setGames(res.data);
    });
  }, []);

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>Jogos em Python</h1>

      <input
        type="text"
        placeholder="Pesquisar jogos..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className={styles.searchInput}
      />

      <div className={styles.cards}>
        {currentGames.length === 0 ? (
          <p className={styles.loading}>
            {games.length === 0 ? "Carregando jogos..." : "Nenhum jogo encontrado."}
          </p>
        ) : (
          currentGames.map((game) => (
            <div key={game.id} className={styles.card}>
              {game.coverImagePath && (
                <img
                  src={`https://backend-acervo.onrender.com/files/${game.coverImagePath}`}
                  alt={`Capa do jogo ${game.title}`}
                  className={styles.coverImage}
                />
              )}
              <h2 className={styles.cardTitle}>{game.title}</h2>
              <p className={styles.cardDescription}>{game.description}</p>
              <a
                href={`https://backend-acervo.onrender.com/downloadGame/${game.filePath}`}
                download
                target="_blank"
                className={styles.cardButton}
                rel="noreferrer"
              >
                Baixar Jogo
              </a>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          &laquo; Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={page === currentPage ? styles.pageButtonActive : styles.pageButton}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={styles.pageButton}
        >
          Próximo &raquo;
        </button>
      </div>
    </main>
  );
}
