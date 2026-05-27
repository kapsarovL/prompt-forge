import { describe, it, expect } from "vitest";
import { CATEGORIES, MODELS, OPENCODE_MODELS, BUILT_IN_TEMPLATES } from "@/lib/types";

describe("CATEGORIES", () => {
  it("has 4 categories", () => {
    expect(CATEGORIES).toHaveLength(4);
  });

  it.each(CATEGORIES)("$id has all required fields", (cat) => {
    expect(cat.id).toBeTruthy();
    expect(cat.label).toBeTruthy();
    expect(cat.icon).toBeDefined();
    expect(cat.description).toBeTruthy();
  });
});

describe("MODELS", () => {
  it("has at least 1 model", () => {
    expect(MODELS.length).toBeGreaterThan(0);
  });

  it.each(MODELS)("$id has all required fields", (m) => {
    expect(m.id).toBeTruthy();
    expect(m.label).toBeTruthy();
    expect(m.description).toBeTruthy();
  });
});

describe("OPENCODE_MODELS", () => {
  it("has at least 1 model", () => {
    expect(OPENCODE_MODELS.length).toBeGreaterThan(0);
  });
});

describe("BUILT_IN_TEMPLATES", () => {
  it("matches category keys", () => {
    const catIds = CATEGORIES.map((c) => c.id);
    for (const key of Object.keys(BUILT_IN_TEMPLATES)) {
      expect(catIds).toContain(key);
    }
  });

  it("has at least 1 template per category", () => {
    for (const [, templates] of Object.entries(BUILT_IN_TEMPLATES)) {
      expect(templates.length).toBeGreaterThan(0);
    }
  });
});
