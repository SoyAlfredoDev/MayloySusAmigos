"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Send, MapPin, Phone } from "lucide-react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

export function Contact() {
  // Coordenadas exactas para Mario Alvo Hassan 1489
  const position = { lat: -33.4323684, lng: -70.6587656 };

  return (
    <Section
      id="contacto"
      className="bg-gradient-to-br from-primary/5 to-accent"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Información de Contacto */}
          <div className="p-8 md:p-12 space-y-6">
            <h2 className="text-3xl font-bold">¡Contáctanos!</h2>
            <p className="text-muted-foreground">
              Agenda una cita o visítanos. Tu mascota merece lo mejor.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Ubicación</h4>
                  <p className="text-muted-foreground">
                    Mario Alvo Hassan 1489, Santiago, Chile
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">WhatsApp</h4>
                  <p className="text-muted-foreground">+56 9 3722 9564</p>
                </div>
              </div>
            </div>

            <Button className="w-full gap-2 bg-[#01c676] hover:bg-[#01a562] text-white">
              <Send className="w-4 h-4" />
              Enviar Mensaje
            </Button>
          </div>

          {/* Mapa de Google */}
          <div className="bg-muted h-full min-h-[400px] relative">
            <APIProvider
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            >
              <Map
                defaultCenter={position}
                defaultZoom={15}
                gestureHandling={"greedy"}
                disableDefaultUI={false}
                mapId={"da37f324c0d00b04"}
              >
                <AdvancedMarker position={position}>
                  <Pin
                    background={"#01c676"}
                    glyphColor={"#021f41"}
                    borderColor={"#094fd1"}
                  />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </Section>
  );
}
