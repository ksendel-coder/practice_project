import { memo } from "react";
import { Button } from "../../UI/Button";
import styles from "./Styles.module.scss";
import logo from "/logo.png";

function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <img src={logo} className={styles.footer__logo} />
      <nav className={styles.footer__nav}>
        <Button color="transparent" size="nav">
          Фильмы
        </Button>
        <Button color="transparent" size="nav">
          Треды
        </Button>
      </nav>
    </footer>
  );
}

export const Footer = memo(FooterComponent);
