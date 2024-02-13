import * as React from "react";
import styles from "./Input.module.css";

interface IInputProps {
  type: string;
  text?: string;
  name: string;
  placeholder?: string;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  multiple?: boolean;
}

const Input: React.FunctionComponent<IInputProps> = ({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  multiple,
}) => {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        multiple={multiple}
      />
    </div>
  );
};

export default Input;
