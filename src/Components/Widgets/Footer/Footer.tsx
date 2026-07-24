import { memo } from "react";
import { Button } from "../../UI/Button";
import styles from "./Styles.module.scss";
import logo from "/logo.png";
import { Link } from "react-router-dom";

function FooterComponent() {
  const isActive = (path: string) => location.pathname === path;
  return (
    <footer className={styles.footer}>
      <img src={logo} className={styles.footer__logo} />
      <nav className={styles.footer__nav}>
        <Link to={"/films"}>
          <Button color="transparent" size="nav" className={isActive("/films") ? styles.footer__active : ""}>
            Фильмы
          </Button>
        </Link>
        <Link to={"/threads"}>
          <Button color="transparent" size="nav" className={isActive("/threads") ? styles.footer__active : ""}>
            Треды
          </Button>
        </Link>
      </nav>
    </footer>
  );
}

export const Footer = memo(FooterComponent);
