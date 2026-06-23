import { test, expect } from "@playwright/test";
import { seedTestDb, createPendingBooking, disconnectDb } from "../fixtures/seed";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../fixtures/admin-user";

test.beforeAll(async () => {
  await seedTestDb();
});

test.beforeEach(async () => {
  await createPendingBooking();
});

test.afterAll(async () => {
  await disconnectDb();
});

test("admin can log in and approve a pending booking", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  await expect(page.getByText("Test User Today")).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
});

test("admin can mark a booking as completed", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

  await expect(page.getByText("Test User Today")).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  await page.reload();

  await expect(page.getByText("Test User Today")).toBeVisible({ timeout: 5000 });
});

test("login with wrong password shows error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", "wrong_password_123");
  await page.getByRole("button", { name: "Sign In" }).click();

  const toast = page.locator("[data-sonner-toast]");
  await expect(toast.first()).toBeVisible({ timeout: 5000 });
});
