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

const genres = ['Все', 'Фантастика', 'Экшн', 'Драма', 'Комедия'];
const initialFilters: Record<string, boolean> = {
  Все: false,
  Фантастика: false,
  Экшн: false,
  Драма: false,
  Комедия: false,
};

function AppComponent() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  
  const toggleFilter = (genre: string) => {
    setFilters(prev => ({...prev,[genre]: !prev[genre]}));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 10;

  return (
    <>
      <div className={styles.block}>
        <Button color="primary" size="main" radius={5}>Посмотреть каталог фильмов</Button>
        <Button color="transparent" size="nav">Новости</Button>
        <Input placeholder="Введите для поиска..." value={search} onChange={setSearch}/>
        <Icon name="search"/>
        <Icon name="user"/>
      </div>

      <div className={styles.card}>
        <Card image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg'/>
        <Card image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg'/>
        <Card image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg'/>
      </div>

      <Card size='long' image='https://i.amediateka.tech/resize/1920x960/_stor_/cms/content-contentasset/8/3a/5817f125101583fc94c8c3f70c08783a-10160-a9d6d5c8396645688d71203ed100f40a.jpg'/>
      
      <div className="buttonScroll"><ScrollToTop></ScrollToTop></div>
      
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

export const App = AppComponent;
