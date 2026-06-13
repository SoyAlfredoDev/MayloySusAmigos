export const siteConfig = {
  name: "Mailo y sus Amigos",
  logo: {
    src: "/images/logo-mailo-y-sus-amigos.png",
    alt: "Mailo y sus Amigos — Clínica veterinaria, pet shop y peluquería",
  },
  description:
    "Clínica veterinaria, pet shop y peluquería canina en Chile.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "es-CL",
  currency: "CLP",
  timezone: "America/Santiago",
  contact: {
    phone: "+56 9 XXXX XXXX",
    email: "hola@mailoyusamigos.cl",
    address: "Tu dirección, Comuna, Región Metropolitana",
  },
  admin: {
    label: "Panel Admin",
    href: "/admin",
  },
  nav: {
    main: [
      { label: "Inicio", href: "/" },
      { label: "Tienda", href: "/tienda" },
      { label: "Veterinaria", href: "/veterinaria" },
      { label: "Peluquería", href: "/peluqueria" },
    ],
    account: [
      { label: "Mi perfil", href: "/cuenta/perfil" },
      { label: "Mis mascotas", href: "/cuenta/mascotas" },
      { label: "Mis pedidos", href: "/cuenta/pedidos" },
      { label: "Mis citas", href: "/cuenta/citas" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
