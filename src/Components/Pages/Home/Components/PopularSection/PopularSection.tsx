import { Link } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import { Card } from "../../../../Layouts/Card";
import { filmsAPI } from "../../../../../Api/films";
import styles from "./Styles.module.scss";
import { Film } from "../../../Films/Films";

interface PopularSectionProps {
  onView?: (movie: Film) => void;
}

function PopularSectionComponent({ onView }: PopularSectionProps) {
  const [popularMovie, setPopularMovie] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await filmsAPI.getAll();
        if (data.length > 0) {
          setPopularMovie(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!popularMovie) {
    return <div className={styles.empty}>Нет фильмов</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__filmTop}>
        <h2 className={styles.container__title}>
          Самый популярный фильм на неделе
        </h2>
        <Link to="/films" className={styles.container__filmLink}>
          Посмотреть остальные фильмы
        </Link>
      </div>
      <Card
        size="long"
        className={styles.container__card}
        title={popularMovie.title}
        image={popularMovie.image}
        onView={() => onView?.(popularMovie)}
      />
    </div>
  );
}

export const PopularSection = memo(PopularSectionComponent);
