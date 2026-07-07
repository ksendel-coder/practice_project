import { memo } from 'react';
import styles from './Styles.module.scss';
import cn from 'classnames';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;  
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  className?: string;
  name?: string;
}

function InputComponent({
  placeholder,
  value,
  onChange,
  label,
  error,
  type = 'text',
  disabled,
  className,
}: InputProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <input
        type={type}
        className={cn(styles.input, {
          [styles.error]: error,  
        })}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
export const Input = memo(InputComponent);