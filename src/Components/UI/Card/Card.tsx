import { memo } from 'react';
import styles from './Styles.module.scss';
import { Button } from '../Button';

interface CardProps {
  title: string;
  image?: string;
  size?: 's' | 'l' | 'm'; 
  onView?: () => void;
}

function CardComponent({ title, image, size = 's', onView }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[`card_${size}`]}`}>
      {image && <img src={image} alt={title} className={styles.image} />}  {/* ← добавил className */}
      <h3 className={styles.title}>{title}</h3>  {/* ← добавил className */}
      <Button 
        size="s" 
        color="primary" 
        onClick={onView}
      >
        Посмотреть
      </Button>
    </div>
  );
}

export const Card = memo(CardComponent);