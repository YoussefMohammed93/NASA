"use client";

import {
  Rocket,
  Globe,
  Satellite,
  ArrowRight,
  Play,
  Star,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Hero = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden bg-background"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-5 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="my-8">
            <div className="inline-flex items-center bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold transition-colors font-body">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
              Powered by Official NASA Data
            </div>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight font-heading"
          >
            Explore the <span className="text-primary">Universe</span>
            <br />
            with NASA Data
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed font-body"
          >
            Discover live Mars rover images, track near-Earth asteroids, and
            enjoy daily astronomy pictures. An interactive journey through space
            with the latest data from NASA.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="w-full sm:w-[200px] text-primary-foreground dark:text-foreground rounded-2xl"
            >
              Start Exploring
              <ArrowRight className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-[200px] rounded-2xl"
            >
              Watch Demo
              <Play className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pb-14"
          >
            {[
              { number: "50K+", label: "Space Images", icon: Camera },
              { number: "1000+", label: "Tracked Asteroids", icon: Satellite },
              { number: "24/7", label: "Live Data", icon: Globe },
              { number: "15+", label: "Space Missions", icon: Rocket },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary backdrop-blur-sm flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 font-heading">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-body">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
