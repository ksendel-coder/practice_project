import { memo, useState } from "react";
import { Button } from "../../UI/Button/Button";
import styles from "./Styles.module.scss";
import { Input } from "../../UI/Input/Input";
import { Icon } from "../../UI/Icon/Icon";
import logo from '/logo.png'
import { Link } from "react-router-dom";

function HeaderComponent () {
    
  const [search, setSearch] = useState('');

  return (
    <header className={styles.header}>
      <Link to={'/'}>
        <img src={logo} className={styles.header__logo}/>
      </Link>
      <nav className={styles.header__nav}>
        <Button color="transparent" size="nav">
          Фильмы
        </Button>
        <Button color="transparent" size="nav">
          Треды
        </Button>
      </nav>

      <div className={styles.header__instruments}>
          <Input
          placeholder="Введите для поиска..." 
          value={search} 
          onChange={setSearch}
        />
        <Icon name="search" className={styles.instruments__userIcon}/>
      </div>
        <Icon name="user" />
    </header>
  );
};

export const Header = memo(HeaderComponent);
