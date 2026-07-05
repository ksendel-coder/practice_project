import { memo, useEffect, useState } from "react";
import styles from './Styles.module.scss';
import { Button } from "../Button";
import { Icon } from "../Icon";

function ScrollToTopComponent() {
  const [visible, setVisible] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <>  
      {visible && (
        <Button onClick={scrollToTop} size="min" color="transparent">
          <div className={styles.icon}>
            <div className={styles.rippleBg} />
            <div className={styles.arrowUp}>
              <Icon name="arrowUp" />
            </div>
          </div>
        </Button>
      )}
    </>
  );
}

export const ScrollToTop = memo(ScrollToTopComponent);