"use client";

import Link from "next/link";
import { Rocket, Github, Twitter, Mail, ExternalLink } from "lucide-react";

const footerSections = [
  {
    title: "Explore",
    links: [
      { name: "Astronomy Picture of the Day", href: "/apod" },
      { name: "Mars Rover Photos", href: "/mars" },
      { name: "Near Earth Objects", href: "/asteroids" },
      { name: "Earth Imagery", href: "/earth" },
    ],
  },
  {
    title: "Data & Tools",
    links: [
      { name: "Space Weather", href: "/space-weather" },
      { name: "Image Gallery", href: "/gallery" },
      { name: "Exoplanets", href: "/exoplanets" },
      { name: "API Documentation", href: "/docs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "About NASA Explorer", href: "/about" },
      { name: "Getting Started Guide", href: "/guide" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact Support", href: "/support" },
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

export default function Footer() {
  return (
    <footer className="relative m-5 rounded-4xl bg-gray-900 dark:bg-foreground text-white dark:text-gray-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary-foreground dark:text-foreground" />
                </div>
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
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-white dark:text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors font-body"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 dark:border-gray-300 mt-12 pt-8">
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
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
