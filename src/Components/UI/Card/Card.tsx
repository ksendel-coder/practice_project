import { memo } from 'react';
import styles from './Styles.module.scss';
import { Button } from '../Button';
import cn from 'classnames';

interface CardProps {
  image?: string;
  size?: 'long' | 'main'; 
  className?: string;
}

function CardComponent({ image, size = 'main', className=""}: CardProps) {
  const buttonSize = size === 'long' ? 'long' : 'main';
  return (
    <div className={cn('card', styles.card, styles[`card_${size}`], className)}>
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