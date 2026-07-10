import { Link } from "react-router-dom";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { memo } from "react";
import styles from "./Styles.module.scss";
import { ScrollToTop } from "../../UI/ScrollToTop";

function HomeComponent() {
  return (
    <section className={styles.main}>
      <div className={styles.main__info}>
        <h1 className={styles.main__title}>Фильмы, сериалы в одном месте!</h1>
        <p>
          Всегда хотели узнать где можно бесплатно посмотреть то или иное
          произведение исскуства? Тогда, данный сайт был сделан для вас!
        </p>
        <Button color="primary" size="main" radius={5}>
          Посмотреть каталог фильмов
        </Button>
      </div>
      <div className={styles.main__container}>
        <div className={styles.main__container_filmTop}>
          <h2 className={styles.main__title_two}>
            Самый популярный фильм на неделе
          </h2>
          <Link to={""}>Посмотреть остальные фильмы</Link>
        </div>
        <Card
          size="long"
          className={styles.main__container_filmTop_card}
          image="https://i.amediateka.tech/resize/1920x960/_stor_/cms/content-contentasset/8/3a/5817f125101583fc94c8c3f70c08783a-10160-a9d6d5c8396645688d71203ed100f40a.jpg"
        />
      </div>
      <div className={styles.main__container}>
        <div className={styles.main__container_filmTop}>
          <h2 className={styles.main__title_two}>Вы хотели посмотреть</h2>
          <Link to={""}>
            <p>Полный список</p>
          </Link>
        </div>
        <div className={styles.main__films_listCard}>
          <Card image="https://www.kino-teatr.ru/movie/poster/18598/124134.jpg" />
          <Card image="https://www.kino-teatr.ru/movie/poster/18598/124134.jpg" />
          <Card image="https://www.kino-teatr.ru/movie/poster/18598/124134.jpg" />
        </div>
      </div>
      <div className="buttonScroll">
        <ScrollToTop />
      </div>
    </section>
  );
}

export const Home = memo(HomeComponent);
