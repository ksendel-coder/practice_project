import { memo, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import { Icon } from "../../UI/Icon/Icon";
import { useUserContext } from "../../../Contexts/UserContext";
import styles from "./Styles.module.scss";
import logo from "/logo.png";
import useOutsideClick from "../../../Hooks/useClickOutside";

function HeaderComponent() {
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, logout } = useUserContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserClick = () => {
    if (!isAuth) {
      navigate("/createUser");
    } else {
      toggleDropdown();
    }
  };

  useOutsideClick(
    dropdownRef,
    () => setIsDropdownOpen(false),
    ["button", "a[href]"],
    isDropdownOpen
  );

  return (
    <header className={styles.header}>
      <Link to="/">
        <img src={logo} className={styles.header__logo} alt="Logo" />
      </Link>

      <nav className={styles.header__nav}>
        <Link to="/films">
          <Button
            size="nav"
            color="transparent"
            className={isActive("/films") ? styles.header__active : ""}
          >
            Фильмы
          </Button>
        </Link>
        <Link to="/threads">
          <Button
            size="nav"
            color="transparent"
            className={isActive("/threds") ? styles.header__active : ""}
          >
            Треды
          </Button>
        </Link>
      </nav>

      <div className={styles.header__instruments}>
        <Input
          placeholder="Введите для поиска..."
          value={search}
          onChange={setSearch}
        />
        <Icon name="search" />
      </div>

      <div className={styles.header__user} ref={dropdownRef}>
        <div
          className={styles.userAvatar}
          onClick={handleUserClick}
          role="button"
          tabIndex={0}
        >
          <Icon name="user" />
        </div>

        {isAuth && isDropdownOpen && (
          <div className={styles.dropdown}>
            <button className={styles.dropdown__item} onClick={handleProfile}>
              Профиль
            </button>
            <button
              className={`${styles.dropdown__item} ${styles.dropdown__item_danger}`}
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);