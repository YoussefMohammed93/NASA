"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Rocket, Github, Twitter, Mail, ExternalLink } from "lucide-react";

const footerSections = [
  {
    title: "Explore",
    links: [
      { name: "Astronomy Picture of the Day", href: "/apod" },
      { name: "Mars Rover Photos", href: "/mars" },
      { name: "Near Earth Objects", href: "/neo" },
      { name: "Earth Imagery", href: "/earth" },
    ],
  },
  {
    title: "Data & Tools",
    links: [
      { name: "Space Weather", href: "/space-weather" },
      { name: "Natural Events", href: "/natural-events" },
      { name: "Image Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "FAQ", href: "/faq" },
      { name: "About NASA Explorer", href: "/about" },
    ],
  },
] as const;

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/nasa-explorer",
    icon: Github,
    hoverColor: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/nasa_explorer",
    icon: Twitter,
    hoverColor: "hover:text-blue-500",
  },
  {
    name: "Email",
    href: "mailto:hello@nasa-explorer.com",
    icon: Mail,
    hoverColor: "hover:text-red-500",
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

const sectionVariants: Variants = {
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

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function Footer() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.footer
      ref={ref}
      className="relative m-5 rounded-4xl bg-gray-900 dark:bg-foreground text-white dark:text-gray-900"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Rocket className="w-5 h-5 text-primary-foreground dark:text-foreground" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-heading">
                    NASA Explorer
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-600 font-body">
                    Space Data Portal
                  </span>
                </div>
              </Link>
              <p className="text-sm text-gray-400 dark:text-gray-600 font-body leading-relaxed">
                Explore the universe with NASA&apos;s official data. From Mars
                rover photos to astronomy images, discover space like never
                before.
              </p>
              <motion.div
                variants={socialVariants}
                className="flex items-center space-x-3"
              >
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={social.href}
                      className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200"
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <social.icon className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={sectionVariants}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-white dark:text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.1 + linkIndex * 0.05,
                      duration: 0.3,
                    }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors font-body"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-800 dark:border-gray-300 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-600 font-body">
              <div className="flex items-center gap-1">
                <span>© {new Date().getFullYear()} NASA Explorer.</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="https://api.nasa.gov"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Powered by NASA Open Data</span>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
