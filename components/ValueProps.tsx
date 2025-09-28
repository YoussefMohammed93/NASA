"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, Zap, Globe, Code, CheckCircle, Rocket } from "lucide-react";

const benefits = [
  {
    title: "Official NASA Data",
    description:
      "Direct access to authentic space data from NASA's public APIs with real-time updates.",
    icon: Shield,
    highlight: "Verified & Trusted",
  },
  {
    title: "Lightning Fast",
    description:
      "Optimized performance with smart caching and modern web technologies for instant results.",
    icon: Zap,
    highlight: "Sub-second Loading",
  },
  {
    title: "Always Accessible",
    description:
      "Designed for everyone with screen reader support, keyboard navigation, and responsive design.",
    icon: Globe,
    highlight: "WCAG Compliant",
  },
  {
    title: "Open Source",
    description:
      "Built transparently with modern React, Next.js, and open APIs. Contribute on GitHub.",
    icon: Code,
    highlight: "MIT Licensed",
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
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
  hidden: { opacity: 0, y: 35, scale: 0.95 },
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

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.8,
    },
  },
};

export default function ValueProps() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      className="w-full bg-muted/35"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-5 py-16">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Why NASA Explorer?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body max-w-2xl mx-auto">
            The most reliable and user-friendly way to explore NASA&apos;s vast
            collection of space data and imagery.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              className="group relative bg-card text-card-foreground border rounded-4xl p-6 hover:bg-accent hover:text-accent-foreground transition-colors"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4">
                <motion.div
                  className="rounded-2xl bg-primary/10 text-primary p-3 w-fit group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <benefit.icon className="h-6 w-6" />
                </motion.div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg leading-tight">
                    {benefit.title}
                  </h3>
                  <motion.div
                    className="flex items-center gap-1.5 mt-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground font-body">
                      {benefit.highlight}
                    </span>
                  </motion.div>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              <motion.div
                className="absolute top-4 right-4 opacity-30 dark:opacity-50 dark:group-hover:opacity-80 group-hover:opacity-50 transition-opacity"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.2, opacity: 0.8 }}
              >
                <span className="text-2xl font-bold font-heading">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={badgeVariants} className="text-center mt-12">
          <motion.div
            className="inline-flex items-center gap-2 border border-border bg-primary/10 dark:bg-secondary text-primary dark:text-foreground px-4 py-2 rounded-full text-sm font-medium font-body"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="h-4 w-4" />
            </motion.div>
            <span>Ready to explore the universe?</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
