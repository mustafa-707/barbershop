"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"

import { ProductCard, type Product } from "./product-card"

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  if (!products || products.length === 0) return null

  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Navigation Buttons (RTL Safe) */}
      <div className="absolute -top-24 end-0 flex gap-4 rtl:flex-row-reverse z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleScroll('left')}
          className="h-16 w-16 rounded-[1.5rem] glass dark:glass-dark border-foreground/10 hover:border-primary/50 text-primary transition-all duration-500 hover:shadow-gold group/btn"
        >
          <ChevronLeft className="h-8 w-8 transition-transform group-hover/btn:-translate-x-1" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleScroll('right')}
          className="h-16 w-16 rounded-[1.5rem] glass dark:glass-dark border-foreground/10 hover:border-primary/50 text-primary transition-all duration-500 hover:shadow-gold group/btn"
        >
          <ChevronRight className="h-8 w-8 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={startDrag}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={onDrag}
        className="flex gap-16 overflow-x-auto pb-24 pt-10 no-scrollbar px-6 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {products.map((product, idx) => (
          <motion.div
            key={product?.id ?? idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-none w-[320px] md:w-[500px]"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
