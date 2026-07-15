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
}

function CardComponent({
  image,
  size = "main",
  className = "",
  title,
  children,
  hideButton = false,
}: CardProps) {
  const buttonSize = size === "long" ? "long" : "main";
  return (
    <div className={cn(styles.card, styles[`card_${size}`], className)}>
      {image && (
        <img
          src={image}
          alt={`Постер фильма ${title}`}
          className={cn("card-image", styles.image)}
        />
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
      {!hideButton && (
        <Button size={buttonSize} color="primary" radius={5}>
          Посмотреть
        </Button>
      )}
    </div>
  );
}

export const Card = memo(CardComponent);
