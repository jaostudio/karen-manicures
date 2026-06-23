"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useLocale } from "@/lib/locale-context";

export function StepDateTime({
  serviceDuration,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onBack,
  onNext,
  dateSelected,
  timeSelected,
}: {
  serviceDuration: number;
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateSelect: (d: Date | undefined) => void;
  onTimeSelect: (t: string) => void;
  onBack: () => void;
  onNext: () => void;
  dateSelected: boolean;
  timeSelected: boolean;
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetch(`/api/booking?date=${dateStr}&duration=${serviceDuration}`)
      .then((r) => r.json())
      .then((data) => {
        setFetchError(false);
        setSlots(data.slots || []);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [selectedDate, serviceDuration]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold text-center mb-4">
        {t("booking.selectDateTime")}
      </h2>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={(date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d <= today || d > threeMonthsLater || d.getDay() === 0;
        }}
        className="mx-auto rounded-xl border"
      />

      {selectedDate && (
        <div>
          <p className="text-sm font-medium mb-2 text-center">
            {t("booking.availableTimes")} {format(selectedDate, "MMMM d, yyyy")}
          </p>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                {t("booking.loadingTimes")}
              </p>
            </div>
          ) : fetchError ? (
            <p className="text-center text-sm text-red-500">
              {t("booking.errorTimes")}
            </p>
          ) : slots.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("booking.noSlots")}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    className={`rounded-full text-xs h-10 ${
                      selectedTime === slot
                        ? "bg-pink-600 hover:bg-pink-700"
                        : ""
                    }`}
                  onClick={() => onTimeSelect(slot)}
                >
                  {new Date(`2000-01-01T${slot}`).toLocaleTimeString("en-PH", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-full h-10">
          {t("booking.back")}
        </Button>
        <Button
          onClick={onNext}
          disabled={!dateSelected || !timeSelected}
          className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 h-10"
        >
          {t("booking.next")}
        </Button>
      </div>
    </div>
  );
}
