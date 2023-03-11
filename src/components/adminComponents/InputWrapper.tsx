import { Field, type FieldInstance, FieldRenderProps } from "houseform";
import React from "react";
import { IoMdHelpCircle } from "react-icons/io";
type Props = {
  label: string;
  name: string;
  tooltip?: string;
  initialValue?: string;
  zodValidate?: FieldRenderProps<string>["onChangeValidate"];
};

export default function InputWrapper({
  label,
  tooltip,
  initialValue,
  name,
  zodValidate,
}: Props) {
  return (
    <Field
      name={name}
      initialValue={initialValue}
      onChangeValidate={zodValidate}
    >
      {({ value, setValue, onBlur }) => (
        <div className="form-control place-self-stretch pt-2 md:place-self-auto">
          <label className=" label">
            <span className="label-text">{label}</span>

            {tooltip && (
              <span
                className="label-text-alt tooltip tooltip-left  text-base"
                data-tip={tooltip}
              >
                <IoMdHelpCircle />
              </span>
            )}
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type="text"
            className={`input-bordered input place-self-stretch`}
          ></input>
        </div>
      )}
    </Field>
  );
}
