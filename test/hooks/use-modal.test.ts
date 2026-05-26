import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useModal } from "@/hooks/use-modal";

describe("useModal", () => {
  it("returns handleBackdropClick function", () => {
    const { result } = renderHook(() => useModal(vi.fn()));
    expect(result.current.handleBackdropClick).toBeInstanceOf(Function);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useModal(onClose));

    const backdrop = document.createElement("div");
    const event = {
      target: backdrop,
      currentTarget: backdrop,
    } as unknown as React.MouseEvent;

    result.current.handleBackdropClick(event);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when inner element is clicked", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useModal(onClose));

    const inner = document.createElement("div");
    const backdrop = document.createElement("div");
    const event = {
      target: inner,
      currentTarget: backdrop,
    } as unknown as React.MouseEvent;

    result.current.handleBackdropClick(event);
    expect(onClose).not.toHaveBeenCalled();
  });
});
