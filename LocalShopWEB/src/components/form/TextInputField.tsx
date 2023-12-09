import { Form } from "react-bootstrap";
import { RegisterOptions, UseFormRegister, FieldError } from "react-hook-form";
import styles from "../../styles/TextInputField.module.css";

export interface Option {
  value: string | number;
  key: string | number;
  disabled?: boolean;
  show?: boolean;
}
interface TextInputFieldProps {
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  options?: Option[];
  hasDefaultValue?: boolean;
  margin?: boolean;
  nullable?: boolean;
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  placeholder,
  register,
  registerOptions,
  error,
  hasDefaultValue,
  options,
  margin = true,
  nullable = false,
  ...props
}: TextInputFieldProps) => {
  return (
    <Form.Group
      className={margin ? "mb-3" : undefined}
      controlId={name + "-input"}
    >
      {label && <Form.Label className={styles.label}>{label}</Form.Label>}
      <Form.Control
        className={styles.input}
        {...register(name, registerOptions)}
        {...props}
        placeholder={placeholder}
        isInvalid={!!error}
      >
        {options ? (
          <>
            {hasDefaultValue && (
              <option value={""} disabled={!nullable} selected>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <>
                {option.show ? (
                  <></>
                ) : (
                  <option
                    key={option.key}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.key}
                  </option>
                )}
              </>
            ))}
          </>
        ) : null}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
