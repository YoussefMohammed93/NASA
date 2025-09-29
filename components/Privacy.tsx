"use client";

import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  ExternalLink,
  CheckCircle,
  Info,
  Mail,
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

const Privacy = () => {
  const lastUpdated = "January 2025";

  const sections = [
    {
      icon: Info,
      title: "Information We Collect",
      content: [
        {
          subtitle: "No Personal Data Collection",
          text: "NASA Explorer does not collect, store, or process any personal information. We don't require user accounts, registrations, or login credentials.",
        },
        {
          subtitle: "No Tracking",
          text: "We do not use cookies, analytics, or any tracking technologies to monitor your browsing behavior. Your exploration of space data is completely private.",
        },
        {
          subtitle: "Technical Data",
          text: "Standard web server logs may temporarily record your IP address, browser type, and pages visited. This data is not linked to your identity and is automatically deleted.",
        },
      ],
    },
    {
      icon: Database,
      title: "How We Use Data",
      content: [
        {
          subtitle: "NASA API Requests",
          text: "When you use NASA Explorer, your browser makes direct requests to NASA's official APIs. We act as a bridge to display this data in a user-friendly interface.",
        },
        {
          subtitle: "Local Storage",
          text: "Some features may use your browser's local storage to save preferences (like theme settings). This data never leaves your device and can be cleared anytime.",
        },
        {
          subtitle: "No Third-Party Sharing",
          text: "We never share, sell, or transfer any data to third parties. There are no advertisers, marketers, or data brokers involved.",
        },
      ],
    },
    {
      icon: Cookie,
      title: "Cookies & Storage",
      content: [
        {
          subtitle: "Essential Cookies Only",
          text: "NASA Explorer may use essential cookies required for basic functionality (like remembering your dark mode preference). We don't use tracking or advertising cookies.",
        },
        {
          subtitle: "Browser Storage",
          text: "Your browser's localStorage may be used to save user preferences locally. This data is stored on your device only and is not transmitted to any server.",
        },
        {
          subtitle: "Opt-Out",
          text: "You can clear all stored data by clearing your browser's cache and local storage at any time.",
        },
      ],
    },
    {
      icon: ExternalLink,
      title: "Third-Party Services",
      content: [
        {
          subtitle: "NASA APIs",
          text: "NASA Explorer uses official NASA APIs to fetch space data and imagery. When you use our platform, requests are sent to NASA's servers. Please refer to NASA's privacy policy for their data practices.",
        },
        {
          subtitle: "External Links",
          text: "Our platform may contain links to external websites (like NASA.gov). We are not responsible for the privacy practices of these external sites.",
        },
        {
          subtitle: "Image Hosting",
          text: "Images are served directly from NASA's servers. We do not host or cache NASA imagery on our servers.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        {
          subtitle: "HTTPS Encryption",
          text: "All connections to NASA Explorer are encrypted using HTTPS protocol to protect data in transit.",
        },
        {
          subtitle: "No Data Storage",
          text: "Since we don't collect personal data, there's no personal information to be compromised in the event of a security breach.",
        },
        {
          subtitle: "Regular Updates",
          text: "We keep our platform updated with the latest security patches and best practices to ensure your safety.",
        },
      ],
    },
    {
      icon: Eye,
      title: "Your Rights",
      content: [
        {
          subtitle: "Right to Privacy",
          text: "You have the right to browse NASA Explorer anonymously without providing any personal information.",
        },
        {
          subtitle: "Data Control",
          text: "Since we don't collect your data, there's nothing to request, delete, or modify. You maintain complete control over your privacy.",
        },
        {
          subtitle: "Transparency",
          text: "This privacy policy is our commitment to being transparent about our data practices (or lack thereof).",
        },
      ],
    },
  ];

  const highlights = [
    {
      icon: CheckCircle,
      title: "No Account Required",
      description: "Browse freely without registration",
    },
    {
      icon: CheckCircle,
      title: "No Tracking",
      description: "We don't monitor your behavior",
    },
    {
      icon: CheckCircle,
      title: "No Data Collection",
      description: "Your information stays with you",
    },
    {
      icon: CheckCircle,
      title: "Fully Transparent",
      description: "Clear about what we do and don't do",
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
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white/95">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your privacy matters. Learn how we protect it.
            </p>
            <Badge className="bg-white/20 text-white border-white/30">
              Last Updated: {lastUpdated}
            </Badge>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-5 py-16">
        {/* Privacy Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <Badge
              className="mb-4 dark:bg-secondary dark:border-secondary"
              variant="outline"
            >
              Key Highlights
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-3">
              Privacy First Approach
            </h2>
            <p className="text-muted-foreground">
              NASA Explorer is built with your privacy as the top priority
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10 mt-1">
                        <highlight.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-1">
                          {highlight.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.05 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {section.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <h4 className="font-heading font-semibold text-lg">
                        {item.subtitle}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Children's Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    Children&apos;s Privacy
                  </CardTitle>
                  <CardDescription>
                    NASA Explorer is safe for users of all ages. Since we
                    don&apos;t collect any personal information, there is no
                    risk to children&apos;s privacy. Parents can feel confident
                    letting their children explore space data on our platform.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Changes to Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">
                Changes to This Privacy Policy
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                We may update this privacy policy from time to time to reflect
                changes in our practices or legal requirements. Any changes will
                be posted on this page with an updated &quot;Last Updated&quot;
                date. We encourage you to review this policy periodically.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="border-2 border-primary/30">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2">
                    Questions About Privacy?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this privacy policy or our
                    data practices, please don&apos;t hesitate to reach out.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="dark:text-foreground">
                      <Link href="/faq">
                        <Info className="h-4 w-4" />
                        View FAQ
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/about">Learn More About Us</Link>
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

export default Privacy;
