import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows the heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Start Forging link navigates to /forge", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Start Forging").click();
    await expect(page).toHaveURL("/forge");
  });

  test("forges page has generator section", async ({ page }) => {
    await page.goto("/forge");
    await expect(page.getByText("The Forge")).toBeVisible();
  });
});
