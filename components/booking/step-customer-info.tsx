"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/locale-context";

interface StepCustomerInfoProps {
  name: string;
  phone: string;
  email: string;
  notes: string;
  smsConsent: boolean;
  serviceName: string;
  servicePrice: number;
  date: Date;
  time: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSmsConsentChange: (v: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
}

export function StepCustomerInfo({
  name,
  phone,
  email,
  notes,
  smsConsent,
  serviceName,
  servicePrice,
  date,
  time,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onNotesChange,
  onSmsConsentChange,
  onBack,
  onConfirm,
  loading,
  error,
}: StepCustomerInfoProps) {
  const { t } = useLocale();
  const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString(
    "en-PH",
    { hour: "numeric", minute: "2-digit" }
  );

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold text-center mb-4">
        {t("booking.yourInfo")}
      </h2>

      <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 text-sm space-y-1">
        <p>
          <span className="font-medium">{serviceName}</span>
        </p>
        <p className="text-muted-foreground">
          {date.toLocaleDateString("en-PH", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formattedTime}
        </p>
        <p className="font-semibold text-pink-600">₱{servicePrice.toFixed(0)}</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">{t("booking.fullName")}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t("booking.namePlaceholder")}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">{t("booking.phoneNumber")}</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder={t("booking.phonePlaceholder")}
            required
          />
          <p className="text-xs text-muted-foreground">
            {t("booking.phoneHelper")}
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">{t("booking.emailOptional")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={t("booking.emailPlaceholder")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">{t("booking.notes")}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={t("booking.notesPlaceholder")}
            rows={3}
          />
        </div>
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="smsConsent"
            checked={smsConsent}
            onChange={(e) => onSmsConsentChange(e.target.checked)}
            className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 shrink-0"
          />
          <label htmlFor="smsConsent" className="text-sm text-muted-foreground leading-relaxed">
            {t("legal.smsConsent")}
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-full h-10"
          disabled={loading}
        >
          {t("booking.back")}
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 h-10"
          disabled={loading || !name || !phone || !smsConsent}
        >
          {loading ? t("booking.booking") : t("booking.confirmBooking")}
        </Button>
      </div>
    </div>
  );
}
