import { memo } from 'react';
import styles from './Styles.module.scss';

interface LoaderProps {
  size?: number;
  color?: string;
}

function LoaderComponent({ size = 40, color = 'var(--secondary-color)' }: LoaderProps) {
  return (
    <div className={styles.loaderWrapper}>
      <div 
        className={styles.loaderWrapper__loader} 
        style={{ 
          width: size, 
          height: size,
          borderTopColor: color,
        }} 
      />
    </div>
  );
}

export const Loader = memo(LoaderComponent);