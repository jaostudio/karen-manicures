"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Confetti } from "./confetti";
import { useLocale } from "@/lib/locale-context";

interface BookingResult {
  id: string;
  status: string;
  customerName: string;
  serviceName: string;
  startTime: string;
}

export function BookingConfirmation({
  booking,
  onNewBooking,
}: {
  booking: BookingResult;
  onNewBooking: () => void;
}) {
  const startDate = new Date(booking.startTime);
  const isPending = booking.status === "pending";
  const { t } = useLocale();

  return (
    <div className="relative text-center space-y-6">
      <Confetti />
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500 animate-scale-in" />
      </div>

      <h2 className="font-heading text-2xl font-bold text-green-700">
        {isPending ? t("booking.pendingTitle") : t("booking.confirmedTitle")}
      </h2>

      <Card className="bg-pink-50 border-pink-100 ring-0">
        <CardContent className="p-6 space-y-2">
          <p className="font-semibold text-lg">{booking.serviceName}</p>
          <p className="text-muted-foreground">
            {startDate.toLocaleDateString("en-PH", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-muted-foreground">
            {startDate.toLocaleTimeString("en-PH", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          {isPending && (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-2 mt-2">
              {t("booking.pendingMsg")}
            </p>
          )}
          {!isPending && (
            <p className="text-sm text-muted-foreground pt-2">
              {t("booking.confirmedMsg")}
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {t("booking.changesMsg")}
      </p>

      <div className="flex flex-col gap-3">
        <a
          href={siteConfig.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted px-2.5 py-1.5 h-9"
        >
          {t("booking.messageOnMessenger")}
        </a>
        <Button
          onClick={onNewBooking}
          variant="ghost"
          className="rounded-full"
        >
          {t("booking.anotherBooking")}
        </Button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium text-pink-600 underline-offset-4 hover:underline px-2.5 py-1.5 h-9"
        >
          {t("booking.backToHome")}
        </Link>
      </div>
    </div>
  );
}
