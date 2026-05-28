import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/use-toast";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useToast", () => {
  it("starts with null toast", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeNull();
  });

  it("shows a toast with the given message and type", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Hello!", "success");
    });

    expect(result.current.toast).toEqual({
      message: "Hello!",
      type: "success",
    });
  });

  it("defaults to success type", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Info only");
    });

    expect(result.current.toast?.type).toBe("success");
  });

  it("auto-dismisses after default timeout", () => {
    const { result } = renderHook(() => useToast(3000));

    act(() => {
      result.current.showToast("Auto dismiss", "info");
    });

    expect(result.current.toast).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toast).toBeNull();
  });

  it("dismisses on explicit dismissToast call", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Dismiss me", "info");
    });

    act(() => {
      result.current.dismissToast();
    });

    expect(result.current.toast).toBeNull();
  });

  it("replaces existing toast and resets timer", () => {
    const { result } = renderHook(() => useToast(5000));

    act(() => {
      result.current.showToast("First", "info");
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.showToast("Second", "success");
    });

    expect(result.current.toast?.message).toBe("Second");

    // Should not auto-dismiss at the original timer (3s from first call)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toast).not.toBeNull();

    // Should auto-dismiss after the new timer
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.toast).toBeNull();
  });

  it("uses custom dismiss duration", () => {
    const { result } = renderHook(() => useToast(1000));

    act(() => {
      result.current.showToast("Quick toast");
    });

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current.toast).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.toast).toBeNull();
  });
});
