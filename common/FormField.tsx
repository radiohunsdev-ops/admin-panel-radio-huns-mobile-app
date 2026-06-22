import { COLORS } from "@/constants/colors";

type FieldElement =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;
 
interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: FieldElement) => void;
  required?: boolean;
  placeholder?: string;
}
 
interface InputFieldProps extends BaseFieldProps {
  as?: "input";
  type?: string;
}
 
interface TextareaFieldProps extends BaseFieldProps {
  as: "textarea";
  rows?: number;
}
 
interface SelectFieldProps extends BaseFieldProps {
  as: "select";
  options: { value: string; label: string }[];
}
 
type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;
 
const sharedInputStyle = {
  backgroundColor: COLORS.softCard,
  borderColor: COLORS.border,
  color: COLORS.text,
};
 
export function FormField(props: FormFieldProps) {
  const { label, name, value, onChange, required, placeholder } = props;
 
  const labelEl = (
    <label
      className="block mb-2 text-sm font-medium"
      style={{ color: COLORS.muted }}
    >
      {label}
    </label>
  );
 
  const baseClass = "w-full px-4 py-3 rounded-2xl border outline-none";
 
  if (props.as === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          name={name}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          rows={props.rows ?? 5}
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
          style={sharedInputStyle}
        />
      </div>
    );
  }
 
  if (props.as === "select") {
    return (
      <div>
        {labelEl}
        <select
          name={name}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          className={baseClass}
          style={sharedInputStyle}
        >
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
 
  // default: input
  return (
    <div>
      {labelEl}
      <input
        type={(props as InputFieldProps).type ?? "text"}
        name={name}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        required={required}
        placeholder={placeholder}
        className={baseClass}
        style={sharedInputStyle}
      />
    </div>
  );
}
 