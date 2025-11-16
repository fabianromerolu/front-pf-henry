export const translateFuel = (value?: string) => {
  const map: Record<string, string> = {
    GASOLINE: "Gasolina",
    DIESEL: "Diésel",
    HYBRID: "Híbrido",
    ELECTRIC: "Eléctrico",
  };
  return map[value || ""] ?? value ?? "";
};

export const translateTransmission = (value?: string) => {
  const map: Record<string, string> = {
    AUTOMATIC: "Automática",
    MANUAL: "Manual",
  };
  return map[value || ""] ?? value ?? "";
};

export const translateCategory = (value?: string) => {
  const map: Record<string, string> = {
    SUV: "SUV",
    SEDAN: "Sedán",
    TRUCK: "Camioneta",
    VAN: "Van",
    PREMIUM: "Premium",
    ECONOMY: "Económico",
  };
  return map[value || ""] ?? value ?? "";
};
