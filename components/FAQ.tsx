"use client";

import {
  HelpCircle,
  ChevronDown,
  Rocket,
  Camera,
  Shield,
  Database,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    {
      category: "General",
      icon: HelpCircle,
      questions: [
        {
          question: "What is NASA Explorer?",
          answer:
            "NASA Explorer is a comprehensive web platform that provides easy access to NASA's open data and APIs. It allows you to explore space imagery, track celestial objects, monitor space weather, and access a vast collection of NASA's media library—all in one beautiful, user-friendly interface.",
        },
        {
          question: "Is NASA Explorer free to use?",
          answer:
            "Yes! NASA Explorer is completely free to use. All NASA data and APIs used in this platform are publicly available and provided by NASA as part of their Open Data initiative. There are no subscription fees, hidden costs, or premium tiers.",
        },
        {
          question: "Do I need an account to use NASA Explorer?",
          answer:
            "No account is required! You can access all features and data without signing up or logging in. Simply navigate to any feature and start exploring space data immediately.",
        },
        {
          question: "Is the data real-time?",
          answer:
            "Yes, most data is updated in real-time or near real-time. The Astronomy Picture of the Day updates daily, Mars Rover photos are added as they're received from Mars, Near-Earth Objects are tracked continuously, and Space Weather data is updated multiple times per day.",
        },
      ],
    },
    {
      category: "Features & Usage",
      icon: Rocket,
      questions: [
        {
          question: "What features are available on NASA Explorer?",
          answer:
            "NASA Explorer offers 7 main features: (1) Astronomy Picture of the Day with daily space imagery, (2) Mars Rover Photos from Curiosity and Perseverance, (3) Near-Earth Objects tracking, (4) Earth Imagery from the EPIC satellite, (5) Space Weather monitoring, (6) Natural Events tracking worldwide, and (7) NASA Image Gallery with thousands of images and videos.",
        },
        {
          question: "How do I search for specific content?",
          answer:
            "Each feature has its own search and filter capabilities. In the Gallery, use the search bar to find images by keywords. For Mars Rover Photos, filter by rover, camera, and date. Near-Earth Objects can be filtered by date range and hazard status. Most features also include date pickers for browsing historical data.",
        },
        {
          question: "Can I download images?",
          answer:
            "Yes! Most images throughout NASA Explorer can be downloaded. Look for the download button or icon on image detail views. High-resolution versions are available when provided by NASA's APIs. Downloaded images are for personal, educational, and non-commercial use.",
        },
        {
          question: "How often is new content added?",
          answer:
            "Content updates vary by feature: APOD updates daily at midnight EST, Mars photos are added as they're transmitted from Mars (usually daily), NEO data updates multiple times per day, Space Weather updates every few hours, and the Image Gallery is continuously updated with new NASA missions and events.",
        },
      ],
    },
    {
      category: "Technical",
      icon: Database,
      questions: [
        {
          question: "Which NASA APIs does this platform use?",
          answer:
            "NASA Explorer integrates 7 official NASA APIs: APOD API for astronomy pictures, Mars Rover Photos API, NeoWs API for near-Earth objects, EPIC API for Earth imagery, DONKI API for space weather, EONET API for natural events, and the NASA Image and Video Library API. All APIs are official NASA services.",
        },
        {
          question: "Do I need an API key?",
          answer:
            "No! NASA Explorer handles all API authentication behind the scenes. You don't need to sign up for NASA API keys or manage any credentials. Just use the platform and we'll take care of the technical details.",
        },
        {
          question: "What technologies power NASA Explorer?",
          answer:
            "NASA Explorer is built with modern web technologies: Next.js 15 for the framework, TypeScript for type safety, Tailwind CSS for styling, Framer Motion for animations, shadcn/ui for components, and NASA's official APIs for data. The platform is fully responsive and optimized for all devices.",
        },
        {
          question: "Is my data private and secure?",
          answer:
            "Absolutely. NASA Explorer doesn't collect, store, or track any personal information. We don't use cookies for tracking, don't require accounts, and don't save your browsing history. All requests go directly to NASA's official APIs. Your privacy is fully protected.",
        },
      ],
    },
    {
      category: "Data & Content",
      icon: Camera,
      questions: [
        {
          question: "Can I use NASA images for my projects?",
          answer:
            "Yes! NASA images and content are generally in the public domain and free to use for educational and informational purposes. However, some images may have restrictions if they include third-party content or NASA logos. Always check the specific image details and NASA's media usage guidelines.",
        },
        {
          question: "Why are some images not loading?",
          answer:
            "Image loading issues can occur due to several reasons: NASA's servers may be temporarily unavailable, your internet connection might be slow, or the specific image URL might have changed. Try refreshing the page or checking back later. If problems persist, the issue is likely on NASA's server side.",
        },
        {
          question: "How accurate is the Near-Earth Object data?",
          answer:
            "NEO data comes directly from NASA's Center for Near-Earth Object Studies (CNEOS) and is highly accurate. It includes professionally calculated orbits, size estimates, and close approach data. However, orbital predictions can be refined as more observations are made.",
        },
        {
          question: "What does 'potentially hazardous' mean for asteroids?",
          answer:
            "An asteroid is classified as 'potentially hazardous' if it's larger than ~140 meters and its orbit brings it within 7.5 million kilometers of Earth. This classification doesn't mean imminent danger—it simply means astronomers monitor these objects more closely. NASA tracks thousands of PHAs, and none currently pose a threat.",
        },
      ],
    },
    {
      category: "Troubleshooting",
      icon: Shield,
      questions: [
        {
          question: "The page is loading slowly. What can I do?",
          answer:
            "Slow loading is usually due to: (1) NASA's API servers being busy during peak times, (2) loading high-resolution images, or (3) your internet connection. Try refreshing the page, switching to a different feature, or waiting a few minutes. The platform includes loading indicators to show progress.",
        },
        {
          question: "Some features aren't working. How do I report issues?",
          answer:
            "If a feature isn't working, first try refreshing the page or clearing your browser cache. Most issues are temporary and related to NASA's API availability. For persistent problems or to report bugs, you can check if NASA's APIs are operational at api.nasa.gov or contact through the platform's support channels.",
        },
        {
          question: "Does NASA Explorer work on mobile devices?",
          answer:
            "Yes! NASA Explorer is fully responsive and optimized for mobile devices, tablets, and desktops. The interface adapts to your screen size, providing an excellent experience on any device. All features, filters, and content are accessible on mobile.",
        },
        {
          question: "Which browsers are supported?",
          answer:
            "NASA Explorer works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, use the latest version of your preferred browser. The platform uses modern web standards and may not function properly on very old browsers (like Internet Explorer).",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: "Documentation",
      description: "Complete guide to all features",
      icon: Database,
      href: "/docs",
    },
    {
      title: "About Us",
      description: "Learn about NASA Explorer",
      icon: HelpCircle,
      href: "/about",
    },
    {
      title: "NASA API Portal",
      description: "Official NASA APIs",
      icon: Zap,
      href: "https://api.nasa.gov",
      external: true,
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
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white/95">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about NASA Explorer
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-5 py-16">
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
            Help Center
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            How can we help you?
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse through our most frequently asked questions
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold">
                  {category.category}
                </h3>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex =
                    faqCategories
                      .slice(0, categoryIndex)
                      .reduce((acc, cat) => acc + cat.questions.length, 0) +
                    faqIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <Card
                      key={faqIndex}
                      className="border-2 hover:border-primary/30 transition-colors overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenIndex(isOpen ? null : globalIndex)
                        }
                        className="w-full text-left"
                      >
                        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <CardTitle className="text-lg font-heading">
                              {faq.question}
                            </CardTitle>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </motion.div>
                          </div>
                        </CardHeader>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-heading font-bold mb-6 text-center">
            Still have questions?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="h-full border-2 hover:border-primary/30 transition-all cursor-pointer group">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-3">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors inline-block">
                            <link.icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {link.title}
                        </CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </a>
                ) : (
                  <Link href={link.href} className="block h-full">
                    <Card className="h-full border-2 hover:border-primary/30 transition-all cursor-pointer group">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-3">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors inline-block">
                            <link.icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {link.title}
                        </CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
