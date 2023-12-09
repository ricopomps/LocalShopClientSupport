import React, { useRef } from "react";
import { Row } from "react-bootstrap";
import styles from "../styles/HorizontalScroll.module.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleWheelScroll = (e: React.WheelEvent) => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft += e.deltaY;
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -500 : 500;
      container.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Row
        xs={1}
        md={2}
        xl={3}
        ref={containerRef}
        onWheel={handleWheelScroll}
        className={`g-4 ${styles.container}`}
      >
        {children}
      </Row>
      <div className={styles.scrollIndicators}>
        <AiOutlineArrowLeft
          onClick={() => scroll("left")}
          className={styles.scrollIndicatorLeft}
        />
        <AiOutlineArrowRight
          onClick={() => scroll("right")}
          className={styles.scrollIndicatorRight}
        />
      </div>
    </div>
  );
};

export default HorizontalScroll;
