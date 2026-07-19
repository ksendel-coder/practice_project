import { memo, ReactNode } from "react";
import styles from "./Styles.module.scss";
import { Button } from "../../UI/Button";
import cn from "classnames";

interface CardProps {
  image?: string;
  size?: "long" | "main";
  className?: string;
  title?: string;
  children?: ReactNode;
  hideButton?: boolean;
  onView?: () => void;
}

function CardComponent({
  image,
  size = "main",
  className = "",
  title,
  children,
  hideButton = false,
  onView,
}: CardProps) {
  const buttonSize = size === "long" ? "long" : "main";
  return (
    <div className={cn(styles.card, styles[`card__${size}`], className)}>
      {image && (
        <img
          src={image}
          alt={`Постер фильма ${title}`}
          className={cn("card-image", styles[`card__${size}__image`])}
        />
      )}
      {title && <h3 className={styles.card__title}>{title}</h3>}
      {children}
      {!hideButton && (
        <Button size={buttonSize} color="primary" radius={5} onClick={onView} className={styles.card__button}>
          Посмотреть
        </Button>
      )}
    </div>
  );
}

export const Card = memo(CardComponent);
