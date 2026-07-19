import { memo, useState } from "react";
import styles from "./Styles.module.scss";
import { ScrollToTop } from "../../UI/ScrollToTop";
import { VideoModal } from "../../Layouts/VideoModal";
import { InfoSection } from "./Components/InfoSection/InfoSection";
import { PopularSection } from "./Components/PopularSection/PopularSection";
import { WishlistSection } from "./Components/WishlistSection/WishlistSection";
import { Film } from "../Films/Films";

function HomeComponent() {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewFilm = (film: Film) => {
    setSelectedFilm(film);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
  };

  return (
    <section className={styles.main}>
      <InfoSection />
      <PopularSection onView={handleViewFilm} />
      <WishlistSection onView={handleViewFilm} />
      <ScrollToTop />
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoSrc={selectedFilm?.videoUrl || ""}
        title={selectedFilm?.title}
      />
    </section>
  );
}

export const Home = memo(HomeComponent);