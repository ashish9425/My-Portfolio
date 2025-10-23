import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCarousel = forwardRef(({ gallery }, ref) => {
  // We remove 'align: center' as it works best with variable widths
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Expose scroll functions to the parent component
  useImperativeHandle(ref, () => ({
    scrollPrev,
    scrollNext,
  }));

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const currentSlide = gallery[selectedIndex] || gallery[0];

  return (
    <div className="h-full w-full flex flex-col relative bg-gray-100">
      <div className="w-full h-4/5 flex-grow relative overflow-hidden" ref={emblaRef}>
        <div className="embla__container h-full">
          {gallery.map((item, index) => (
            <div 
              key={index}
              className="embla__slide"
            >
              {/* The image itself now controls the width of the slide */}
              <div className="relative h-full transition-all duration-500 ease-in-out">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-auto" // This is the key change
                />
                <AnimatePresence>
                  {index !== selectedIndex && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/80"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full p-6 bg-white border-t h-1/4 flex items-center">
        <div>
            <h4 className="font-bold text-xl">{currentSlide.title}</h4>
            <p className="text-base text-gray-600 mt-1">{currentSlide.description}</p>
        </div>
      </div>
    </div>
  );
});

ProjectCarousel.displayName = 'ProjectCarousel';
export default ProjectCarousel;

