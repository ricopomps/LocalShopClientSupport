import { Form } from "react-bootstrap";
import { RegisterOptions, UseFormRegister, FieldError } from "react-hook-form";
import styles from "../../styles/StoresPage.module.css";

export interface Option {
  value: string | number;
  key: string | number;
}
interface CheckInputFieldProps {
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  options?: Option[];
  hasDefaultValue?: boolean;
  margin?: boolean;
  [x: string]: any;
  className?: string;
  classNameLabel?: string;
}

const CheckInputField = ({
  name,
  label,
  placeholder,
  register,
  registerOptions,
  error,
  hasDefaultValue,
  options,
  margin = true,
  className,
  classNameLabel,
  ...props
}: CheckInputFieldProps) => {
  return (
    <Form.Group className={className} controlId={name + "-input"}>
      {label && <Form.Label className={classNameLabel}>{label}</Form.Label>}
      <Form.Check
        {...register(name, registerOptions)}
        {...props}
        placeholder={placeholder}
        isInvalid={!!error}
      >
        {options ? (
          <>
            {hasDefaultValue && (
              <option value={""} disabled selected>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
          </>
        ) : null}
      </Form.Check>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default CheckInputField;
