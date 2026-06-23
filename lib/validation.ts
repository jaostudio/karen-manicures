import { z } from "zod";

const phoneRegex = /^09\d{9}$/;

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  customerPhone: z
    .string()
    .regex(phoneRegex, "Phone must be a valid PH mobile number (09XXXXXXXXX)"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  startTime: z.string().refine(
    (val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    },
    { message: "Invalid date/time" }
  ),
  notes: z.string().max(500).optional(),
  smsConsent: z.boolean().refine((val) => val === true, {
    message: "SMS consent is required",
  }),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  description: z.string().max(500).optional(),
  duration: z.coerce.number().int().min(15).max(240),
  price: z.coerce.number().positive("Price must be positive"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
