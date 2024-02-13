import { ChangeEvent } from 'react';
import styles from './Select.module.css';


export interface ISelectProps {
    text: string;
    name: string;
    options: string[];
    handleOnChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    value: string;
}

export default function Select ({text, name, options, handleOnChange, value}: ISelectProps) {
  return (
    <div className={styles.form_control}>
        <label htmlFor={name}>{text}:</label>
        <select name={name} id={name} onChange={handleOnChange} value={value || ""}>
            <option value="">Selecione uma opção</option>
            {options.map((option) => (
                <option value={option} key={option}>{option}</option>
            ))}
        </select>
    </div>
  );
}
