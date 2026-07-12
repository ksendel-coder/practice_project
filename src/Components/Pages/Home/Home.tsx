import { memo } from "react";
import styles from "./Styles.module.scss";
import { ScrollToTop } from "../../UI/ScrollToTop";
import { InfoSection } from "./Components/InfoSection/InfoSection";
import { PopularSection } from "./Components/PopularSection/PopularSection";
import { WishlistSection } from "./Components/WishlistSection/WishlistSection";

function HomeComponent() {
  return (
    <section className={styles.main}>
      <InfoSection />
      <PopularSection />
      <WishlistSection />
      <ScrollToTop />
    </section>
  );
}

export const Home = memo(HomeComponent);
