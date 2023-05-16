import clsx from "clsx";
import React, { ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonProps = {
  variant?: "default" | "primary" | "secondary" | "tertiary";
  radius?: "default" | "rounded" | "pill";
  size?: "lg" | "md" | "sm";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "default",
  radius = "default",
  size = "lg",
  className,
  disabled,
  loading,
  onClick,
  style,
}: ButtonProps) => {
  const btnCls = clsx(
    {
      "text-xs px-2": size === "sm",
      "px-3": size === "md",
      "px-6": size === "lg",
    },
    className,
    "py-1 font-Inter text-darkGreen flex font-medium",
    "disabled:!border-gray-400 disabled:!text-gray-400 disabled:!bg-gray-50",
    {
      "bg-accentColor text-soilGreen border-2 border-accentColor hover:border-darkGreen hover:bg-darkGreen hover:text-white":
        variant === "primary",
      "text-darkGreen hover:text-white border-2 border-darkGreen hover:bg-darkGreen":
        variant === "secondary",
      "bg-soilGray text-darkGreen hover:text-white hover:bg-darkGreen":
        variant === "tertiary",
      "border-2": variant === "default",
      "rounded-full": radius === "pill",
      "rounded-lg": radius === "rounded",
      "rounded-md": radius === "default",
    }
  );

  if (disabled) {
    return (
      <button
        style={style}
        disabled={disabled}
        className={`${btnCls} bg-transparent`}
      >
        {children}
      </button>
    );
  }

  if (loading) {
    return (
      <button
        style={style}
        className={`${btnCls} bg-transparent`}
        disabled={true}
      >
        <div className="flex items-center space-x-1">
          <div>{children}</div>

          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="21px"
            height="21px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              opacity="0.2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#000000"
            />
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="#000000"
            />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <button style={style} className={btnCls} onClick={onClick}>
      {children}
    </button>
  );
};
