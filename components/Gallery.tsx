"use client";

import {
  Search,
  Camera,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  Loader2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Image as ImageIcon,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

// Types
interface GalleryImage {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  center: string;
  keywords: string[];
  photographer: string;
  location: string;
  thumbnailUrl: string;
  originalUrl: string;
  mediaType: string;
}

interface GalleryResponse {
  images: GalleryImage[];
  totalHits: number;
  hasMore: boolean;
  page: number;
}

const Gallery = () => {
  const [, setAllImages] = useState<GalleryImage[]>([]);
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("space");
  const [selectedCenter, setSelectedCenter] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // NASA Centers
  const nasaCenters = [
    { value: "all", label: "All Centers" },
    { value: "JPL", label: "JPL" },
    { value: "GSFC", label: "Goddard" },
    { value: "JSC", label: "Johnson" },
    { value: "KSC", label: "Kennedy" },
    { value: "MSFC", label: "Marshall" },
    { value: "ARC", label: "Ames" },
    { value: "GRC", label: "Glenn" },
  ];

  const yearOptions = [
    { value: "all", label: "All Years" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
  ];

  const fetchImages = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams({
          q: searchQuery || "space",
          page: page.toString(),
          media_type: "image",
        });

        if (selectedCenter !== "all") {
          params.append("center", selectedCenter);
        }

        if (selectedYear !== "all") {
          params.append("year_start", selectedYear);
          params.append("year_end", selectedYear);
        }

        const response = await fetch(`/api/gallery/search?${params}`);
        if (!response.ok) throw new Error("Failed to fetch gallery data");

        const data: GalleryResponse = await response.json();

        if (append) {
          setAllImages((prev) => [...prev, ...data.images]);
          setDisplayedImages((prev) => [...prev, ...data.images]);
        } else {
          setAllImages(data.images);
          setDisplayedImages(data.images);
          setCurrentPage(1);
        }

        setTotalHits(data.totalHits);
        setHasMore(data.hasMore);
        setCurrentPage(page);

        if (data.images.length === 0 && page === 1) {
          toast.info("No images found for the selected criteria");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load gallery images");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedCenter, selectedYear]
  );

  const loadMoreImages = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchImages(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loadingMore, fetchImages]);

  useEffect(() => {
    fetchImages(1, false);
  }, [searchQuery, selectedCenter, selectedYear, fetchImages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mosaic layout helper - creates varied heights for visual interest
  const getMosaicHeight = (index: number) => {
    const patterns = [
      "h-64",
      "h-80",
      "h-72",
      "h-64",
      "h-96",
      "h-64",
      "h-72",
      "h-64",
      "h-80",
      "h-64",
      "h-88",
      "h-64",
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/10 dark:via-purple-950/10 dark:to-indigo-950/10">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-500/20 dark:via-purple-600/15 dark:to-indigo-700/10" />
        <div className="relative max-w-7xl mx-auto px-5 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-4 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Camera className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white/95">
              NASA Image Gallery
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Explore the universe through NASA&apos;s lens - from Earth&apos;s
              beauty to the depths of space
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search NASA images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/70 dark:bg-gray-800/70"
                  />
                </div>

                {/* Center Filter */}
                <Select
                  value={selectedCenter}
                  onValueChange={setSelectedCenter}
                >
                  <SelectTrigger className="bg-white/70 dark:bg-gray-800/70">
                    <SelectValue placeholder="NASA Center" />
                  </SelectTrigger>
                  <SelectContent>
                    {nasaCenters.map((center) => (
                      <SelectItem key={center.value} value={center.value}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {center.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year Filter */}
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white/70 dark:bg-gray-800/70">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {year.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200/50 dark:border-pink-500/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    NASA Image Collection
                  </CardTitle>
                  <CardDescription className="pt-2">
                    Discover breathtaking imagery from NASA&apos;s missions and
                    research
                  </CardDescription>
                </div>
                {totalHits > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>
                      Showing {displayedImages.length} of{" "}
                      {totalHits.toLocaleString()} images
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="break-inside-avoid">
                    <Card className="overflow-hidden">
                      <Skeleton className={`w-full ${getMosaicHeight(i)}`} />
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Failed to load images
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => fetchImages(1, false)} variant="outline">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {displayedImages.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No images found</p>
                    <p className="text-sm mt-2">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Masonry Grid */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                      {displayedImages.map((image, index) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="break-inside-avoid group cursor-pointer"
                          onClick={() => setSelectedImage(image)}
                        >
                          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                            <div className="relative overflow-hidden">
                              <Image
                                src={image.thumbnailUrl}
                                alt={image.title}
                                width={400}
                                height={300}
                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                {image.title}
                              </h3>
                              {image.description && (
                                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                                  {image.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(image.dateCreated)}</span>
                                </div>
                                {image.center && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {image.center}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center pt-8"
                      >
                        <Button
                          onClick={loadMoreImages}
                          disabled={loadingMore}
                          size="lg"
                          className="dark:text-foreground"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading More...
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4" />
                              Load More Images
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Image Detail Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="w-[95vw] !max-w-6xl h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col">
          {selectedImage && (
            <>
              {/* Header */}
              <DialogHeader className="p-4 sm:p-6 border-b bg-muted/30 flex-shrink-0">
                <div className="flex justify-between">
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-lg sm:text-xl line-clamp-2">
                      {selectedImage.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-1">
                      NASA ID: {selectedImage.id}
                    </DialogDescription>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {selectedImage.center && (
                        <Badge variant="outline" className="text-xs">
                          {selectedImage.center}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(selectedImage.dateCreated)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={selectedImage.thumbnailUrl}
                        alt={selectedImage.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="dark:text-foreground"
                        onClick={() =>
                          window.open(selectedImage.originalUrl, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Original
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(selectedImage.thumbnailUrl, "_blank")
                        }
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    {/* Description */}
                    {selectedImage.description && (
                      <div>
                        <h4 className="font-semibold mb-3">Description</h4>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-sm leading-relaxed">
                              {selectedImage.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Metadata */}
                    <div>
                      <h4 className="font-semibold mb-3">Details</h4>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Date Created:
                              </span>
                              <span>
                                {formatDate(selectedImage.dateCreated)}
                              </span>
                            </div>
                            {selectedImage.center && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  NASA Center:
                                </span>
                                <span>{selectedImage.center}</span>
                              </div>
                            )}
                            {selectedImage.photographer && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Photographer:
                                </span>
                                <span>{selectedImage.photographer}</span>
                              </div>
                            )}
                            {selectedImage.location && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Location:
                                </span>
                                <span>{selectedImage.location}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Keywords */}
                    {selectedImage.keywords.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.keywords
                            .slice(0, 10)
                            .map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs dark:bg-secondary dark:border-secondary"
                              >
                                {keyword}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
