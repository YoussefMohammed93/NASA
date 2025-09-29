"use client";

import {
  FileText,
  Scale,
  AlertTriangle,
  Image as ImageIcon,
  Shield,
  Ban,
  CheckCircle,
  ExternalLink,
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

const Terms = () => {
  const lastUpdated = "January 2025";

  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: [
        {
          text: "By accessing and using NASA Explorer, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.",
        },
        {
          text: "NASA Explorer is provided as a free educational and informational service. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice.",
        },
        {
          text: "These terms constitute a legally binding agreement between you and NASA Explorer. Continued use of the platform after changes to these terms constitutes acceptance of the modified terms.",
        },
      ],
    },
    {
      icon: Info,
      title: "Use of Service",
      content: [
        {
          subtitle: "Permitted Use",
          text: "NASA Explorer is provided for personal, educational, and non-commercial use. You may browse space data, view images, and explore NASA's APIs through our interface.",
        },
        {
          subtitle: "Free Access",
          text: "The service is provided free of charge. We do not require registration, accounts, or payment of any kind to access our features.",
        },
        {
          subtitle: "Fair Use",
          text: "You agree to use the service in a reasonable manner that does not overload NASA's servers or our infrastructure. Automated scraping or bulk downloading is prohibited without prior permission.",
        },
      ],
    },
    {
      icon: ImageIcon,
      title: "NASA Content & Copyright",
      content: [
        {
          subtitle: "NASA's Public Domain",
          text: "Most NASA content (images, videos, audio) is in the public domain and free to use for educational and informational purposes. However, some content may have usage restrictions.",
        },
        {
          subtitle: "Attribution",
          text: "While not always required, we encourage users to credit NASA and the specific mission or instrument when using NASA imagery and data.",
        },
        {
          subtitle: "Third-Party Content",
          text: "Some images may include copyrighted material from third parties, NASA contractors, or international partners. Users are responsible for determining usage rights before redistribution.",
        },
        {
          subtitle: "NASA Insignia",
          text: "The NASA logo, insignia, and emblems are protected by law and may not be used without permission. NASA Explorer does not grant rights to use NASA trademarks.",
        },
      ],
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "No Harmful Use",
          text: "You may not use NASA Explorer for any unlawful purpose or to transmit harmful code, viruses, or malicious software.",
        },
        {
          subtitle: "No Unauthorized Access",
          text: "You may not attempt to gain unauthorized access to our systems, servers, or networks. Any security testing must be approved in advance.",
        },
        {
          subtitle: "No Commercial Exploitation",
          text: "You may not resell, redistribute, or commercially exploit the service without written permission. This includes creating derivative services that replicate our functionality.",
        },
        {
          subtitle: "No API Abuse",
          text: "You may not abuse NASA's APIs through excessive requests, automated scraping, or any activity that degrades service performance.",
        },
      ],
    },
    {
      icon: AlertTriangle,
      title: "Disclaimers & Limitations",
      content: [
        {
          subtitle: "No Warranty",
          text: "NASA Explorer is provided 'as is' without warranties of any kind, either express or implied. We do not guarantee accuracy, completeness, or reliability of any content.",
        },
        {
          subtitle: "Data Accuracy",
          text: "While we strive for accuracy, space data may contain errors or be outdated. NASA Explorer is not responsible for decisions made based on information from our platform.",
        },
        {
          subtitle: "Third-Party APIs",
          text: "Our platform relies on NASA's official APIs. We are not responsible for API downtime, data errors, or changes to NASA's services.",
        },
        {
          subtitle: "Limitation of Liability",
          text: "NASA Explorer shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Our Content",
          text: "The design, code, layout, and original content of NASA Explorer are protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our platform's code without permission.",
        },
        {
          subtitle: "NASA APIs",
          text: "NASA's APIs and data are subject to NASA's terms of service. By using NASA Explorer, you agree to comply with NASA's API usage policies.",
        },
        {
          subtitle: "Open Source",
          text: "Portions of NASA Explorer may use open-source software. Such components are governed by their respective licenses.",
        },
      ],
    },
    {
      icon: ExternalLink,
      title: "External Links",
      content: [
        {
          text: "NASA Explorer contains links to external websites including NASA.gov and other space-related resources. We are not responsible for the content, privacy practices, or terms of service of external sites.",
        },
        {
          text: "Links to external sites do not constitute an endorsement or recommendation. Users access external links at their own risk.",
        },
      ],
    },
    {
      icon: Scale,
      title: "Governing Law",
      content: [
        {
          text: "These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through good faith negotiation.",
        },
        {
          text: "If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
        },
      ],
    },
  ];

  const quickFacts = [
    {
      icon: CheckCircle,
      title: "Free to Use",
      description: "No registration or payment required",
    },
    {
      icon: CheckCircle,
      title: "Educational Focus",
      description: "Built for learning and exploration",
    },
    {
      icon: CheckCircle,
      title: "No Warranties",
      description: "Provided 'as is' without guarantees",
    },
    {
      icon: CheckCircle,
      title: "Fair Use",
      description: "Use responsibly and ethically",
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
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white/95">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Guidelines for using NASA Explorer responsibly
            </p>
            <Badge className="bg-white/20 text-white border-white/30">
              Last Updated: {lastUpdated}
            </Badge>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-5 py-16">
        {/* Quick Facts */}
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
              Quick Summary
            </Badge>
            <h2 className="text-3xl font-heading font-bold mb-3">
              Terms at a Glance
            </h2>
            <p className="text-muted-foreground">
              Key points about using NASA Explorer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickFacts.map((fact, index) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-1">
                        <fact.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold mb-1">
                          {fact.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {fact.description}
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
                      {"subtitle" in item && item.subtitle && (
                        <h4 className="font-heading font-semibold text-lg">
                          {item.subtitle}
                        </h4>
                      )}
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

        {/* Changes to Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Changes to These Terms</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                We reserve the right to modify these Terms of Service at any
                time. Changes will be posted on this page with an updated
                &quot;Last Updated&quot; date. Continued use of NASA Explorer
                after changes constitutes acceptance of the modified terms. We
                encourage you to review these terms periodically.
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
                    Questions About These Terms?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about these Terms of Service or
                    need clarification, please check our FAQ or reach out.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="dark:text-foreground">
                      <Link href="/faq">
                        <Info className="h-4 w-4" />
                        View FAQ
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/privacy">Privacy Policy</Link>
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

export default Terms;
