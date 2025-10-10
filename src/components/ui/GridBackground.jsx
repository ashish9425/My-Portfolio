import { cn } from "../../lib/utils";
import React from "react";

// This component now uses "export default" to be properly imported
export default function GridBackground({ children }) {
  return (
    <div className="h-full w-full bg-white relative flex items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 h-full w-full",
          "[background-size:30px_30px]",
          "[background-image:linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 h-full w-full flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

