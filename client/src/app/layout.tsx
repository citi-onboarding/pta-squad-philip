import type { Metadata } from "next";
import "styles/globals.css";

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
      <body>{children}</body>
    </html>
  );
}