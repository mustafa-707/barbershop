"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import { ProductCard, type Product } from "./product-card"

export function ProductCarousel({ 
  products, 
  title, 
  subtitle 
}: { 
  products: Product[],
  title?: string,
  subtitle?: string
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [hasDragged, setHasDragged] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  
  if (!products || products.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = 500; // Average item width + gap
      const offset = direction === 'left' ? -itemWidth : itemWidth;
      scrollRef.current.scrollBy({
        left: offset,
        behavior: 'smooth'
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setHasDragged(false);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsMouseDown(false);
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    
    // Only count as drag if moved more than 5px
    if (Math.abs(x - startX) > 5) {
      setHasDragged(true);
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="relative group/carousel space-y-16">
      {/* Header with Title and Controls */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 border-b border-foreground/5 pb-8">
        <div className="flex flex-col md:flex-row items-baseline gap-6">
          {title && <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase text-foreground">{title}</h2>}
          {subtitle && <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">{subtitle}</span>}
        </div>

        {/* Navigation Buttons - Elegant & Precise */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-14 w-14 rounded-full border-foreground/5 bg-foreground/[0.02] hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-500 group/btn shadow-xl backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6 transition-transform group-hover/btn:-translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-14 w-14 rounded-full border-foreground/5 bg-foreground/[0.02] hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-500 group/btn shadow-xl backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onClickCapture={onClickCapture}
        className={`flex gap-12 overflow-x-auto pb-24 pt-4 no-scrollbar snap-x snap-mandatory px-2 ${isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab scroll-smooth'}`}
      >
        {products.map((product, idx) => (
          <div
            key={product?.id ?? idx}
            className="flex-none w-[85vw] md:w-[450px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Visual Indicator of more items */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-1000" />
    </div>
  )
}
