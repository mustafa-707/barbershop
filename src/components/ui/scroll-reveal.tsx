"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll-reveal.css';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  stagger?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  stagger = 0.05,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    if (typeof children !== 'string') return children;
    return children.split(' ').map((word, index) => (
      <span key={index} className="scroll-reveal-word inline-block">
        {word}&nbsp;
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.scroll-reveal-word');
    if (words.length === 0) return;

    const scroller = scrollContainerRef?.current || window;

    const tl = gsap.fromTo(
      words,
      {
        opacity: baseOpacity,
        rotate: baseRotation,
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        y: 20,
      },
      {
        ease: 'power2.out',
        opacity: 1,
        rotate: 0,
        filter: 'blur(0px)',
        y: 0,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller: scroller,
          start: 'top bottom-=10%',
          end: 'top center+=20%',
          scrub: 1,
        },
      }
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength, stagger]);

  return (
    <div ref={containerRef} className={`scroll-reveal-container ${containerClassName}`}>
      <div className={`scroll-reveal-text ${textClassName}`}>{splitText}</div>
    </div>
  );
};
