import styles from "./Styles.module.scss";
import { Input } from "../../UI/Input";
import { Card } from "../../Layouts/Card";
import { memo, useState, useEffect } from "react";
import { Checkbox } from "../../UI/Checkbox";
import { Pagination } from "../../UI/Pagination";
import { ScrollToTop } from "../../UI/ScrollToTop";
import { filmsAPI } from "../../../Api/films";
import { useSearch } from "../../../Contexts/SearchContext";
import { VideoModal } from "../../Layouts/VideoModal";
import { Loader } from "../../UI/Loader";
import { useFilmFilters } from "../../../Hooks/useFilmFilters";
import { usePagination } from "../../../Hooks/usePagination";

export const genres = [
  "Фантастика",
  "Фэнтези",
  "Драма",
  "Мелодрама",
  "Комедия",
  "Боевик",
  "Ужасы",
  "Детектив",
];

export interface Film {
  _id: number;
  title: string;
  genre: string[];
  image: string;
  videoUrl?: string;
}

function FilmsComponent() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      try {
        const data = await filmsAPI.getAll();
        setFilms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
      setSearchQuery("");
    }
  }, [searchQuery]);

  const { search, setSearch, filters, toggleFilter, filteredFilms } =
    useFilmFilters(films);

  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination(filteredFilms, 9);

  const handleViewFilm = (film: Film) => {
    setSelectedFilm(film);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterToggle = (genre: string) => {
    toggleFilter(genre);
    setCurrentPage(1);
  };

  if (loading) return <Loader />;

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
      {paginatedItems.length === 0 ? (
        <div className={styles.films__empty}>
          <p>Ничего не найдено</p>
          <span className={styles.films__empty_line}>
            Попробуйте изменить параметры поиска
          </span>
        </div>
      ) : (
        <>
          <div className={styles.films__wishlist}>
            {paginatedItems.map((film) => (
              <Card
                key={film._id}
                title={film.title}
                image={film.image}
                onView={() => handleViewFilm(film)}
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
        videoSrc={selectedFilm?.videoUrl || ""}
        title={selectedFilm?.title}
      />
      <ScrollToTop />
    </section>
  );
}

export const Films = memo(FilmsComponent);