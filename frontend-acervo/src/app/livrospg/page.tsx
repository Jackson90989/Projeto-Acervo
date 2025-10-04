"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss"; // ou "./Books.module.scss" se estiver usando outro nome

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    const query = searchTerm.trim() || "programming";

    fetch(`http://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.docs) {
          setBooks(data.docs);
          setCurrentPage(1);
        }
      })
      .catch(console.error);
  }, [searchTerm]);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  function renderPaginationButtons() {
  const buttons = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={i === currentPage ? styles.pageButtonActive : styles.pageButton}
        >
          {i}
        </button>
      );
    }
  } else {
    if (currentPage === 1) {
      buttons.push(
        <button key={1} onClick={() => goToPage(1)} className={styles.pageButtonActive}>1</button>,
        <button key={2} onClick={() => goToPage(2)} className={styles.pageButton}>2</button>,
        <span key="dots" className={styles.dots}>...</span>,
        <button key={totalPages} onClick={() => goToPage(totalPages)} className={styles.pageButton}>{totalPages}</button>
      );
    } else if (currentPage === 2) {
      buttons.push(
        <button key={1} onClick={() => goToPage(1)} className={styles.pageButton}>1</button>,
        <button key={2} onClick={() => goToPage(2)} className={styles.pageButtonActive}>2</button>,
        <button key={3} onClick={() => goToPage(3)} className={styles.pageButton}>3</button>,
        <span key="dots" className={styles.dots}>...</span>,
        <button key={totalPages} onClick={() => goToPage(totalPages)} className={styles.pageButton}>{totalPages}</button>
      );
    } else if (currentPage < totalPages - 2) {
      buttons.push(
        <button key={1} onClick={() => goToPage(1)} className={styles.pageButton}>1</button>,
        <span key="dots-start" className={styles.dots}>...</span>,
        <button key={currentPage - 1} onClick={() => goToPage(currentPage - 1)} className={styles.pageButton}>{currentPage - 1}</button>,
        <button key={currentPage} onClick={() => goToPage(currentPage)} className={styles.pageButtonActive}>{currentPage}</button>,
        <button key={currentPage + 1} onClick={() => goToPage(currentPage + 1)} className={styles.pageButton}>{currentPage + 1}</button>,
        <span key="dots-end" className={styles.dots}>...</span>,
        <button key={totalPages} onClick={() => goToPage(totalPages)} className={styles.pageButton}>{totalPages}</button>
      );
    } else {
      buttons.push(
        <button key={1} onClick={() => goToPage(1)} className={styles.pageButton}>1</button>,
        <span key="dots" className={styles.dots}>...</span>
      );

      for (let i = totalPages - 2; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={i === currentPage ? styles.pageButtonActive : styles.pageButton}
          >
            {i}
          </button>
        );
      }
    }
  }

  return buttons;
}

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Livros Na Internet</h1>

      <input
        type="text"
        placeholder="Buscar livros..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {books.length === 0 ? (
        <p className={styles.loading}>Carregando livros...</p>
      ) : currentBooks.length === 0 ? (
        <p className={styles.loading}>Nenhum livro encontrado.</p>
      ) : (
        <div className={styles.grid}>
          {currentBooks.map((book) => (
            <a
              key={book.key}
              href={`http://openlibrary.org${book.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <img
                src={
                  book.cover_i
                    ? `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "/images/capa-padrao.png"
                }
                alt={`Capa do livro ${book.title}`}
                className={styles.bookCover}
              />
              <h2>{book.title}</h2>
              <p>{book.author_name ? book.author_name.join(", ") : "Autor desconhecido"}</p>
              <p>{book.first_publish_year ? `Ano: ${book.first_publish_year}` : ""}</p>
            </a>
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
