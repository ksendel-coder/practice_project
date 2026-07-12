import { Link } from "react-router-dom";
import styles from "./Styles.module.scss";
import { Card } from "../../../../Layouts/Card";
import { memo } from "react";

function WishlistSectionComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.container__films}>
        <h2 className={styles.container__title}>Вы хотели посмотреть</h2>
        <Link to={""}>
          <p>Полный список</p>
        </Link>
      </div>
      <div className={styles.container__wishlist}>
        <Card image="https://www.kino-teatr.ru/movie/poster/18598/124134.jpg" />
        <Card image="https://www.kino-teatr.ru/movie/poster/18598/124134.jpg" />
        <Card image="https://www.kino-teatr.ru/movie/poster/18598/124134.jpg" />
      </div>
    </div>
  );
}

export const WishlistSection = memo(WishlistSectionComponent);
