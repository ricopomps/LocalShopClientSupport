import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  isLoading,
}) => {
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (!isLoading) {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY.current ? "down" : "up";
        
        if (
          (scrollDirection === "down" && 
            window.innerHeight + currentScrollY >=
            document.documentElement.scrollHeight - 100) ||
          (scrollDirection === "up" && currentScrollY === 0)
        ) {
          onLoadMore();
        }

        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, onLoadMore]);

  return null;
};

export default InfiniteScroll;