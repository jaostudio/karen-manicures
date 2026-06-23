import { test, expect } from "@playwright/test";
import { seedTestDb, disconnectDb } from "../fixtures/seed";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../fixtures/admin-user";

test.beforeAll(async () => {
  await seedTestDb();
});

test.afterAll(async () => {
  await disconnectDb();
});

test.describe("Services CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", ADMIN_EMAIL);
    await page.fill("#password", ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
  });

  test("admin can create a new service", async ({ page }) => {
    await page.goto("/admin/services");
    await expect(page.getByRole("heading", { name: "Services" })).toBeVisible();

    await page.getByRole("button", { name: "Add Service" }).click();
    await expect(page.getByRole("heading", { name: "Add Service" })).toBeVisible();

    await page.fill("#name", "Nail Art");
    await page.fill("#desc", "Custom nail art design");
    await page.fill("#dur", "90");
    await page.fill("#price", "350");

    await page.getByRole("button", { name: "Create Service" }).click();

    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  });

  test("admin can edit an existing service", async ({ page }) => {
    await page.goto("/admin/services");
    await expect(page.getByText("Gel Manicure")).toBeVisible();

    await page.locator("button").filter({ has: page.locator("svg.lucide-pencil") }).first().click();
    await expect(page.getByText("Edit Service")).toBeVisible();

    const priceInput = page.locator("#price");
    await priceInput.clear();
    await priceInput.fill("500");

    await page.getByRole("button", { name: "Update Service" }).click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  });

  test("admin can toggle service visibility", async ({ page }) => {
    await page.goto("/admin/services");

    // Find the card by its heading, then click the "Hide" button inside it
    const card = page.locator("div.bg-white.rounded-xl.border").filter({ hasText: "Classic Manicure" });
    await expect(card.first()).toBeVisible({ timeout: 5000 });

    // The toggle button reads "Hide" (active) or "Show" (inactive)
    const btn = card.first().getByRole("button", { name: /^(Hide|Show)$/ });
    await btn.click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Gallery page loads", () => {
  test("admin gallery page shows empty state", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", ADMIN_EMAIL);
    await page.fill("#password", ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

    await page.goto("/admin/gallery");
    await expect(page.getByRole("heading", { name: "Gallery" })).toBeVisible();
    await expect(page.getByText(/No images yet/)).toBeVisible();
  });
});
