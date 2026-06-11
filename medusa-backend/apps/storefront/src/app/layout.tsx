import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Tienda | Mailo y sus Amigos",
    template: "%s | Mailo y sus Amigos",
  },
  description:
    "Pet shop online: alimentos, accesorios y medicamentos para tu mascota en Chile.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
