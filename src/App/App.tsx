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
    </>
  );
}

export const App = AppComponent;
