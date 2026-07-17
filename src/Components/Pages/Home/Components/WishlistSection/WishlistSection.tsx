import { Link } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import { Card } from "../../../../Layouts/Card";
import { filmsAPI } from "../../../../../Api/films";
import styles from "./Styles.module.scss";
import { Film } from "../../../Films/Films";

interface WishlistSectionProps {
  onView?: (movie: Film) => void;
}

function WishlistSectionComponent({ onView }: WishlistSectionProps) {
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await filmsAPI.getAll();
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setMovies(shuffled.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__films}>
        <h2 className={styles.container__title}>Вы хотели посмотреть</h2>
        <Link to="/films" className={styles.container__filmLink}>
          Полный список
        </Link>
      </div>
      <div className={styles.container__wishlist}>
        {movies.map((movie) => (
          <Card
            key={movie._id}
            title={movie.title}
            image={movie.image}
            onView={() => onView?.(movie)}
          />
        ))}
      </div>
    </div>
  );
}

export const WishlistSection = memo(WishlistSectionComponent);
