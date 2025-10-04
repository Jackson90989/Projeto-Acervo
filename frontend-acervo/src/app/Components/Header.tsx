// Header.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    router.push("/");
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]); // 🟢 revalida ao mudar de página

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/" className={pathname === "/" ? styles.active : ""}>Home</Link>
        <Link href="/books" className={pathname === "/books" ? styles.active : ""}>Livros para Baixar</Link>
        <Link href="/games" className={pathname === "/games" ? styles.active : ""}>Jogos Download</Link>
        <Link href="/livrospg" className={pathname === "/livrospg" ? styles.active : ""}>Livros Online</Link>
        <Link href="/freegame" className={pathname === "/freegame" ? styles.active : ""}>Jogos Online</Link>


        {!isLogged && (
          <>
            <Link href="/admin/login" className={pathname === "/admin/login" ? styles.active : ""}>
              Login
            </Link>
            <Link href="/admin/register" className={pathname === "/admin/register" ? styles.active : ""}>
              Cadastrar
            </Link>
          </>
        )}

        {isLogged && (
          <>
            <Link href="/admin/post" className={pathname === "/admin/post" ? styles.active : ""}>
              Postar Conteúdo
            </Link>
            <Link href="/admin/solicitacoes" className={pathname === "/admin/solicitacoes" ? styles.active : ""}>
              Solicitações
            </Link>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
