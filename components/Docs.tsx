"use client";

import {
  BookOpen,
  Camera,
  Rocket,
  Satellite,
  Globe,
  Zap,
  Image as ImageIcon,
  Code,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  Info,
  Lightbulb,
  Star,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
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

const Docs = () => {
  const features = [
    {
      id: "apod",
      icon: Camera,
      title: "Astronomy Picture of the Day",
      description:
        "Discover stunning daily space imagery with expert explanations.",
      link: "/apod",
      tips: [
        "View high-resolution images from across the universe",
        "Read detailed explanations from professional astronomers",
        "Browse previous APODs using the date picker",
        "Download images for personal use",
        "Share your favorite space photos",
      ],
    },
    {
      id: "mars",
      icon: Rocket,
      title: "Mars Rover Photos",
      description:
        "Explore the Red Planet through Curiosity and Perseverance rovers.",
      link: "/mars",
      tips: [
        "Browse latest images from active Mars missions",
        "Filter by rover, camera type, and Martian sol",
        "View detailed metadata for each photo",
        "Compare images from different cameras",
        "Track rover exploration progress",
      ],
    },
    {
      id: "neo",
      icon: Satellite,
      title: "Near-Earth Objects",
      description: "Track asteroids and comets approaching our planet.",
      link: "/neo",
      tips: [
        "View potentially hazardous asteroids",
        "Filter by date range and hazard status",
        "See detailed orbital information",
        "Track closest approaches to Earth",
        "Monitor real-time asteroid data",
      ],
    },
    {
      id: "earth",
      icon: Globe,
      title: "Earth Imagery",
      description: "View our planet from space with NASA's EPIC satellite.",
      link: "/earth",
      tips: [
        "See Earth from 1 million miles away",
        "Browse images by date",
        "View different atmospheric conditions",
        "Watch Earth's rotation in image sequences",
        "Download high-resolution Earth photos",
      ],
    },
    {
      id: "space-weather",
      icon: Zap,
      title: "Space Weather",
      description: "Monitor solar activity and geomagnetic storms.",
      link: "/space-weather",
      tips: [
        "Track solar flares and CMEs in real-time",
        "View geomagnetic storm forecasts",
        "Monitor solar wind conditions",
        "Check radiation levels",
        "Get alerts for significant space weather events",
      ],
    },
    {
      id: "natural-events",
      icon: Globe,
      title: "Natural Events",
      description:
        "Track global natural phenomena through NASA's EONET system.",
      link: "/natural-events",
      tips: [
        "Monitor wildfires, storms, and volcanic activity",
        "Filter by event category and status",
        "View event locations on interactive cards",
        "Load more events with pagination",
        "Access detailed source information",
      ],
    },
    {
      id: "gallery",
      icon: ImageIcon,
      title: "Image Gallery",
      description: "Browse NASA's vast collection of space imagery.",
      link: "/gallery",
      tips: [
        "Search NASA's entire image library",
        "Filter by NASA center and year",
        "View images in beautiful masonry layout",
        "Load more images with infinite scroll",
        "Download high-resolution versions",
      ],
    },
  ];

  const quickStart = [
    {
      step: 1,
      title: "Choose a Feature",
      description:
        "Navigate to any feature using the header menu or home page cards.",
      icon: Search,
    },
    {
      step: 2,
      title: "Apply Filters",
      description:
        "Use filters to narrow down data by date, category, or other criteria.",
      icon: Filter,
    },
    {
      step: 3,
      title: "Explore Content",
      description: "Click on items to view detailed information and images.",
      icon: Info,
    },
    {
      step: 4,
      title: "Download & Share",
      description: "Download images or share links to interesting discoveries.",
      icon: Download,
    },
  ];

  const apiInfo = [
    {
      name: "NASA APOD API",
      description: "Astronomy Picture of the Day",
      endpoint: "https://api.nasa.gov/planetary/apod",
    },
    {
      name: "Mars Rover Photos API",
      description: "Images from Mars rovers",
      endpoint: "https://api.nasa.gov/mars-photos/api/v1",
    },
    {
      name: "NeoWs API",
      description: "Near Earth Object Web Service",
      endpoint: "https://api.nasa.gov/neo/rest/v1",
    },
    {
      name: "EPIC API",
      description: "Earth Polychromatic Imaging Camera",
      endpoint: "https://api.nasa.gov/EPIC/api",
    },
    {
      name: "DONKI API",
      description: "Space Weather Database",
      endpoint: "https://api.nasa.gov/DONKI",
    },
    {
      name: "EONET API",
      description: "Earth Observatory Natural Event Tracker",
      endpoint: "https://eonet.gsfc.nasa.gov/api/v3",
    },
    {
      name: "NASA Images API",
      description: "NASA Image and Video Library",
      endpoint: "https://images-api.nasa.gov",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80">
        <div className="relative max-w-7xl mx-auto px-5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white/95">
              Documentation
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about using NASA Explorer to explore
              space data
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-7xl mx-auto px-5 py-16">
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
            Getting Started
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Quick Start Guide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to start exploring space data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickStart.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full text-center border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto">
                        <item.icon className="h-8 w-8 text-primary-foreground dark:text-foreground" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Documentation */}
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
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Feature Documentation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detailed guides for each feature in NASA Explorer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-primary-foreground dark:text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between mb-2">
                        <CardTitle className="text-2xl">
                          {feature.title}
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={feature.link}>
                            <ChevronRight className="h-4 w-4" />
                            Open Feature
                          </Link>
                        </Button>
                      </div>
                      <CardDescription className="text-base mb-4">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">
                        Tips & Features:
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {feature.tips.map((tip, tipIndex) => (
                        <li
                          key={tipIndex}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* API Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 mt-20"
        >
          <Badge
            className="mb-4 dark:bg-secondary dark:border-secondary"
            variant="outline"
          >
            Technical Details
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            NASA APIs Used
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            NASA Explorer is powered by official NASA Open APIs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apiInfo.map((api, index) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg mb-1">{api.name}</CardTitle>
                      <CardDescription>{api.description}</CardDescription>
                    </div>
                    <Code className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs bg-muted rounded p-2 font-mono">
                    <span className="truncate flex-1">{api.endpoint}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        window.open(
                          api.endpoint,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2">
                    Need More Help?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Visit NASA&apos;s official API documentation for detailed
                    technical specifications and usage guidelines.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="dark:text-foreground">
                      <Link
                        href="https://api.nasa.gov"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        NASA API Portal
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/about">
                        <Info className="h-4 w-4" />
                        About NASA Explorer
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;
