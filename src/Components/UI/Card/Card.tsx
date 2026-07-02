import { memo } from 'react';
import styles from './Styles.module.scss';
import { Button } from '../Button';

interface CardProps {
  image?: string;
  size?: 'long' | 'main'; 
}

function CardComponent({ image, size = 'main'}: CardProps) {
  const buttonSize = size === 'long' ? 'long' : 'main';
  return (
    <div className={`card ${styles.card} ${styles[`card_${size}`]}`}>
      {image && <img src={image} className={`card-image ${styles.image}`} />} 
      <Button 
        size={buttonSize} 
        color="primary" 
        radius={5}
      >
        Посмотреть
      </Button>
    </div>
  );
}

export const Card = memo(CardComponent);