// src/lib/animations.js
// Global animation presets for a smooth, cinematic portfolio feel.

export const transitions = {
  // 💨 A soft, natural spring — good for section reveals, modals, cards
  gentle: {
    type: "spring",
    stiffness: 70,
    damping: 18,
    mass: 0.9,
  },

  // ✨ For fades, text entrances, or subtle movements
  fade: {
    duration: 1.1,
    ease: [0.25, 0.1, 0.25, 1], // classic ease-in-out
  },

  // ⚡ For buttons or small hover motions
  snappy: {
    type: "spring",
    stiffness: 250,
    damping: 15,
  },
};

// Common animation variants
export const variants = {
  // 🪄 Section or card reveal
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.gentle,
    },
  },

  // 🌫 Simple fade
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: transitions.fade,
    },
  },

  // 🌊 Container with staggered children
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
        ...transitions.fade,
      },
    },
  },
};
