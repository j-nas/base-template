import React from "react";
type Props = {
  error?: string;
  label: string;
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
  secondaryLabel?: string;
};

export default function InputWrapper({
  label,
  className,
  children,
  htmlFor,
  error,
  secondaryLabel,
}: Props) {
  return (
    <div className={""}>
      <label className="uppercase" htmlFor={htmlFor}>
        <span className={`label-text ${error && "text-error"}`}>{label}</span>
        <span className="label-text-alt">{secondaryLabel}</span>
      </label>
      <div
        className={`tooltip ${
          error
            ? " tooltip-open tooltip-top tooltip-error w-full"
            : "w-full bg-transparent "
        }`}
        data-tip={error ? error : label}
      >
        {children}
      </div>
    </div>
  );
}
