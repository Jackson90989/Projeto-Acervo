import './styles/globals.scss';
import Header from "./Components/Header";

export const metadata = {
  title: 'Catálogo',
  description: 'Sistema de livros e jogos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
