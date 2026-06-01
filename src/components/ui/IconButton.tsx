import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

type IconLinkProps = LinkProps & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  children,
  className = "",
  label,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`icon-button ${className}`.trim()}
      title={label}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconLink({
  children,
  className = "",
  label,
  ...props
}: IconLinkProps) {
  return (
    <Link
      aria-label={label}
      className={`icon-button ${className}`.trim()}
      title={label}
      {...props}
    >
      {children}
    </Link>
  );
}
