import Link from "next/link";
import {
  Facebook,
  Instagram,
  MessageCircle,
  MapPin,
  Mail,
  AtSign, // Usamos AtSign como alternativa si no tienes el SVG de Threads
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "AQ Chillax, sans-serif" }}
            >
              Milo y sus amigos
            </h3>
            <p className="text-muted-foreground font-sans">
              Cuidamos de tus mejores amigos con el amor y profesionalismo que
              se merecen. Servicios integrales para perros y gatos.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/miloysusamigoscl/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              {/* Corrección de Threads */}
              <Link
                href="https://www.threads.net/@miloysusamigoscl"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm"
              >
                <AtSign className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#021f41]">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Inicio", href: "/" },
                { name: "Servicios", href: "#servicios" },
                { name: "Por qué elegirnos", href: "#nosotros" },
                { name: "Contacto", href: "#contacto" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#021f41]">Servicios</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Consulta Veterinaria</li>
              <li className="text-muted-foreground">Peluquería Canina</li>
              <li className="text-muted-foreground">Peluquería Felina</li>
              <li className="text-muted-foreground">
                Vacunación y Desparasitación
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#021f41]">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-1 text-primary" />
                <span>Mario Alvo Hassan 1489, Santiago, Chile</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>+56 9 3722 9564</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>miloysusamigosspa@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} Milo y sus amigos. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
