import { useEffect, useState } from "react";

interface DissaperingMessageProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export default function DissaperingMessage({
  children,
  duration = 5000,
  className,
}: DissaperingMessageProps) {
  const [visibe, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  return (
    <div
      className={`${
        visibe ? "opacity-100" : "opacity-0"
      } w-max transition-opacity duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
