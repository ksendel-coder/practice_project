import { Link } from "react-router-dom";
import styles from "./Styles.module.scss";
import { Card } from "../../../../Layouts/Card";
import { memo } from "react";

function PopularSectionComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.container__filmTop}>
        <h2 className={styles.container__title}>
          Самый популярный фильм на неделе
        </h2>
        <Link to={""}>Посмотреть остальные фильмы</Link>
      </div>
      <Card
        size="long"
        className={styles.container__card}
        image="https://i.amediateka.tech/resize/1920x960/_stor_/cms/content-contentasset/8/3a/5817f125101583fc94c8c3f70c08783a-10160-a9d6d5c8396645688d71203ed100f40a.jpg"
      />
    </div>
  );
}

export const PopularSection = memo(PopularSectionComponent);