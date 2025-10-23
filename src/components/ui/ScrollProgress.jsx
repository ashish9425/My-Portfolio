import React from "react";
import { motion, useScroll } from "framer-motion";
import { cn } from "../../lib/utils";

export const ScrollProgress = React.forwardRef(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-1.5 origin-left bg-gradient-to-r from-gray-500 via-gray-800 to-gray-400",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";

