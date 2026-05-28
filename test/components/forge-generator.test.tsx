import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForgeGenerator } from "@/components/forge-generator";
import { CATEGORIES, MODELS } from "@/lib/types";

const defaultProps = {
  description: "",
  setDescription: vi.fn(),
  category: "general",
  setCategory: vi.fn(),
  model: MODELS[0].id,
  setModel: vi.fn(),
  isGenerating: false,
  generatedPrompt: "",
  copied: false,
  isEnhancing: false,
  isRefining: false,
  showRefineInput: false,
  setShowRefineInput: vi.fn(),
  refineInstruction: "",
  setRefineInstruction: vi.fn(),
  handleGenerate: vi.fn(),
  handleCopy: vi.fn(),
  handleEvaluate: vi.fn(),
  handleRefine: vi.fn(),
  handleExport: vi.fn(),
  handleSmartEnhance: vi.fn(),
  handleSaveTemplate: vi.fn(),
  onOpenSettings: vi.fn(),
  hasCustomKey: false,
  hasApiKey: true,
  categories: CATEGORIES,
  models: MODELS,
  provider: "gemini" as const,
  setProvider: vi.fn(),
  opencodeModel: "opencode/big-pickle",
  onSetOpencodeModel: vi.fn(),
  onOpenVersions: vi.fn(),
  onOpenGallery: vi.fn(),
};

describe("ForgeGenerator", () => {
  it("renders the heading", () => {
    render(<ForgeGenerator {...defaultProps} />);
    expect(screen.getByText("The Forge")).toBeInTheDocument();
  });

  it("renders all category buttons", () => {
    render(<ForgeGenerator {...defaultProps} />);
    CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
    });
  });

  it("renders the intent textarea", () => {
    render(<ForgeGenerator {...defaultProps} />);
    expect(screen.getByPlaceholderText("What are we building today?")).toBeInTheDocument();
  });

  it("shows API key warning when no key configured", () => {
    render(<ForgeGenerator {...defaultProps} hasApiKey={false} />);
    expect(screen.getByText(/No API key configured/)).toBeInTheDocument();
  });

  it("hides API key warning when key is configured", () => {
    render(<ForgeGenerator {...defaultProps} hasApiKey={true} />);
    expect(screen.queryByText(/No API key configured/)).not.toBeInTheDocument();
  });

  it("disables generate button when no description", () => {
    render(<ForgeGenerator {...defaultProps} />);
    const button = screen.getByText("Generate Prompt").closest("button");
    expect(button).toBeDisabled();
  });

  it("enables generate button with description and API key", () => {
    render(<ForgeGenerator {...defaultProps} description="Write a poem" />);
    const button = screen.getByText("Generate Prompt").closest("button");
    expect(button).not.toBeDisabled();
  });

  it("disables generate button when no API key", () => {
    render(<ForgeGenerator {...defaultProps} description="Write a poem" hasApiKey={false} />);
    const button = screen.getByText("Generate Prompt").closest("button");
    expect(button).toBeDisabled();
  });

  it("shows loading state when generating", () => {
    render(<ForgeGenerator {...defaultProps} isGenerating={true} />);
    expect(screen.getByText("Forging...")).toBeInTheDocument();
  });

  it("shows output skeleton when generating", () => {
    const { container } = render(<ForgeGenerator {...defaultProps} isGenerating={true} />);
    expect(container.querySelector('[aria-describedby="output-description"]')).not.toBeInTheDocument();
  });

  it("shows empty state by default", () => {
    render(<ForgeGenerator {...defaultProps} />);
    expect(screen.getByText("Awaiting Input")).toBeInTheDocument();
  });

  it("shows generated prompt when available", () => {
    render(<ForgeGenerator {...defaultProps} generatedPrompt="This is a test prompt" />);
    expect(screen.getByDisplayValue("This is a test prompt")).toBeInTheDocument();
  });

  it("shows refine input when toggled", () => {
    render(<ForgeGenerator {...defaultProps} showRefineInput={true} />);
    expect(screen.getByPlaceholderText("Refine this prompt...")).toBeInTheDocument();
  });

  it("renders provider toggle buttons", () => {
    render(<ForgeGenerator {...defaultProps} />);
    expect(screen.getByText("Gemini")).toBeInTheDocument();
    expect(screen.getByText("OpenCode")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    expect(screen.getByText("Codex")).toBeInTheDocument();
  });

  it("renders model selector", () => {
    render(<ForgeGenerator {...defaultProps} />);
    MODELS.forEach((m) => {
      expect(screen.getByText(m.label)).toBeInTheDocument();
    });
  });
});
