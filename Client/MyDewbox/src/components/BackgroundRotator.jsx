import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// Use online business/finance images
const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // business meeting
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80", // handshake
  "https://images.unsplash.com/photo-1515168833906-d2a3b82b1a5e?auto=format&fit=crop&w=1200&q=80", // laptop finance
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80", // office
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", // money
];

const BackgroundRotator = ({ interval = 5000, className = "" }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div className={clsx("absolute inset-0 w-full h-full z-0", className)}>
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt="Background"
          className={clsx(
            "object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-1000",
            idx === current ? "opacity-100" : "opacity-0"
          )}
          draggable={false}
        />
      ))}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

BackgroundRotator.propTypes = {
  interval: PropTypes.number,
  className: PropTypes.string,
};

export default BackgroundRotator;
