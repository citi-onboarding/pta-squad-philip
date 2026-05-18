import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  variantColor?: string;
  customSize?: string;
};

export function Button({
  text,
  icon,
  iconPosition = "left",
  variantColor = "",
  customSize = "",
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const hasLeftIcon = icon && iconPosition === "left";
  const hasRightIcon = icon && iconPosition === "right";

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2",
        "px-4 py-2 rounded-md transition-colors",
        variantColor,
        customSize,
        className,
      )}
      {...props}
    >
      {hasLeftIcon && icon}
      {text && <span>{text}</span>}
      {children}
      {hasRightIcon && icon}
    </button>
  );
}
