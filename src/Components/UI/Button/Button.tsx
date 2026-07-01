import { memo } from 'react';
import styles from './Styles.module.scss';

interface ButtonProps {
  size?: 'm' | 'l' | 's' | 'ss' | 'min';
  color?: 'primary' | 'transparent';
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  radius?: number;
}

function ButtonComponent({
  size = 'm',
  color = 'primary',
  children,
  onClick,
  type = 'button',
  radius,
}: ButtonProps) {
  return (
    <button
      style={{ borderRadius: radius ? `${radius}px` : '' }}
      onClick={onClick}
      type={type}
      className={`${styles.button} ${styles[`button_${color}`]} ${styles[`button_${size}`]}`}
    >
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);
