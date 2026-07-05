import { memo } from 'react';
import styles from './Styles.module.scss';
import { Button } from '../Button';
import cn from 'classnames';

interface CardProps {
  image?: string;
  size?: 'long' | 'main'; 
}

function CardComponent({ image, size = 'main'}: CardProps) {
  const buttonSize = size === 'long' ? 'long' : 'main';
  return (
    <div className={cn('card', styles.card, styles[`card_${size}`])}>
      {image && <img src={image} alt="Постер фильма" className={cn('card-image', styles.image)} />} 
      <Button 
        size={buttonSize} 
        color="primary" 
        radius={5}>
        Посмотреть
      </Button>
    </div>
  );
}

export const Card = memo(CardComponent);