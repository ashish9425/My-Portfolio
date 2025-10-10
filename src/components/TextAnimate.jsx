import React, { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/utils";

const defaultContainerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0,
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

const defaultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
    },
};

const TextAnimateBase = ({
    children,
    delay = 0,
    duration = 0.3,
    className,
    segmentClassName,
    as: Component = "p",
    startOnView = true,
    once = false,
    by = "word",
    aurora = false, // The new prop to enable the aurora effect
    ...props
}) => {
    const MotionComponent = motion[Component] || motion.p;

    let segments = [];
    switch (by) {
        case "word":
            segments = children.split(/(\s+)/);
            break;
        case "character":
            segments = children.split("");
            break;
        case "line":
            segments = children.split("\n");
            break;
        case "text":
        default:
            segments = [children];
            break;
    }

    const finalVariants = {
        container: {
            ...defaultContainerVariants,
            show: {
                ...defaultContainerVariants.show,
                transition: {
                    delayChildren: delay,
                    staggerChildren: duration / segments.length,
                }
            }
        },
        item: defaultItemVariants
    };
    
    // Aurora styles are defined here and applied conditionally
    const auroraGradientStyle = {
      backgroundImage: `linear-gradient(135deg, #d6d6d6ff, #000000ff, #c9c9c9ff, #000000ff, #ffffffff)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };

    return (
        <AnimatePresence mode="popLayout">
            <MotionComponent
                variants={finalVariants.container}
                initial="hidden"
                whileInView={startOnView ? "show" : undefined}
                animate={startOnView ? undefined : "show"}
                exit="exit"
                className={cn(
                    "whitespace-pre-wrap",
                    aurora && "animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent",
                    className
                )}
                style={aurora ? auroraGradientStyle : {}}
                viewport={{ once }}
                aria-label={children}
                {...props}
            >
                {segments.map((segment, i) => (
                    <motion.span
                        key={`${by}-${segment}-${i}`}
                        variants={finalVariants.item}
                        className={cn(
                            by === "line" ? "block" : "inline-block whitespace-pre",
                            by === "line" ? "block" 
                            : by === "word" ? "inline whitespace-pre" 
                            : "inline-block whitespace-pre",
                            segmentClassName
                        )}
                        aria-hidden={true}
                    >
                        {segment}
                    </motion.span>
                ))}
            </MotionComponent>
        </AnimatePresence>
    );
};

export const TextAnimate = memo(TextAnimateBase);

