import { useState, useMemo } from 'react';
import { genres } from '../Types/genres';
import { Film } from '../Components/Pages/Films/Films';

export const useFilmFilters = (films: Film[], search: string) => {
  const [filters, setFilters] = useState(
    Object.fromEntries(genres.map((g) => [g, false]))
  );

  const filteredFilms = useMemo(() => {
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

  const toggleFilter = (genre: string) => {
    setFilters((prev) => ({ ...prev, [genre]: !prev[genre] }));
  };
  
  return { filters, toggleFilter, filteredFilms };
};