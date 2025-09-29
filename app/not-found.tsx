"use client";

import {
  Rocket,
  Home,
  Search,
  Compass,
  Star,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  const quickLinks = [
    {
      title: "Home",
      description: "Return to main page",
      icon: Home,
      href: "/",
    },
    {
      title: "Explore APOD",
      description: "Daily space imagery",
      icon: Star,
      href: "/apod",
    },
    {
      title: "Mars Rovers",
      description: "Latest Mars photos",
      icon: Rocket,
      href: "/mars",
    },
    {
      title: "Image Gallery",
      description: "Browse NASA media",
      icon: Search,
      href: "/gallery",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
      <Header />

      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-4xl w-full">
          {/* Main 404 Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Animated Astronaut/Rocket */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mb-8 flex justify-center"
            >
              <div className="relative">
                {/* Floating stars around */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -left-8"
                >
                  <Star
                    className="h-6 w-6 text-yellow-500"
                    fill="currentColor"
                  />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -top-4 -right-12"
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-6 -left-10"
                >
                  <Star className="h-5 w-5 text-blue-400" fill="currentColor" />
                </motion.div>

                {/* Main Rocket Icon */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl">
                  <Rocket className="h-16 w-16 text-white" />
                </div>
              </div>
            </motion.div>

            {/* 404 Number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-8xl md:text-9xl font-heading font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4 mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                Lost in Space
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Houston, we have a problem! The page you&apos;re looking for has
                drifted off into the cosmic void.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" asChild className="dark:text-foreground">
                <Link href="/">
                  <Home className="h-5 w-5" />
                  Return Home
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gallery">
                  <Compass className="h-5 w-5" />
                  Explore Gallery
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-semibold mb-2">
                Where would you like to go?
              </h3>
              <p className="text-muted-foreground">
                Navigate back to explore NASA&apos;s data and imagery
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                >
                  <Link href={link.href} className="block h-full">
                    <Card className="h-full border-2 hover:border-primary/30 transition-all cursor-pointer group hover:shadow-lg">
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold mb-1">
                      Still can&apos;t find what you&apos;re looking for?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Check our FAQ or documentation for more help navigating
                      the platform.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/faq">View FAQ</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/docs">Documentation</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/about">About</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
