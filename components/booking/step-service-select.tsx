"use client";

import { useLocale } from "@/lib/locale-context";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export function StepServiceSelect({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLocale();
  const serviceIcons = ["💅", "💎", "🦶", "✨"];

  return (
    <div className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-center mb-4">
        {t("booking.chooseService")}
      </h2>
      {services.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 text-sm">
          {t("booking.serviceEmpty")}
        </p>
      ) : (
        services.map((service, i) => (
          <button
            type="button"
            key={service.id}
            className={`rounded-xl border-2 p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-pink-300 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-1 ${
              selectedId === service.id
                ? "border-pink-600 bg-pink-50 shadow-sm"
                : "border-transparent bg-white shadow-sm hover:shadow-md"
            }`}
            onClick={() => onSelect(service.id)}
          >
            <div className="text-2xl w-11 h-11 flex items-center justify-center bg-pink-100 rounded-full">
              {serviceIcons[i % serviceIcons.length]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{service.name}</p>
              <p className="text-xs text-muted-foreground">
                {service.duration} {t("services.minutes")}
              </p>
            </div>
            <p className="font-bold text-pink-600 text-sm whitespace-nowrap">
              ₱{service.price.toFixed(0)}
            </p>
          </button>
        ))
      )}
    </div>
  );
}
