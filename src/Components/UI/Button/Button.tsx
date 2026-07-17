import { memo } from "react";
import styles from "./Styles.module.scss";
import cn from "classnames";

interface ButtonProps {
  size?: "nav" | "main" | "long" | "min";
  color?: "primary" | "transparent";
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  radius?: number;
  className?: string;
  disabled?: boolean;
}

function ButtonComponent({
  size = "main",
  color = "primary",
  children,
  onClick,
  type = "button",
  radius,
  className = "",
  disabled,
}: ButtonProps) {
  return (
    <button
      style={{ borderRadius: radius ? `${radius}px` : "" }}
      onClick={onClick}
      type={type}
      className={cn(
        styles.button,
        styles[`button__${color}`],
        styles[`button__${size}`],
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);
