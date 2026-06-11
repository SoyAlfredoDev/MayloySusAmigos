import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600",  "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Mailo y sus Amigos | Clínica Veterinaria, Pet Shop y Peluquería",
    template: "%s | Mailo y sus Amigos",
  },
  description:
    "Plataforma integral para el cuidado de tu mascota en Chile. Tienda online, consultas veterinarias y peluquería canina.",
  keywords: [
    "veterinaria Chile",
    "pet shop",
    "peluquería canina",
    "citas veterinarias",
    "productos para mascotas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-soft text-ink">
        {children}
      </body>
    </html>
  );
}
