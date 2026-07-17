import styles from "./Styles.module.scss";
import { Input } from "../../UI/Input";
import { Card } from "../../Layouts/Card";
import { memo, useState, useMemo, useEffect } from "react";
import { Checkbox } from "../../UI/Checkbox";
import { Pagination } from "../../UI/Pagination";
import { ScrollToTop } from "../../UI/ScrollToTop";
import { genres } from "../../../data/film";
import { filmsAPI } from "../../../Api/films";
import { useSearch } from "../../../Contexts/SearchContext";
import { VideoModal } from "../../UI/VideoModal/VideoModal";

export interface Film {
  _id: number;
  title: string;
  genre: string[];
  image: string;
  videoUrl?: string;
}

const count_items = 9;

function FilmsComponent() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Film | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(genres.map((g) => [g, false])),
  );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await filmsAPI.getAll();
        console.log("Загружено фильмов:", data.length);
        setFilms(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
      setSearchQuery("");
    }
  }, [searchQuery, setSearchQuery]);

  const handleViewMovie = (movie: Film) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const toggleFilter = (genre: string) => {
    setFilters((prev) => ({ ...prev, [genre]: !prev[genre] }));
  };

  const filteredMovies = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    const activeGenres = Object.keys(filters).filter((g) => filters[g]);

    return films.filter((film) => {
      const matchesSearch = film.title.toLowerCase().includes(searchLower);
      const matchesGenre =
        activeGenres.length === 0 ||
        film.genre.some((g) => activeGenres.includes(g));

      return matchesSearch && matchesGenre;
    });
  }, [search, filters, films]);

  const totalPages = Math.ceil(filteredMovies.length / count_items);
  const startIndex = (currentPage - 1) * count_items;
  const paginatedMovies = filteredMovies.slice(
    startIndex,
    startIndex + count_items,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterToggle = (genre: string) => {
    toggleFilter(genre);
    setCurrentPage(1);
  };

  return (
    <section className={styles.films}>
      <h1 className={styles.films__title}>Фильмы</h1>
      <Input
        placeholder="Поиск по названию..."
        value={search}
        onChange={handleSearch}
      />
      <div className={styles.films__filters}>
        {genres.map((genre) => (
          <Checkbox
            key={genre}
            label={genre}
            isActive={filters[genre]}
            onChange={() => handleFilterToggle(genre)}
          />
        ))}
      </div>
      {paginatedMovies.length === 0 ? (
        <div className={styles.films__empty}>
          <p>Ничего не найдено</p>
          <span className={styles.films__empty_line}>Попробуйте изменить параметры поиска</span>
        </div>
      ) : (
        <>
          <div className={styles.films__wishlist}>
            {paginatedMovies.map((movie) => (
              <Card
                key={movie._id}
                title={movie.title}
                image={movie.image}
                onView={() => handleViewMovie(movie)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPage={totalPages}
              onChange={setCurrentPage}
            />
          )}
        </>
      )}
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoSrc={selectedMovie?.videoUrl || ""}
        title={selectedMovie?.title}
      />
      <ScrollToTop />
    </section>
  );
}

export const Films = memo(FilmsComponent);
