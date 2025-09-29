"use client";

import {
  Zap,
  Globe,
  Camera,
  Rocket,
  Satellite,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  {
    title: "APOD",
    description: "Today’s astronomy image with expert explanation.",
    href: "/apod",
    icon: Camera,
  },
  {
    title: "Mars Rover",
    description: "Latest images from Curiosity and Perseverance.",
    href: "/mars",
    icon: Rocket,
  },
  {
    title: "Near‑Earth Objects",
    description: "Track asteroids and comets approaching Earth.",
    href: "/neo",
    icon: Satellite,
  },
  {
    title: "Earth Imagery",
    description: "High‑resolution satellite views of our planet.",
    href: "/earth",
    icon: Globe,
  },
  {
    title: "Space Weather",
    description: "Solar activity, geomagnetic storms, and alerts.",
    href: "/space-weather",
    icon: Zap,
  },
  {
    title: "Media Gallery",
    description: "Browse NASA’s images, videos, and audio files.",
    href: "/gallery",
    icon: ImageIcon,
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FeaturesGrid() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      id="explore-section"
      ref={ref}
      className="w-full bg-muted/35"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-5 py-14">
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Explore NASA Data
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body">
            Jump into popular datasets and start exploring space right away.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((item, index) => (
            <motion.div key={item.title} variants={cardVariants} custom={index}>
              <Link
                href={item.href}
                className="group relative block rounded-4xl border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="rounded-2xl bg-primary/10 text-primary p-2.5"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-base leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground font-body leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-body">
                      Open section
                    </span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-primary/0 group-hover:ring-1 transition-[box-shadow,ring]" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
