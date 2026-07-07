import "../Styles/index.scss";
import "./Styles.scss";
import styles from "./Styles.module.scss";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { useState } from "react";
import { Icon } from "../Components/UI/Icon";
import { Card } from "../Components/UI/Card";
import { ScrollToTop } from "../Components/UI/ScrollToTop";
import { Checkbox } from "../Components/UI/Checkbox";
import { Pagination } from "../Components/UI/Pagination";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateUser } from "../Components/Pages/CreateUser";
import { Login } from "../Components/Pages/Login/Login";

const genres = ['Все', 'Фантастика', 'Экшн', 'Драма', 'Комедия'];

const initialFilters: Record<string, boolean> = {
  Все: false,
  Фантастика: false,
  Экшн: false,
  Драма: false,
  Комедия: false,
};

// 🔹 Компонент главной страницы
function HomePage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 10;

  const toggleFilter = (genre: string) => {
    setFilters(prev => ({ ...prev, [genre]: !prev[genre] }));
  };

  return (
    <>
      <div className={styles.block}>
        <Button color="primary" size="main" radius={5}>
          Посмотреть каталог фильмов
        </Button>
        <Button color="transparent" size="nav">
          Новости
        </Button>
        <Input 
          placeholder="Введите для поиска..." 
          value={search} 
          onChange={setSearch}
        />
        <Icon name="search"/>
        <Icon name="user"/>
      </div>

      <div className={styles.card}>
        <Card image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg'/>
        <Card image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg'/>
        <Card image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg'/>
      </div>

      <Card 
        size='long' 
        image='https://i.amediateka.tech/resize/1920x960/_stor_/cms/content-contentasset/8/3a/5817f125101583fc94c8c3f70c08783a-10160-a9d6d5c8396645688d71203ed100f40a.jpg'
      />

      <ScrollToTop />

      <div className={styles.filters}>
        {genres.map(genre => (
          <Checkbox 
            key={genre}
            label={genre}
            isActive={filters[genre]}
            onChange={() => toggleFilter(genre)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChange={setCurrentPage}
      />
    </>
  );
}

function AppComponent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export const App = AppComponent;