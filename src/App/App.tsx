import "../Styles/index.scss";
import "./Styles.scss";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { useState } from "react";
import { Icon } from "../Components/UI/Icon";
import { Card } from "../Components/UI/Card";
import styles from "./Styles.module.scss";

function AppComponent() {
  const [search, setSearch] = useState('');
  return (
    <>
      <div className={styles.block}>
        <Button color="primary" size="l" radius={5}>Посмотреть каталог фильмов</Button>
        <Input placeholder="Введите для поиска..." value={search} onChange={setSearch}/>
        <Icon name="search"/>
        <Icon name="user"/>
      </div>
        <div className={styles.card}>
          <Card title='' image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg' onView={() => console.log('Смотреть')} />
          <Card title='' image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg' onView={() => console.log('Смотреть')} />
          <Card title='' image='https://www.kino-teatr.ru/movie/poster/18598/124134.jpg' onView={() => console.log('Смотреть')} />
        </div>
    </>
  );
}

export const App = AppComponent;
