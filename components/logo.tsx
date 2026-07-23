import Image from "next/image";

interface LogoProps {
  /** Width/height in pixels. Defaults to 32. */
  size?: number;
  /** Show the "PromptForge" wordmark next to the icon. Defaults to true. */
  showWordmark?: boolean;
  /** Wordmark text style variant. */
  variant?: "default" | "uppercase";
  className?: string;
}

export function Logo({
  size = 32,
  showWordmark = true,
  variant = "default",
  className = "",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/pf-logo.svg"
        alt=""
        width={size}
        height={size}
        aria-hidden="true"
      />
      {showWordmark && (
        <span
          className={`text-sm font-semibold tracking-tight text-white ${
            variant === "uppercase" ? "tracking-widest uppercase" : ""
          }`}
        >
          PromptForge
        </span>
      )}
    </span>
  );
}
