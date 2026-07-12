import { memo } from "react";
import { Button } from "../../../../UI/Button";
import styles from "./Styles.module.scss";
import { Link } from "react-router-dom";

function InfoSectionComponent() {
  return (
    <div className={styles.info}>
      <h1 className={styles.info__title}>Фильмы, сериалы в одном месте!</h1>
      <p>
        Всегда хотели узнать где можно бесплатно посмотреть то или иное
        произведение исскуства? Тогда, данный сайт был сделан для вас!
      </p>
      <Link to={"/films"}>
        <Button color="primary" size="main" radius={5}>
          Посмотреть каталог фильмов
        </Button>
      </Link>
    </div>
  );
}

export const InfoSection = memo(InfoSectionComponent);
