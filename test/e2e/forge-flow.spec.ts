import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Intercept Gemini API calls and return a canned response. */
function mockGeminiResponse(page: import("@playwright/test").Page, body: string) {
  return page.route(
    "https://generativelanguage.googleapis.com/**",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candidates: [{ content: { parts: [{ text: body }] } }],
        }),
      }),
  );
}

/**
 * Seed a fake Gemini API key in localStorage.
 * Navigates to /forge, writes the key, and reloads so the React state
 * initialiser picks it up reliably (avoids addInitScript race conditions
 * with parallel workers).
 */
async function seedApiKey(page: import("@playwright/test").Page) {
  await page.goto("/forge");
  await page.evaluate(() => {
    localStorage.setItem("promptforge_api_key", "e2e-test-key");
  });
  await page.reload();
  await expect(page.getByText("The Forge")).toBeVisible();
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe("Forge flow", () => {
  test("generate prompt from description", async ({ page }) => {
    const fakePrompt =
      "You are an expert prompt crafter. When given a vague idea, produce a clear, structured prompt with role, context, and constraints.";

    await mockGeminiResponse(page, fakePrompt);
    await seedApiKey(page);

    // Type a description
    await page.locator("#intent").fill("Write me a prompt for generating landing page copy");

    // Click Generate
    await page.getByRole("button", { name: "Generate Prompt" }).click();

    // Wait for the generated prompt to appear in the output
    await expect(page.locator("text=You are an expert prompt crafter")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("generated prompt appears in vault", async ({ page }) => {
    const fakePrompt = "Test vault prompt output";

    await mockGeminiResponse(page, fakePrompt);
    await seedApiKey(page);

    // Generate a prompt
    await page.locator("#intent").fill("Test vault input");
    await page.getByRole("button", { name: "Generate Prompt" }).click();

    // Wait for generation to complete — vault item should appear
    await expect(page.locator("text=Test vault input").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("copy button copies generated prompt", async ({ page }) => {
    const fakePrompt = "Copyable prompt content here";

    await mockGeminiResponse(page, fakePrompt);
    await seedApiKey(page);
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

    // Generate
    await page.locator("#intent").fill("Copy test");
    await page.getByRole("button", { name: "Generate Prompt" }).click();

    // Wait for output
    await expect(page.locator("text=Copyable prompt content here")).toBeVisible({
      timeout: 15_000,
    });

    // Click the Copy button in the toolbar (has title="Copy", distinct from vault's "Copy prompt")
    await page.locator('button[title="Copy"]').click();

    // Verify clipboard contains the prompt
    const clipText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipText).toBe(fakePrompt);
  });

  test("category and model selectors work", async ({ page }) => {
    await seedApiKey(page);

    // Default category is "coding"
    const codingBtn = page.getByRole("button", { name: "Coding" });
    await expect(codingBtn).toHaveAttribute("class", /amber/);

    // Switch to "creative"
    const creativeBtn = page.getByRole("button", { name: "Creative" });
    await creativeBtn.click();
    await expect(creativeBtn).toHaveAttribute("class", /amber/);

    // Model selector is present
    const modelSelect = page.locator("#model");
    await expect(modelSelect).toBeVisible();
  });

  test("settings modal opens and closes", async ({ page }) => {
    await seedApiKey(page);

    // Click the Settings link inside the generator section (not the navbar)
    await page.locator("#generator").getByRole("button", { name: "Settings" }).click();

    // Modal should be visible — look for the Gemini heading inside the modal
    await expect(page.getByRole("heading", { name: "Gemini" })).toBeVisible();

    // Close via X button
    await page.getByRole("button", { name: "Close" }).click();

    // Modal should be hidden
    await expect(page.getByRole("heading", { name: "Gemini" })).not.toBeVisible();
  });

  test("no API key shows warning banner", async ({ page }) => {
    // Navigate WITHOUT seeding a key — clear any existing key
    await page.goto("/forge");
    await page.evaluate(() => localStorage.removeItem("promptforge_api_key"));
    await page.reload();

    // Warning banner should appear
    await expect(page.getByText("No API key configured")).toBeVisible();

    // Generate button should be disabled
    const generateBtn = page.getByRole("button", { name: "Generate Prompt" });
    await expect(generateBtn).toBeDisabled();
  });

  test("Ctrl+Enter triggers generation", async ({ page }) => {
    const fakePrompt = "Keyboard shortcut prompt";

    await mockGeminiResponse(page, fakePrompt);
    await seedApiKey(page);

    // Type and press Ctrl+Enter
    await page.locator("#intent").fill("Keyboard test");
    await page.locator("#intent").press("Control+Enter");

    // Should generate
    await expect(page.locator("text=Keyboard shortcut prompt")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("export button downloads prompt as text", async ({ page }) => {
    const fakePrompt = "Exportable prompt content";

    await mockGeminiResponse(page, fakePrompt);
    await seedApiKey(page);

    // Generate
    await page.locator("#intent").fill("Export test");
    await page.getByRole("button", { name: "Generate Prompt" }).click();

    // Wait for output
    await expect(page.locator("text=Exportable prompt content")).toBeVisible({
      timeout: 15_000,
    });

    // Set up download listener before clicking
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export" }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.txt$/);

    const path = await download.path();
    expect(path).not.toBeNull();
    const content = readFileSync(path!, "utf-8");
    expect(content).toContain("Exportable prompt content");
  });
});
