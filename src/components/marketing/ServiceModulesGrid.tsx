"use client";

import { ServiceModuleCard } from "@/components/marketing/ServiceModuleCard";
import { serviceModules } from "@/config/marketing";

const accents: Array<"milo" | "clinical"> = ["milo", "clinical", "milo"];

export function ServiceModulesGrid() {
  return (
    <div className="mt-20 grid gap-6 md:grid-cols-3">
      {serviceModules.map((module, index) => (
        <ServiceModuleCard
          key={module.href}
          title={module.title}
          description={module.description}
          href={module.href}
          index={index}
          accent={accents[index]}
        />
      ))}
    </div>
  );
}
