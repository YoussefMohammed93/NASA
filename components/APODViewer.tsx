"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ExternalLink,
  Camera,
  Clock,
  User,
  AlertTriangle,
  Loader2,
  Monitor,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  date: string;
  copyright?: string;
  service_version: string;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const parseDate = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00");
};

const getDateLimits = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date("1995-06-16"); // First APOD
  minDate.setHours(0, 0, 0, 0);
  return { minDate, maxDate: today };
};

export default function APODViewer() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hdMode, setHdMode] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [fullscreenImageLoading, setFullscreenImageLoading] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { minDate, maxDate } = getDateLimits();

  const fetchAPOD = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);

      const dateString = formatDate(date);

      const response = await fetch(`/api/apod?date=${dateString}`, {
        cache: "no-store", // Ensure fresh data on date change
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch APOD: ${response.statusText}`);
      }

      const data: APODData = await response.json();
      setApodData(data);
    } catch (err) {
      console.error("Error fetching APOD:", err);
      setError(err instanceof Error ? err.message : "Failed to load APOD");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsNavVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav only when at the very top (0px), hide when scrolled down
      if (currentScrollY === 0) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [lastScrollY, isMobile]);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));

    if (newDate >= minDate && newDate <= maxDate) {
      setSelectedDate(newDate);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseDate(event.target.value);
    if (newDate >= minDate && newDate <= maxDate) {
      setSelectedDate(newDate);
    }
  };

  const handleShare = async () => {
    if (!apodData) return;

    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleDownload = async () => {
    if (!apodData || apodData.media_type !== "image") return;

    try {
      const imageUrl = hdMode && apodData.hdurl ? apodData.hdurl : apodData.url;
      const fileName = `apod-${apodData.date}-${apodData.title
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}.jpg`;

      toast.success("Preparing download...");

      // Use our server-side proxy to download the image
      const downloadUrl = `/api/download?url=${encodeURIComponent(
        imageUrl
      )}&filename=${encodeURIComponent(fileName)}`;

      // Create a simple download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started! Check your downloads folder.");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed. Please try again.");
    }
  };

  const normalizedSelectedDate = new Date(selectedDate);
  normalizedSelectedDate.setHours(0, 0, 0, 0);

  const canNavigatePrev = normalizedSelectedDate > minDate;
  const canNavigateNext = normalizedSelectedDate < maxDate;

  const handleHdToggle = () => {
    setImageLoading(true);
    setHdMode(!hdMode);
  };

  const handleFullscreenHdToggle = () => {
    setFullscreenImageLoading(true);
    setHdMode(!hdMode);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleFullscreenImageLoad = () => {
    setFullscreenImageLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: isNavVisible ? 0 : -100,
          opacity: isNavVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b"
      >
        <div className="max-w-4xl mx-auto px-5 py-3">
          <div className="flex flex-col gap-5 sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span className="text-sm font-body">
                Astronomy Picture of the Day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                disabled={!canNavigatePrev || loading}
                className="rounded-2xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="relative">
                <input
                  type="date"
                  value={formatDate(selectedDate)}
                  onChange={handleDateChange}
                  min={formatDate(minDate)}
                  max={formatDate(maxDate)}
                  className="px-3 py-1.5 rounded-2xl border border-border bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                disabled={!canNavigateNext || loading}
                className="rounded-2xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      <main className="max-w-4xl mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
              <Skeleton className="aspect-video w-full rounded-4xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto p-8 border rounded-4xl bg-card">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-heading font-semibold mb-2">
                  Failed to Load APOD
                </h2>
                <p className="text-muted-foreground mb-4 font-body">{error}</p>
                <Button
                  onClick={() => fetchAPOD(selectedDate)}
                  className="rounded-2xl"
                >
                  <Loader2 className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : apodData ? (
            <motion.div
              key={`apod-${apodData.date}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground"
                >
                  {apodData.title}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-4 text-muted-foreground flex-wrap"
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-body">
                      {new Date(apodData.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {apodData.copyright && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-body">
                        {apodData.copyright}
                      </span>
                    </div>
                  )}
                  <Badge variant="secondary" className="rounded-full">
                    <Camera className="h-3 w-3 mr-1.5" />
                    {apodData.media_type.charAt(0).toUpperCase() +
                      apodData.media_type.slice(1)}
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                key={`image-${apodData.date}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                {apodData.media_type === "image" ? (
                  <div className="relative aspect-video overflow-hidden rounded-4xl bg-muted">
                    {imageLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 backdrop-blur-sm rounded-4xl">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                          <p className="text-sm text-muted-foreground font-body">
                            Loading {hdMode ? "HD" : "Standard"} image...
                          </p>
                        </div>
                      </div>
                    )}
                    <Image
                      key={`main-${hdMode ? "hd" : "sd"}-${apodData.date}`}
                      src={
                        hdMode && apodData.hdurl ? apodData.hdurl : apodData.url
                      }
                      alt={apodData.title}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover"
                      priority
                      onLoad={handleImageLoad}
                      onError={() => setImageLoading(false)}
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {apodData.hdurl && (
                        <Button
                          size="sm"
                          variant={hdMode ? "default" : "secondary"}
                          onClick={handleHdToggle}
                          disabled={imageLoading}
                          className="rounded-2xl dark:text-foreground"
                        >
                          {imageLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-1" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                          {hdMode ? "HD" : "SD"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsFullscreenOpen(true)}
                        className="rounded-2xl"
                        title="View fullscreen"
                        disabled={imageLoading}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-4xl overflow-hidden">
                    <iframe
                      src={apodData.url}
                      title={apodData.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-4">
                    Explanation
                  </h2>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    {apodData.explanation}
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 justify-center"
              >
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="rounded-2xl"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>

                {apodData.media_type === "image" && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="rounded-2xl"
                  >
                    <Download className="h-4 w-4" />
                    Download {hdMode ? "HD" : "Standard"}
                  </Button>
                )}
                <Button asChild variant="outline" className="rounded-2xl">
                  <a
                    href={apodData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Original
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
      <Footer />
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-fit h-fit p-0 bg-black/95 border-none flex items-center justify-center"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{apodData?.title}</DialogTitle>
          </DialogHeader>
          {apodData && apodData.media_type === "image" && (
            <div className="relative group flex items-center justify-center">
              {fullscreenImageLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-white border-t-transparent"></div>
                    <p className="text-white font-body text-lg">
                      Loading {hdMode ? "HD" : "Standard"} image...
                    </p>
                  </div>
                </div>
              )}
              <Image
                key={`fullscreen-${hdMode ? "hd" : "sd"}-${apodData.date}`}
                src={hdMode && apodData.hdurl ? apodData.hdurl : apodData.url}
                alt={apodData.title}
                width={1920}
                height={1080}
                className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain"
                priority
                onLoad={handleFullscreenImageLoad}
                onError={() => setFullscreenImageLoading(false)}
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {apodData.hdurl && (
                  <Button
                    size="sm"
                    variant={hdMode ? "default" : "secondary"}
                    onClick={handleFullscreenHdToggle}
                    disabled={fullscreenImageLoading}
                    className="rounded-2xl bg-black/50 hover:bg-black/70 text-white border-white/20 disabled:opacity-50"
                  >
                    {fullscreenImageLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1" />
                    ) : (
                      <Monitor className="h-4 w-4 mr-1" />
                    )}
                    {hdMode ? "HD" : "SD"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsFullscreenOpen(false)}
                  className="rounded-2xl bg-black/50 hover:bg-black/70 text-white border-white/20"
                  title="Close fullscreen"
                  disabled={fullscreenImageLoading}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 text-white">
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {apodData.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(apodData.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {apodData.copyright && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>© {apodData.copyright}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
