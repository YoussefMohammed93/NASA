"use client";

import {
  Calendar,
  AlertTriangle,
  Eye,
  Loader2,
  X,
  ZoomIn,
  Clock,
  MapPin,
  Download,
  Globe,
  Satellite,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface EarthImage {
  id: string;
  image: string;
  caption: string;
  date: string;
  coords: {
    lat: number;
    lon: number;
  };
  image_url: string;
  type: string;
}

interface EarthApiResponse {
  images: EarthImage[];
  total: number;
  date: string;
  type: string;
}

const EarthGallery = () => {
  const [images, setImages] = useState<EarthImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<EarthImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [imageType, setImageType] = useState<"natural" | "enhanced">("natural");
  const [, setPage] = useState(1);

  const fetchImages = useCallback(
    async (resetImages = false) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          type: imageType,
        });

        if (selectedDate) {
          params.append("date", selectedDate);
        }

        const response = await fetch(`/api/earth/epic?${params}`);
        if (!response.ok) throw new Error("Failed to fetch Earth images");

        const data: EarthApiResponse = await response.json();

        if (resetImages) {
          setImages(data.images);
          setPage(1);
          if (data.images.length === 0) {
            toast.info("No images found for the selected date");
          }
        } else {
          // For pagination (though EPIC typically returns all images for a date)
          setImages((prevImages) => {
            const existingIds = new Set(prevImages.map((img) => img.id));
            const newImages = data.images.filter(
              (img) => !existingIds.has(img.id)
            );
            return [...prevImages, ...newImages];
          });
        }

        // EPIC typically returns all images at once
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load Earth images");
      } finally {
        setLoading(false);
      }
    },
    [imageType, selectedDate]
  );

  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages(true);
  }, [imageType, selectedDate, fetchImages]);

  const handleDownload = async (image: EarthImage) => {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(
          image.image_url
        )}&filename=earth-${image.type}-${image.image}.png`
      );
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earth-${image.type}-${image.image}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Image downloaded successfully!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const formatCoordinates = (coords: { lat: number; lon: number }) => {
    const latDir = coords.lat >= 0 ? "N" : "S";
    const lonDir = coords.lon >= 0 ? "E" : "W";
    return `${Math.abs(coords.lat).toFixed(2)}°${latDir}, ${Math.abs(
      coords.lon
    ).toFixed(2)}°${lonDir}`;
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-700 dark:from-blue-500/25 dark:via-blue-600/20 dark:to-blue-700/15 border-b">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white/90 dark:text-blue-100/90">
              Earth from Space
            </h1>
            <p className="text-lg text-white/90 dark:text-blue-100/90 max-w-2xl mx-auto">
              Experience our planet from NASA&apos;s EPIC satellite, positioned
              at the L1 Lagrange point between Earth and the Sun, capturing the
              full sunlit side of Earth.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6"
        >
          {/* Image Type Selection */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Satellite className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Image Type:</span>
            </div>
            <Select
              value={imageType}
              onValueChange={(value: "natural" | "enhanced") =>
                setImageType(value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural Color</SelectItem>
                <SelectItem value="enhanced">Enhanced Color</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Date:</span>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
              max={new Date().toISOString().split("T")[0]}
            />
            {selectedDate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate("")}
              >
                Show Latest
              </Button>
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Images Available
                  </p>
                  <p className="text-2xl font-bold">
                    {images.length.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Satellite className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Image Type</p>
                  <p className="text-2xl font-bold capitalize">{imageType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-2xl font-bold">
                    {selectedDate || "Latest"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Earth Images
              </CardTitle>
              <CardDescription>
                High-resolution images of Earth captured by NASA&apos;s EPIC
                instrument aboard the DSCOVR satellite
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {loading && images.length === 0 ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="aspect-square w-full rounded-lg" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 text-center"
                  >
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Failed to load images
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => fetchImages(true)} variant="outline">
                      <Loader2 className="h-4 w-4" />
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    {images.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No images found for the selected date</p>
                        <p className="text-sm mt-2">
                          Try selecting a different date or view the latest
                          images
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                        {images.map((image, index) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-card border rounded-2xl overflow-hidden transition-all duration-500"
                          >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                              <Image
                                src={image.image_url}
                                alt={
                                  image.caption ||
                                  `Earth from EPIC - ${image.date}`
                                }
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center">
                                        <div class="text-center text-muted-foreground">
                                          <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                          </svg>
                                          <p class="text-sm">Image unavailable</p>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />

                              {/* Overlay Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              {/* Top Action Buttons */}
                              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setSelectedImage(image)}
                                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
                                >
                                  <ZoomIn className="h-4 w-4 text-gray-700" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleDownload(image)}
                                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
                                >
                                  <Download className="h-4 w-4 text-gray-700" />
                                </Button>
                              </div>

                              {/* Image Type Badge */}
                              <div className="absolute top-3 left-3">
                                <Badge
                                  variant="outline"
                                  className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-700 font-medium shadow-lg"
                                >
                                  <Satellite className="h-3 w-3 mr-1" />
                                  {image.type}
                                </Badge>
                              </div>

                              {/* Coordinates Badge */}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <Badge className="dark:text-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {formatCoordinates(image.coords)}
                                </Badge>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 space-y-3">
                              {/* Caption */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Caption
                                    </p>
                                    <p className="text-sm font-medium line-clamp-2">
                                      {image.caption || "Earth from EPIC"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Date Info */}
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                <Clock className="h-4 w-4 sm:w-5 sm:h-5 text-muted-foreground" />
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground">
                                    Captured
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatDate(image.date)}
                                  </p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-1 pr-2">
                                <Button
                                  size="sm"
                                  className="w-1/2 dark:text-foreground"
                                  variant="outline"
                                  onClick={() => setSelectedImage(image)}
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  className="w-1/2 dark:text-foreground"
                                  onClick={() => handleDownload(image)}
                                >
                                  <Download className="h-3 w-3" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent
          className="!max-w-3xl max-h-[80vh] p-0 overflow-auto bg-background border"
          showCloseButton={false}
        >
          {selectedImage && (
            <>
              {/* Header */}
              <DialogHeader className="p-4 sm:p-6 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <DialogTitle className="text-lg sm:text-xl font-semibold">
                        Earth from EPIC
                      </DialogTitle>
                      <DialogDescription>
                        {selectedImage.caption ||
                          "High-resolution Earth imagery"}
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden sm:flex">
                      <Satellite className="h-3 w-3 mr-1" />
                      {selectedImage.type}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedImage(null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              {/* Image Container */}
              <div className="w-full relative bg-muted/20 min-h-[300px] max-h-[50vh] sm:max-h-[55vh] overflow-hidden">
                <Image
                  src={selectedImage.image_url}
                  alt={
                    selectedImage.caption ||
                    `Earth from EPIC - ${selectedImage.date}`
                  }
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-64 flex items-center justify-center">
                          <div class="text-center text-muted-foreground">
                            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-lg">Image unavailable</p>
                            <p class="text-sm opacity-75">This Earth image could not be loaded</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Mobile Type Badge */}
                <div className="flex sm:hidden">
                  <Badge variant="outline">
                    <Satellite className="h-3 w-3 mr-1" />
                    {selectedImage.type}
                  </Badge>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Captured
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDate(selectedImage.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Satellite className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Type
                      </p>
                      <p className="text-sm font-semibold capitalize">
                        {selectedImage.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Center Point
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCoordinates(selectedImage.coords)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground text-center">
                    <span className="font-medium">Image ID:</span>{" "}
                    {selectedImage.id} •
                    <span className="font-medium">
                      {" "}
                      Captured by NASA&apos;s EPIC instrument on DSCOVR
                      satellite
                    </span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="p-4 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={() => handleDownload(selectedImage)}
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="h-4 w-4" />
                    Download High Resolution
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                    size="lg"
                    className="sm:w-auto"
                  >
                    <X className="h-4 w-4 sm:mr-0" />
                    <span className="sm:hidden">Close</span>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EarthGallery;
