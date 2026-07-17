import { memo } from "react";
import styles from "./Styles.module.scss";

interface IconProps {
  name:
    | "search"
    | "user"
    | "arrowUp"
    | "edit"
    | "delete"
    | "like"
    | "likeFilled";
  size?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const icons = {
  search: (
    <svg
      width="35"
      height="34"
      viewBox="0 0 35 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.5 32.5L25.7667 25.0083M29.9444 15.2778C29.9444 22.887 23.5769 29.0556 15.7222 29.0556C7.86751 29.0556 1.5 22.887 1.5 15.2778C1.5 7.66852 7.86751 1.5 15.7222 1.5C23.5769 1.5 29.9444 7.66852 29.9444 15.2778Z"
        stroke="White"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  user: (
    <svg
      width="32"
      height="35"
      viewBox="0 0 32 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.5 33.5V29.9444C30.5 28.0585 29.7362 26.2497 28.3765 24.9161C27.0169 23.5825 25.1728 22.8333 23.25 22.8333H8.75C6.82718 22.8333 4.98311 23.5825 3.62348 24.9161C2.26384 26.2497 1.5 28.0585 1.5 29.9444V33.5M23.25 8.61111C23.25 12.5385 20.0041 15.7222 16 15.7222C11.9959 15.7222 8.75 12.5385 8.75 8.61111C8.75 4.68375 11.9959 1.5 16 1.5C20.0041 1.5 23.25 4.68375 23.25 8.61111Z"
        stroke="White"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowUp: (
    <svg
      width="40"
      height="48"
      viewBox="0 0 40 48"
      fill="none"
      stroke="White"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="20" y1="8" x2="20" y2="40" />
      <polyline points="6 18, 20 4, 34 18" />
    </svg>
  ),
  edit: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="White"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  delete: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  like: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  likeFilled: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

function IconComponent({
  name,
  size,
  color = "currentColor",
  onClick,
}: IconProps) {
  return (
    <div
      className={styles.icon}
      style={{ width: size, height: size, color }}
      onClick={onClick}
    >
      {icons[name]}
    </div>
  );
}

export const Icon = memo(IconComponent);
