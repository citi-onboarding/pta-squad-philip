import type { Metadata } from "next";
import "styles/globals.css";
import { Header } from "@/components/header/header";

export const metadata: Metadata = {
  title: "Biblioteca Escolar",
  description: "Sistema de Gestão de Biblioteca Escolar - CITi",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
