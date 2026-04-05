"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";
import './scroll-velocity.css';

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

function VelocityText({
  children,
  baseVelocity = 100,
  scrollContainerRef,
}: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll({
    container: scrollContainerRef
  });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="velocity-parallax">
      <motion.div className="velocity-scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

interface ScrollVelocityProps {
  texts: string[] | React.ReactNode[];
  velocity?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
}

export const ScrollVelocity = ({
  texts,
  velocity = 100,
  scrollContainerRef,
  className = "",
}: ScrollVelocityProps) => {
  return (
    <section className={`velocity-container ${className}`}>
      {texts.map((content, i) => (
        <VelocityText
          key={i}
          baseVelocity={i % 2 === 0 ? velocity : -velocity}
          scrollContainerRef={scrollContainerRef}
        >
          {content}
        </VelocityText>
      ))}
    </section>
  );
};
