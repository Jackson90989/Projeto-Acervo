"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss"; // seu sass

interface Game {
  id: number;
  title: string;
  short_description: string;
  thumbnail: string;
  game_url: string;
}

export default function Jogos() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 6;

  useEffect(() => {
    fetch("/api/freetogame")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.error("Erro ao carregar dados:", data.error);
        }
      })
      .catch((err) => console.error("Erro no fetch:", err));
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

  function renderPaginationButtons() {
    const pages: (number | string)[] = [];
    const lastPage = totalPages;
    const current = currentPage;

    pages.push(1); // primeira página

    if (current > 3) {
      pages.push("start-ellipsis");
    }

    const startPage = Math.max(2, current - 1);
    const endPage = Math.min(lastPage - 1, current + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (current < lastPage - 2) {
      pages.push("end-ellipsis");
    }

    if (lastPage > 1) {
      pages.push(lastPage); // última página
    }

    return pages.map((page, idx) => {
      if (page === "start-ellipsis" || page === "end-ellipsis") {
        return (
          <span key={page + idx} className={styles.ellipsis}>
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => goToPage(page as number)}
          className={page === current ? styles.pageButtonActive : styles.pageButton}
          disabled={page === current}
        >
          {page}
        </button>
      );
    });
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Jogos Online</h1>

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

      {games.length === 0 ? (
        <p className={styles.loading}>Carregando jogos...</p>
      ) : filteredGames.length === 0 ? (
        <p className={styles.loading}>Nenhum jogo encontrado.</p>
      ) : (
        <div className={styles.grid}>
          {currentGames.map((game) => (
            <div key={game.id} className={styles.card}>
              <img src={game.thumbnail} alt={game.title} className={styles.gameThumbnail} />
              <h2>{game.title}</h2>
              <p>{game.short_description}</p>
              <a
                href={game.game_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
              >
                Jogar Agora
              </a>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          &laquo; Anterior
        </button>

        {renderPaginationButtons()}

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
