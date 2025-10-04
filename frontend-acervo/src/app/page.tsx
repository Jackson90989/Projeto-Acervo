"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./page.module.scss";

const carouselImages = [
  {
    src: "/carousel1.webp",
    alt: "Imagem ilustrativa 1",
  },
  {
    src: "/carousel2.png",
    alt: "Imagem ilustrativa 2",
  },
  {
    src: "/carousel3.png",
    alt: "Imagem ilustrativa 3",
  },
];

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide]);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    router.push("/admin/login");
  };

  return (
    <>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Bem-vindo ao nosso Acervo </h1>
          <p>
            Aqui você encontra livros em PDF e jogos em Python para baixar gratuitamente.
            Administradores podem postar novos conteúdos para toda a comunidade.
          </p>

          <div className={styles.ctaButtons}>
            <Link href="/books" className={styles.buttonPrimary}>
              Ver Livros
            </Link>
            <Link href="/games" className={styles.buttonSecondary}>
              Ver Jogos
            </Link>
          </div>

          {/* Carrossel de imagens */}
          <div className={styles.carousel}>
            <img
              src={carouselImages[currentSlide].src}
              alt={carouselImages[currentSlide].alt}
              className={styles.carouselImage}
            />
            <div className={styles.carouselDots}>
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  className={
                    i === currentSlide
                      ? styles.carouselDotActive
                      : styles.carouselDot
                  }
                  onClick={() => goToSlide(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.volunteering}>
          <h2>Seja um Voluntário Administrador</h2>
          <p>
            Estamos sempre buscando pessoas engajadas e dedicadas para ajudar a manter e expandir nosso acervo digital.
            Como voluntário administrador, você poderá contribuir postando novos livros e jogos para a comunidade,
            ajudando a tornar nosso projeto ainda mais completo e acessível.
            <br />
            <br />
            Interessado? Entre em contato conosco pelo e-mail{" "}
            <a href="mailto:contato@acervodigital.com" className={styles.emailLink}>
              contato@acervodigital.com
            </a>{" "}
            para saber como se tornar parte da equipe e fazer a diferença!
          </p>
        </section>

        <section className={styles.testimonials}>
          <h2>O que nossos usuários dizem</h2>
          <div className={styles.testimonialList}>
            <blockquote>
              <p>
                "A biblioteca digital é fantástica! Encontrei ótimos livros para meus estudos."
              </p>
              <footer>– Ana Silva</footer>
            </blockquote>

            <blockquote>
              <p>
                "Os jogos em Python são incríveis e fáceis de baixar. Recomendo muito!"
              </p>
              <footer>– João Pereira</footer>
            </blockquote>

            <blockquote>
              <p>
                "A interface é simples e prática, além do conteúdo ser gratuito. Excelente!"
              </p>
              <footer>– Mariana Costa</footer>
            </blockquote>
          </div>
        </section>
      </main>
    </>
  );
}
