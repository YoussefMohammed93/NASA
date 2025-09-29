"use client";

import {
  Rocket,
  Globe,
  Telescope,
  Satellite,
  Camera,
  Zap,
  Target,
  Heart,
  Code,
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const About = () => {
  const features = [
    {
      icon: Rocket,
      title: "Astronomy Picture of the Day",
      description: "Explore stunning daily images from across the universe",
      color: "from-blue-500 to-cyan-500",
      href: "/apod",
    },
    {
      icon: Globe,
      title: "Earth Imagery",
      description: "View our planet from space with EPIC satellite data",
      color: "from-green-500 to-emerald-500",
      href: "/earth",
    },
    {
      icon: Telescope,
      title: "Near-Earth Objects",
      description: "Track asteroids and comets approaching Earth",
      color: "from-orange-500 to-red-500",
      href: "/neo",
    },
    {
      icon: Satellite,
      title: "Mars Rover Photos",
      description: "Latest images from Curiosity and Perseverance rovers",
      color: "from-red-500 to-pink-500",
      href: "/mars",
    },
    {
      icon: Zap,
      title: "Space Weather",
      description: "Monitor solar activity and geomagnetic storms",
      color: "from-yellow-500 to-orange-500",
      href: "/space-weather",
    },
    {
      icon: Camera,
      title: "Image Gallery",
      description: "Browse NASA's vast collection of space imagery",
      color: "from-purple-500 to-pink-500",
      href: "/gallery",
    },
  ];

  const stats = [
    { label: "NASA APIs", value: "6+", icon: Code },
    { label: "Data Sources", value: "10+", icon: Satellite },
    { label: "Daily Updates", value: "24/7", icon: TrendingUp },
    { label: "Free Access", value: "100%", icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission",
      description:
        "To make space exploration data accessible, engaging, and educational for everyone through intuitive interfaces and real-time information.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Leveraging cutting-edge web technologies to create seamless experiences that bring the wonders of space to your fingertips.",
    },
    {
      icon: BookOpen,
      title: "Education",
      description:
        "Inspiring curiosity and learning by providing easy access to NASA's incredible wealth of space exploration data and imagery.",
    },
    {
      icon: Shield,
      title: "Reliability",
      description:
        "Built with modern architecture ensuring fast, secure, and dependable access to space data whenever you need it.",
    },
  ];

  const technologies = [
    {
      name: "Next.js 15",
      icon: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
    },
    {
      name: "TypeScript",
      icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
    },
    {
      name: "Tailwind CSS",
      icon: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg",
    },
    {
      name: "Framer Motion",
      icon: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
    },
    {
      name: "NASA APIs",
      icon: "https://cdn.worldvectorlogo.com/logos/nasa-6.svg",
    },
    {
      name: "shadcn/ui",
      icon: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
      <Header />

      {/* Hero Section - Unique Diagonal Design */}
      <div className="relative overflow-hidden">
        {/* Diagonal Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 transform -skew-y-6 origin-top-left" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl" />
                <div className="relative p-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Rocket className="h-16 w-16 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
                  Exploring the Universe Together
                </Badge>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white/95">
                About NASA Explorer
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Your gateway to the cosmos, powered by NASA&apos;s open data and
                modern web technology
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button size="lg" variant="outline" asChild>
                <Link href="/gallery">
                  <Camera className="h-5 w-5" />
                  View Gallery
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Star className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <Sparkles className="h-12 w-12 text-primary dark:text-foreground" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:border-primary/30 transition-colors duration-200 border-2">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mission & Values Section */}
      <div className="max-w-7xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-4 dark:bg-secondary dark:border-secondary"
            variant="outline"
          >
            Our Purpose
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Mission & Values
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Driven by passion for space exploration and commitment to making
            knowledge accessible
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary">
                      <value.icon className="h-6 w-6 text-primary-foreground dark:text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {value.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/5 dark:to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              className="mb-4 dark:bg-secondary dark:border-secondary"
              variant="outline"
            >
              Explore Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six powerful tools to explore space data, imagery, and real-time
              information
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <Card className="h-full group transition-all duration-300 cursor-pointer border-2 hover:border-primary/30">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="h-4 w-4 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-7xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge
            className="mb-4 dark:bg-secondary dark:border-secondary"
            variant="outline"
          >
            Built With
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Modern Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by the latest web technologies for optimal performance and
            user experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-2">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="mb-3 flex justify-center">
                      <div className="relative w-16 h-16">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          fill
                          className={`object-contain ${
                            tech.name === "Next.js 15" ||
                            tech.name === "shadcn/ui"
                              ? "dark:invert"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium">{tech.name}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
