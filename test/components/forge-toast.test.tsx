import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForgeToast } from "@/components/forge-toast";

describe("ForgeToast", () => {
  it("renders nothing when toast is null", () => {
    const { container } = render(
      <ForgeToast toast={null} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders success toast with message", () => {
    render(
      <ForgeToast
        toast={{ message: "Saved!", type: "success" }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("renders info toast with message", () => {
    render(
      <ForgeToast
        toast={{ message: "Check this out", type: "info" }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Check this out")).toBeInTheDocument();
  });

  it("has role status and aria-live polite", () => {
    render(
      <ForgeToast
        toast={{ message: "Hello", type: "info" }}
        onClose={vi.fn()}
      />,
    );
    const toast = screen.getByRole("status");
    expect(toast).toHaveAttribute("aria-live", "polite");
  });

  it("renders a close button", () => {
    render(
      <ForgeToast
        toast={{ message: "Dismiss me", type: "info" }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
