import { memo } from "react";
import styles from './Styles.module.scss';
import cn from 'classnames';

interface CheckboxProps {
  onChange?: () => void;
  isActive?: boolean;
  label?: string;
  className?: string;
}

function CheckboxComponent ({ onChange, isActive, label, className='' } : CheckboxProps) {
  return (
    <div onClick={onChange} className={cn(styles.container, className)}>
      <div className={cn(styles.checkbox, isActive && styles.checkbox_active)} />
        <p className={cn(styles.container_label, isActive && styles.container_label_active)}>{label}</p>
    </div>
  );
}

export const Checkbox = memo(CheckboxComponent);