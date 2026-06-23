import { describe, it, expect } from "vitest";
import { bookingSchema, serviceSchema, loginSchema } from "./validation";

describe("bookingSchema", () => {
  const valid = {
    serviceId: "abc123",
    customerName: "Jane Doe",
    customerPhone: "09123456789",
    startTime: "2026-07-01T10:00:00.000Z",
    smsConsent: true,
  };

  it("accepts a valid booking", () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short name", () => {
    const res = bookingSchema.safeParse({ ...valid, customerName: "J" });
    expect(res.success).toBe(false);
  });

  it("rejects invalid PH phone", () => {
    const res = bookingSchema.safeParse({ ...valid, customerPhone: "12345" });
    expect(res.success).toBe(false);
  });

  it("rejects missing serviceId", () => {
    const res = bookingSchema.safeParse({ ...valid, serviceId: "" });
    expect(res.success).toBe(false);
  });

  it("accepts optional email", () => {
    const res = bookingSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects missing smsConsent", () => {
    const { smsConsent, ...withoutConsent } = valid;
    void smsConsent;
    const res = bookingSchema.safeParse(withoutConsent);
    expect(res.success).toBe(false);
  });

  it("rejects false smsConsent", () => {
    const res = bookingSchema.safeParse({ ...valid, smsConsent: false });
    expect(res.success).toBe(false);
  });

  it("accepts empty email string", () => {
    const res = bookingSchema.safeParse({ ...valid, customerEmail: "" });
    expect(res.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const res = bookingSchema.safeParse({
      ...valid,
      customerEmail: "notanemail",
    });
    expect(res.success).toBe(false);
  });

  it("rejects invalid startTime", () => {
    const res = bookingSchema.safeParse({ ...valid, startTime: "bogus" });
    expect(res.success).toBe(false);
  });
});

describe("serviceSchema", () => {
  it("accepts valid service", () => {
    const res = serviceSchema.safeParse({
      name: "Classic Manicure",
      duration: 30,
      price: 150,
    });
    expect(res.success).toBe(true);
  });

  it("coerces string duration to number", () => {
    const res = serviceSchema.safeParse({
      name: "Test",
      duration: "45",
      price: "200",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.duration).toBe(45);
      expect(res.data.price).toBe(200);
    }
  });

  it("rejects negative price", () => {
    const res = serviceSchema.safeParse({
      name: "Test",
      duration: 30,
      price: -10,
    });
    expect(res.success).toBe(false);
  });

  it("rejects short name", () => {
    const res = serviceSchema.safeParse({
      name: "A",
      duration: 30,
      price: 100,
    });
    expect(res.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login", () => {
    const res = loginSchema.safeParse({
      email: "admin@example.com",
      password: "secret",
    });
    expect(res.success).toBe(true);
  });

  it("rejects empty password", () => {
    const res = loginSchema.safeParse({
      email: "admin@example.com",
      password: "",
    });
    expect(res.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const res = loginSchema.safeParse({
      email: "bad",
      password: "secret",
    });
    expect(res.success).toBe(false);
  });
});
