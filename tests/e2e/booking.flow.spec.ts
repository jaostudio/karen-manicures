import { test, expect } from "@playwright/test";
import { seedTestDb, disconnectDb } from "../fixtures/seed";

test.beforeAll(async () => {
  await seedTestDb();
});

test.afterAll(async () => {
  await disconnectDb();
});

test("guest can book a service end-to-end", async ({ page }) => {
  await page.goto("/book");

  // Step 1: Select a service card
  await page.getByText("Gel Manicure").first().click();
  await expect(page.getByText("Select Date & Time")).toBeVisible();

  // Step 2: Pick a future date (3+ days ahead, avoid Sunday)
  const date = new Date();
  date.setDate(date.getDate() + 3);
  while (date.getDay() === 0) date.setDate(date.getDate() + 1);

  // Click the day in react-day-picker grid
  await page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${date.getDate()}$`) }).click();

  // Wait for time slots to load
  await expect(page.getByText("Available times for")).toBeVisible({ timeout: 15000 });

  // Click the first time slot button
  const slots = page.locator('button:has-text(":")');
  await expect(slots.first()).toBeVisible({ timeout: 5000 });
  await slots.first().click();

  // Step 3: Fill customer info
  await page.getByRole("button", { name: "Next →" }).click();
  await expect(page.getByText("Your Information")).toBeVisible();

  await page.getByLabel("Full Name *").fill("Maria Santos");
  await page.getByLabel("Phone Number *").fill("09171234567");
  await page.getByRole("checkbox", { name: /sms|consent/i }).check();

  // Confirm booking
  await page.getByRole("button", { name: "Confirm Booking" }).click();

  // Assert confirmation (look for either success or error UI)
  await expect(page.getByText("Appointment Booked!").or(page.getByText("Booking Submitted!"))).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("Gel Manicure")).toBeVisible();
});

test("shows validation error for invalid phone", async ({ page }) => {
  await page.goto("/book");

  await page.getByText("Gel Manicure").first().click();

  const date = new Date();
  date.setDate(date.getDate() + 3);
  while (date.getDay() === 0) date.setDate(date.getDate() + 1);
  await page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${date.getDate()}$`) }).click();

  await expect(page.getByText("Available times for")).toBeVisible({ timeout: 15000 });

  const slots = page.locator('button:has-text(":")');
  await expect(slots.first()).toBeVisible({ timeout: 5000 });
  await slots.first().click();

  await page.getByRole("button", { name: "Next →" }).click();
  await expect(page.getByText("Your Information")).toBeVisible();

  await page.getByLabel("Full Name *").fill("Test User");
  await page.getByLabel("Phone Number *").fill("123");
  await page.getByRole("checkbox", { name: /sms|consent/i }).check();
  await page.getByRole("button", { name: "Confirm Booking" }).click();

  await expect(page.getByText(/Phone must be a valid/)).toBeVisible({ timeout: 5000 });
});
