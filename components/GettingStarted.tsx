"use client";

import {
  Search,
  Eye,
  Share2,
  ArrowRight,
  Camera,
  Rocket,
  Satellite,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    number: "01",
    title: "Choose Your Dataset",
    description:
      "Pick from Mars rover photos, astronomy images, or near-Earth objects to start exploring.",
    icon: Search,
    cta: "Browse Datasets",
    href: "/apod",
    features: [
      { icon: Camera, label: "Daily Space Photos" },
      { icon: Rocket, label: "Mars Rover Images" },
      { icon: Satellite, label: "Asteroid Tracking" },
    ],
  },
  {
    number: "02",
    title: "Explore the Data",
    description:
      "Dive deep into NASA's collection with real-time data, detailed metadata, and stunning visuals.",
    icon: Eye,
    cta: "Start Exploring",
    href: "/mars",
    features: [
      { icon: Search, label: "Advanced Filters" },
      { icon: Eye, label: "High-Res Viewing" },
      { icon: ArrowRight, label: "Related Content" },
    ],
  },
  {
    number: "03",
    title: "Save & Share",
    description:
      "Bookmark your favorites, download images, and share discoveries with the space community.",
    icon: Share2,
    cta: "View Gallery",
    href: "/asteroids",
    features: [
      { icon: Share2, label: "Social Sharing" },
      { icon: ArrowRight, label: "Direct Links" },
      { icon: Eye, label: "Personal Collection" },
    ],
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 1.2,
    },
  },
};

export default function GettingStarted() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-5 py-16">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Getting Started
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body max-w-2xl mx-auto">
            Start your space exploration journey in three simple steps. From
            discovery to sharing, we&apos;ve made it effortless.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="group relative bg-card text-card-foreground border rounded-4xl p-6 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute -top-3 -left-3 z-10"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
              >
                <div className="bg-primary text-primary-foreground dark:text-foreground rounded-2xl px-3 py-1.5 text-sm font-bold font-heading border-2 border-background">
                  {step.number}
                </div>
              </motion.div>
              <div className="mb-6 mt-4">
                <motion.div
                  className="rounded-2xl bg-primary/10 text-primary p-4 w-fit group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon className="h-8 w-8" />
                </motion.div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl leading-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.7 + index * 0.2 + featureIndex * 0.1,
                        duration: 0.3,
                      }}
                    >
                      <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-body">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="pt-2">
                  <Link href={step.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Button className="w-full rounded-2xl font-heading dark:text-foreground">
                        {step.cta}
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-border"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                >
                  <motion.div
                    className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.2, duration: 0.3 }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={ctaVariants} className="text-center mt-12">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-body">
              Ready to start your space exploration journey?
            </p>
            <Link href="/apod">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground font-heading rounded-2xl"
                >
                  Begin Exploring
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
