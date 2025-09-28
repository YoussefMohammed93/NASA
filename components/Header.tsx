"use client";

import {
  Menu,
  Rocket,
  Satellite,
  Globe,
  Camera,
  Telescope,
  Zap,
  Image,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openHoverCard, setOpenHoverCard] = useState<string | null>(null);

  const navigationItems = [
    {
      title: "Explore",
      items: [
        {
          title: "Astronomy Picture of the Day",
          href: "/apod",
          icon: Camera,
          description: "Daily stunning space imagery",
        },
        {
          title: "Mars Rover Photos",
          href: "/mars",
          icon: Rocket,
          description: "Latest images from Mars missions",
        },
        {
          title: "Near Earth Objects",
          href: "/asteroids",
          icon: Satellite,
          description: "Track asteroids and comets",
        },
        {
          title: "Earth Imagery",
          href: "/earth",
          icon: Globe,
          description: "Satellite views of our planet",
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          title: "Space Weather",
          href: "/space-weather",
          icon: Zap,
          description: "Solar activity and space storms",
        },
        {
          title: "Natural Events",
          href: "/natural-events",
          icon: Globe,
          description: "Earth's natural phenomena",
        },
        {
          title: "Image Gallery",
          href: "/gallery",
          icon: Image,
          description: "NASA's media collection",
        },
        {
          title: "Exoplanets",
          href: "/exoplanets",
          icon: Telescope,
          description: "Discover distant worlds",
        },
      ],
    },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-5">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <Rocket className="w-5 h-5 text-primary-foreground dark:text-foreground" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground font-heading">
              NASA Explorer
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block font-body">
              Space Data Portal
            </span>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <HoverCard
                key={item.title}
                onOpenChange={(open) =>
                  setOpenHoverCard(open ? item.title : null)
                }
              >
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm rounded-lg font-medium font-heading hover:text-primary transition-colors px-4 py-2 flex items-center gap-1"
                  >
                    {item.title}
                    {openHoverCard === item.title ? (
                      <ChevronUp className="w-3 h-3 transition-transform" />
                    ) : (
                      <ChevronDown className="w-3 h-3 transition-transform" />
                    )}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-[600px] p-0" align="end">
                  <div className="p-4">
                    <h4 className="font-heading font-semibold text-base mb-3">
                      {item.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.href}
                          className="block select-none space-y-2 rounded-3xl p-3 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group border border-transparent hover:border-border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <subItem.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium font-heading leading-none mb-1">
                                {subItem.title}
                              </div>
                              <div className="text-xs text-muted-foreground font-body leading-snug">
                                {subItem.description}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </nav>
          <div>
            <Link
              href="/about"
              className="text-sm font-medium font-heading hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-accent"
            >
              About
            </Link>
          </div>
          <ThemeToggle />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground font-heading rounded-2xl">
            Start Exploring
          </Button>
        </div>
        {/* Mobile Menu + Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent rounded-lg"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[320px] sm:w-[400px] overflow-auto"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center space-x-3 font-heading">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-primary-foreground dark:text-foreground" />
                  </div>
                  <span>NASA Explorer</span>
                </SheetTitle>
                <SheetDescription className="font-body">
                  Explore the universe with NASA&apos;s data
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6">
                {navigationItems.map((item) => (
                  <div key={item.title} className="space-y-3">
                    <h3 className="font-semibold text-base text-foreground border-b pb-2 pl-5 font-heading">
                      {item.title}
                    </h3>
                    <div className="space-y-2 px-2">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.href}
                          className="flex items-start space-x-3 p-3 rounded-3xl hover:bg-accent transition-colors group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mt-0.5">
                            <subItem.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium font-heading">
                              {subItem.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 leading-relaxed font-body">
                              {subItem.description}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="px-2 border-t pt-4">
                  <Link
                    href="/about"
                    className="flex items-center p-3 rounded-2xl hover:bg-accent transition-colors font-heading text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    About NASA Explorer
                  </Link>
                </div>
                <div className="p-3">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground rounded-xl shadow-lg font-heading">
                    Start Exploring
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
