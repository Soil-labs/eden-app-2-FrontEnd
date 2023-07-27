import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export type CheckBoxProps = {
  name?: string;
  label?: string;
  checked?: boolean;
  required?: boolean;
  radius?: "default" | "rounded" | "pill";
  bgColorRGB?: string;
  brColorRGB?: string;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const CheckBox: React.FC<CheckBoxProps> = ({
  name,
  label,
  checked,
  required,
  radius = "default",
  bgColorRGB = "",
  brColorRGB = "",
  className = "py-1 px-3",
  onChange,
}) => {
  const inputCls = clsx("font-Unica flex", className, {
    "rounded-md": radius === "default",
    "rounded-lg": radius === "rounded",
    "rounded-full": radius === "pill",
  });

  return (
    <div className={`mr-1 w-fit`}>
      <label
        className={`mt-1 flex cursor-pointer ${inputCls}`}
        style={
          bgColorRGB
            ? {
                background: `rgba(${bgColorRGB})`,
                border: `1px solid rgba(${brColorRGB})`,
              }
            : {}
        }
      >
        <span
          className={"mr-1 text-xs font-semibold tracking-wider text-gray-700"}
        >
          {label}
        </span>
        <input
          id={name}
          name={name}
          type="checkbox"
          required={required}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            onChange(e);
          }}
          checked={checked}
          className={`${inputCls} shadow-sm`}
        />
      </label>
    </div>
  );
};

export default CheckBox;
