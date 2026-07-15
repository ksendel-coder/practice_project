import { memo } from "react";
import styles from './Styles.module.scss';
import { Card } from "../../Layouts/Card";

function ThreadsComponent() {
  return (
    <div className={styles.threads}>
      <Card className={styles.threads__card} hideButton={true}>
        <div className={styles.threads__card__post}>
          <h3 className={styles.threads__card__post_title}>Мой первый тред</h3>
          <p className={styles.post__content}>Это текст моего первого треда. Здесь можно обсудить что угодно!</p>
        </div>
      </Card>
    </div>
  );
}

export const Threads = memo(ThreadsComponent);