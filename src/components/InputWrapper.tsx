import React from "react";
type Props = {
  error?: string;
  label: string;
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
};

export default function InputWrapper({
  label,
  className,
  children,
  htmlFor,
  error,
}: Props) {
  return (
    <div className={""}>
      <label className="uppercase" htmlFor={htmlFor}>
        <span className={`label-text ${error && "text-error"}`}>{label}</span>
      </label>
      <div
        className={`${
          error ? "tooltip tooltip-open tooltip-top tooltip-error w-full" : ""
        }`}
        data-tip={error}
      >
        {children}
      </div>
    </div>
  );
}
