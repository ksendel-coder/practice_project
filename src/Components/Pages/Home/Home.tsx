import { memo, useState } from "react";
import styles from "./Styles.module.scss";
import { ScrollToTop } from "../../UI/ScrollToTop";
import { VideoModal } from "../../UI/VideoModal/VideoModal";
import { InfoSection } from "./Components/InfoSection/InfoSection";
import { PopularSection } from "./Components/PopularSection/PopularSection";
import { WishlistSection } from "./Components/WishlistSection/WishlistSection";
import { Film } from "../Films/Films";

function HomeComponent() {
  const [selectedMovie, setSelectedMovie] = useState<Film | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewMovie = (movie: Film) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <section className={styles.main}>
      <InfoSection />
      <PopularSection onView={handleViewMovie} />
      <WishlistSection onView={handleViewMovie} />
      <ScrollToTop />
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoSrc={selectedMovie?.videoUrl || ""}
        title={selectedMovie?.title}
      />
    </section>
  );
}

export const Home = memo(HomeComponent);