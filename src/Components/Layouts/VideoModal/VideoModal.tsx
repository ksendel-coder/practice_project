import { memo, useEffect } from "react";
import styles from "./Styles.module.scss";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title?: string;
}

function VideoModalComponent({ isOpen, onClose, videoSrc, title, }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.overlay__modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.overlay__modal__closeBtn} onClick={onClose}>
          Закрыть
        </button>
        <div className={styles.overlay__modal__videoWrapper}>
          <iframe
            src={videoSrc}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allow="clipboard-write; autoplay; fullscreen"
            allowFullScreen
            title={title || "Видео"}
          />
        </div>
        {title && <h3 className={styles.overlay__title}>{title}</h3>}
      </div>
    </div>
  );
}

export const VideoModal = memo(VideoModalComponent);
