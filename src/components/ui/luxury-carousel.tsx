"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './luxury-carousel.css';

interface CarouselItemProps {
  id?: string | number;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItemProps[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}

const GAP = 20;

const CarouselItem = ({
  item,
  index,
  itemWidth,
  trackItemOffset,
  x,
}: {
  item: CarouselItemProps;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: any;
}) => {
  const range = [
    (index - 1) * trackItemOffset,
    index * trackItemOffset,
    (index + 1) * trackItemOffset
  ];

  const scale = useTransform(x, range, [0.8, 1, 0.8]);
  const rotateY = useTransform(x, range, [45, 0, -45]);
  const opacity = useTransform(x, range, [0.5, 1, 0.5]);

  return (
    <motion.div
      className="luxury-carousel-item"
      style={{
        width: itemWidth,
        scale,
        rotateY,
        opacity,
      }}
    >
      <div className="luxury-carousel-item-content">
        {item.icon && <div className="luxury-carousel-item-icon">{item.icon}</div>}
        {item.title && <h3 className="luxury-carousel-item-title">{item.title}</h3>}
        {item.description && <p className="luxury-carousel-item-description">{item.description}</p>}
        {item.content}
      </div>
    </motion.div>
  );
};

export const LuxuryCarousel = ({
  items,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
}: CarouselProps) => {
  const [position, setPosition] = useState(loop ? 1 : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const itemWidth = baseWidth;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop || items.length === 0) return items;
    return [items[items.length - 1]!, ...items, items[0]!];
  }, [items, loop]);

  const handleNext = () => {
    if (isAnimating) return;
    if (!loop && position === items.length - 1) return;
    setPosition((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    if (!loop && position === 0) return;
    setPosition((prev) => prev - 1);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = itemWidth / 4;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (loop) {
      if (position === 0) {
        setTimeout(() => setPosition(items.length), 500);
      } else if (position === itemsForRender.length - 1) {
        setTimeout(() => setPosition(1), 500);
      }
    }
  }, [position, loop, items.length, itemsForRender.length]);

  useEffect(() => {
    if (!autoplay || isHovered || isAnimating) return;
    const interval = setInterval(handleNext, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, isAnimating, position]);

  // Update x motion value based on position
  useEffect(() => {
    x.set(-(position * trackItemOffset));
  }, [position, trackItemOffset, x]);

  return (
    <div
      className="luxury-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      <div className="luxury-carousel-controls">
        <button 
          className="luxury-carousel-control prev" 
          onClick={handlePrev} 
          disabled={!loop && position === 0}
        >
          <FiChevronLeft />
        </button>
        <button 
          className="luxury-carousel-control next" 
          onClick={handleNext} 
          disabled={!loop && position === items.length - 1}
        >
          <FiChevronRight />
        </button>
      </div>

      <div className="luxury-carousel-viewport">
        <motion.div
          className="luxury-carousel-track"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{
            perspective: 1000,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={index}
              item={item}
              index={index}
              itemWidth={itemWidth}
              trackItemOffset={trackItemOffset}
              x={x}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
