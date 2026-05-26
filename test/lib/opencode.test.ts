import { describe, it, expect, beforeEach } from "vitest";
import { getOpenCodeConfig, OPENCODE_DEFAULT_BASE_URL } from "@/lib/opencode";

beforeEach(() => {
  localStorage.clear();
});

describe("getOpenCodeConfig", () => {
  it("returns null when no key is stored", () => {
    expect(getOpenCodeConfig()).toBeNull();
  });

  it("returns config with defaults when only key is stored", () => {
    localStorage.setItem("promptforge_opencode_api_key", "oc_test");
    const config = getOpenCodeConfig();
    expect(config).not.toBeNull();
    expect(config!.apiKey).toBe("oc_test");
    expect(config!.model).toBe("opencode/big-pickle");
    expect(config!.baseUrl).toBe(OPENCODE_DEFAULT_BASE_URL);
  });

  it("uses stored model and baseUrl when present", () => {
    localStorage.setItem("promptforge_opencode_api_key", "oc_test");
    localStorage.setItem("promptforge_opencode_model", "custom/model");
    localStorage.setItem(
      "promptforge_opencode_base_url",
      "https://custom.example.com",
    );
    const config = getOpenCodeConfig();
    expect(config!.model).toBe("custom/model");
    expect(config!.baseUrl).toBe("https://custom.example.com");
  });
});
