"use client";

import { useState } from "react";
import { StepServiceSelect } from "./step-service-select";
import { StepDateTime } from "./step-date-time";
import { StepCustomerInfo } from "./step-customer-info";
import { BookingConfirmation } from "./booking-confirmation";
import { useLocale } from "@/lib/locale-context";

type Step = "service" | "datetime" | "info" | "confirm";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface BookingResult {
  id: string;
  status: string;
  customerName: string;
  serviceName: string;
  startTime: string;
}

export function BookingWizard({ services }: { services: Service[] }) {
  const [step, setStep] = useState<Step>("service");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  const selectedService = services.find((s) => s.id === selectedServiceId);

  async function handleConfirm() {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError(null);

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    const formData = new FormData();
    formData.set("serviceId", selectedService.id);
    formData.set("customerName", customerName);
    formData.set("customerPhone", customerPhone);
    formData.set("customerEmail", customerEmail);
    formData.set("startTime", startTime.toISOString());
    formData.set("notes", notes);
    formData.set("smsConsent", smsConsent ? "true" : "false");

    try {
      const { createBookingAction } = await import("@/actions/booking");
      const result = await createBookingAction(formData);

      if (result.success && result.booking) {
        setBookingResult(result.booking);
        setStep("confirm");
      } else {
        setError(result.error || t("booking.errorGeneric"));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("booking.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("service");
    setSelectedServiceId("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setNotes("");
    setBookingResult(null);
    setError(null);
  }

  const stepLabels = [t("booking.stepService"), t("booking.stepDateTime"), t("booking.stepInfo")];
  const stepKeys: Step[] = ["service", "datetime", "info"];
  const stepIndex = stepKeys.indexOf(step);

  return (
    <div>
      {step !== "confirm" && (
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-center text-pink-800 mb-6">
            {t("booking.title")}
          </h1>
          <div className="flex items-center justify-center gap-0 max-w-sm mx-auto" role="progressbar" aria-label={t("booking.title")}>
            {stepLabels.map((label, i) => {
              const isActive = i <= stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-pink-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-400"
                      } ${isCurrent ? "ring-2 ring-pink-300 ring-offset-1 scale-110" : ""}`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isActive && i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-xs mt-1.5 whitespace-nowrap transition-colors duration-300 ${
                        isActive ? "text-pink-700 font-semibold" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mt-[-1.25rem] bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-pink-600 rounded-full transition-all duration-500 ease-out ${
                          i < stepIndex ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div key={step} className={direction === "forward" ? "animate-slide-right" : "animate-slide-left"}>
        {step === "service" && (
          <StepServiceSelect
            services={services}
            selectedId={selectedServiceId}
            onSelect={(id) => {
              setSelectedServiceId(id);
              setDirection("forward");
              setStep("datetime");
            }}
          />
        )}

        {step === "datetime" && selectedService && (
          <StepDateTime
            serviceDuration={selectedService.duration}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            onBack={() => {
              setDirection("back");
              setStep("service");
            }}
            onNext={() => {
              if (selectedDate && selectedTime) {
                setDirection("forward");
                setStep("info");
              }
            }}
            dateSelected={!!selectedDate}
            timeSelected={!!selectedTime}
          />
        )}

        {step === "info" && selectedService && selectedDate && selectedTime && (
          <StepCustomerInfo
            name={customerName}
            phone={customerPhone}
            email={customerEmail}
            notes={notes}
            smsConsent={smsConsent}
            serviceName={selectedService.name}
            servicePrice={selectedService.price}
            date={selectedDate}
            time={selectedTime}
            onNameChange={setCustomerName}
            onPhoneChange={setCustomerPhone}
            onEmailChange={setCustomerEmail}
            onNotesChange={setNotes}
            onSmsConsentChange={setSmsConsent}
            onBack={() => {
              setDirection("back");
              setStep("datetime");
            }}
            onConfirm={handleConfirm}
            loading={loading}
            error={error}
          />
        )}

        {step === "confirm" && bookingResult && (
          <BookingConfirmation booking={bookingResult} onNewBooking={reset} />
        )}
      </div>
    </div>
  );
}
