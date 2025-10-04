"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.scss";

interface Book {
  id: number;
  title: string;
  description: string;
  filePath: string;
  coverImagePath?: string; // novo campo opcional para capa
}

export default function Page() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    axios.get("https://backend-acervo.onrender.com/books").then((res) => {
      setBooks(res.data);
    });
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Garante que currentPage nunca ultrapasse totalPages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Livros Disponíveis</h1>

      <input
        type="text"
        placeholder="Pesquisar livros..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className={styles.searchInput}
      />

      {books.length === 0 ? (
        <p className={styles.loading}>Carregando livros...</p>
      ) : filteredBooks.length === 0 ? (
        <p className={styles.loading}>Nenhum livro encontrado.</p>
      ) : (
        <>
          <div className={styles.grid}>
            {currentBooks.map((book) => (
              <div key={book.id} className={styles.card}>
                {book.coverImagePath && (
                  <img
                    src={`https://backend-acervo.onrender.com/files/${book.coverImagePath}`}
                    alt={`Capa do livro ${book.title}`}
                    className={styles.coverImage}
                  />
                )}
                <h2>{book.title}</h2>
                <p>{book.description}</p>
                <a
                  href={`https://backend-acervo.onrender.com/downloadBook/${book.filePath}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.button}
                >
                  Baixar PDF
                </a>
              </div>
            ))}
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
                className={
                  page === currentPage
                    ? styles.pageButtonActive
                    : styles.pageButton
                }
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
        </>
      )}
    </div>
  );
}
