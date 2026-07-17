import { memo, useEffect, useState } from "react";
import styles from "./Styles.module.scss";
import { Button } from "../Button";
import { Icon } from "../Icon";

function ScrollToTopComponent() {
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <>
      <div className="buttonScroll">
        {visible && (
          <Button onClick={scrollToTop} size="min" color="transparent">
            <div className={styles.icon}>
              <div className={styles.icon__rippleBg} />
              <div className={styles.icon__arrowUp}>
                <Icon name="arrowUp" />
              </div>
            </div>
          </Button>
        )}
      </div>
    </>
  );
}

export const ScrollToTop = memo(ScrollToTopComponent);
