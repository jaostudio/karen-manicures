import type { BookingStatus, NotificationChannel, NotificationStatus } from "@prisma/client";

export type { BookingStatus, NotificationChannel, NotificationStatus };

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  serviceId: string;
  startTime: Date;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  smsConsent: boolean;
}

export interface BookingStepProps {
  onNext: (data?: Record<string, unknown>) => void;
  onBack?: () => void;
  data?: Record<string, unknown>;
}

export interface AdminSession {
  userId: string;
  email: string;
}
