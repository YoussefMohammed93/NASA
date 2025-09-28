"use client";

import {
  Calendar,
  AlertTriangle,
  Eye,
  Loader2,
  X,
  ZoomIn,
  Rocket,
  MapPin,
  Clock,
  Camera,
  Download,
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

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera: {
    id: number;
    name: string;
    full_name: string;
  };
  rover: {
    id: number;
    name: string;
    status: string;
    launch_date: string;
    landing_date: string;
  };
}

interface MarsApiResponse {
  photos: MarsPhoto[];
  rover: string;
  total_results: number;
  page: number;
}

const MarsGallery = () => {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [selectedCamera, setSelectedCamera] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSol, setSelectedSol] = useState("");
  const [dateType, setDateType] = useState<"earth" | "sol">("sol");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<MarsPhoto | null>(null);

  const rovers = [
    { value: "curiosity", label: "Curiosity", status: "Active" },
    { value: "opportunity", label: "Opportunity", status: "Complete" },
    { value: "spirit", label: "Spirit", status: "Complete" },
    { value: "perseverance", label: "Perseverance", status: "Active" },
  ];

  const cameras = {
    curiosity: [
      { value: "FHAZ", label: "Front Hazard Avoidance Camera" },
      { value: "RHAZ", label: "Rear Hazard Avoidance Camera" },
      { value: "MAST", label: "Mast Camera" },
      { value: "CHEMCAM", label: "Chemistry and Camera Complex" },
      { value: "MAHLI", label: "Mars Hand Lens Imager" },
      { value: "MARDI", label: "Mars Descent Imager" },
      { value: "NAVCAM", label: "Navigation Camera" },
    ],
    opportunity: [
      { value: "FHAZ", label: "Front Hazard Avoidance Camera" },
      { value: "RHAZ", label: "Rear Hazard Avoidance Camera" },
      { value: "NAVCAM", label: "Navigation Camera" },
      { value: "PANCAM", label: "Panoramic Camera" },
      { value: "MINITES", label: "Miniature Thermal Emission Spectrometer" },
    ],
    spirit: [
      { value: "FHAZ", label: "Front Hazard Avoidance Camera" },
      { value: "RHAZ", label: "Rear Hazard Avoidance Camera" },
      { value: "NAVCAM", label: "Navigation Camera" },
      { value: "PANCAM", label: "Panoramic Camera" },
      { value: "MINITES", label: "Miniature Thermal Emission Spectrometer" },
    ],
    perseverance: [
      { value: "EDL_RUCAM", label: "Rover Up-Look Camera" },
      { value: "EDL_RDCAM", label: "Rover Down-Look Camera" },
      { value: "EDL_DDCAM", label: "Descent Stage Down-Look Camera" },
      { value: "EDL_PUCAM1", label: "Parachute Up-Look Camera A" },
      { value: "EDL_PUCAM2", label: "Parachute Up-Look Camera B" },
      { value: "NAVCAM_LEFT", label: "Navigation Camera - Left" },
      { value: "NAVCAM_RIGHT", label: "Navigation Camera - Right" },
      { value: "MCZ_LEFT", label: "Mast Camera Zoom - Left" },
      { value: "MCZ_RIGHT", label: "Mast Camera Zoom - Right" },
      { value: "FRONT_HAZCAM_LEFT_A", label: "Front Hazard Camera - Left" },
      { value: "FRONT_HAZCAM_RIGHT_A", label: "Front Hazard Camera - Right" },
      { value: "REAR_HAZCAM_LEFT", label: "Rear Hazard Camera - Left" },
      { value: "REAR_HAZCAM_RIGHT", label: "Rear Hazard Camera - Right" },
    ],
  };

  const fetchPhotos = useCallback(
    async (resetPhotos = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = resetPhotos ? 1 : page;

        const params = new URLSearchParams({
          rover: selectedRover,
          page: currentPage.toString(),
        });

        if (selectedCamera && selectedCamera !== "all")
          params.append("camera", selectedCamera);
        if (dateType === "earth" && selectedDate) {
          params.append("earth_date", selectedDate);
        } else if (dateType === "sol" && selectedSol) {
          params.append("sol", selectedSol);
        }

        const response = await fetch(`/api/mars?${params}`);
        if (!response.ok) throw new Error("Failed to fetch Mars photos");

        const data: MarsApiResponse = await response.json();

        if (resetPhotos) {
          setPhotos(data.photos);
          setPage(2);
          if (data.photos.length === 0) {
            toast.info("No photos found for the selected criteria");
          }
        } else {
          // Use functional updates to avoid dependency on photos state
          setPhotos((prevPhotos) => {
            const existingIds = new Set(prevPhotos.map((photo) => photo.id));
            const newPhotos = data.photos.filter(
              (photo) => !existingIds.has(photo.id)
            );

            // Show toast messages
            toast.dismiss("load-more");
            if (newPhotos.length > 0) {
              toast.success(
                `Loaded ${newPhotos.length} more photo${
                  newPhotos.length === 1 ? "" : "s"
                }!`
              );
            } else if (data.photos.length === 0) {
              toast.info("No more photos available");
              setHasMore(false);
            } else {
              toast.info("No new photos found (duplicates filtered)");
            }

            return [...prevPhotos, ...newPhotos];
          });
          setPage((prev) => prev + 1);
        }

        setHasMore(data.photos.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.dismiss("load-more");
        toast.error("Failed to load Mars photos");
      } finally {
        setLoading(false);
      }
    },
    [selectedRover, selectedCamera, selectedDate, selectedSol, dateType, page]
  );

  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    fetchPhotos(true);
  }, [
    selectedRover,
    selectedCamera,
    selectedDate,
    selectedSol,
    dateType,
    fetchPhotos,
  ]);

  useEffect(() => {
    setSelectedCamera("all");
  }, [selectedRover]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      toast.loading("Loading more Mars photos...", {
        id: "load-more",
      });
      fetchPhotos(false);
    } else if (!hasMore) {
      toast.info("No more photos available for the current selection");
    } else if (loading) {
      toast.info("Photos are already loading, please wait...");
    }
  };

  const handleDownload = async (photo: MarsPhoto) => {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(photo.img_src)}&filename=mars-${
          photo.rover.name
        }-${photo.id}.jpg`
      );
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mars-${photo.rover.name}-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Photo downloaded successfully!");
    } catch {
      toast.error("Failed to download photo");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoverStatus = (status: string) => {
    return status === "active" ? "Active" : "Complete";
  };

  const getRoverStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 text-green-600 border-green-500/20"
      : "bg-blue-500/10 text-blue-600 border-blue-500/20";
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
              Mars Rover Photos
            </h1>
            <p className="text-lg text-white/90 dark:text-blue-100/90 max-w-2xl mx-auto">
              Explore the Red Planet through the eyes of NASA&apos;s Mars
              rovers. View stunning images captured across different missions
              and cameras.
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
          {/* Rover and Camera Selection */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Rover:</span>
            </div>
            <Select value={selectedRover} onValueChange={setSelectedRover}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rovers.map((rover) => (
                  <SelectItem key={rover.value} value={rover.value}>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{rover.label}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRoverStatusColor(
                          rover.status.toLowerCase()
                        )}`}
                      >
                        {rover.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Camera:</span>
            </div>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Cameras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cameras</SelectItem>
                {cameras[selectedRover as keyof typeof cameras]?.map(
                  (camera) => (
                    <SelectItem key={camera.value} value={camera.value}>
                      {camera.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Date:</span>
            </div>
            <Select
              value={dateType}
              onValueChange={(value: "earth" | "sol") => setDateType(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">Sol</SelectItem>
                <SelectItem value="earth">Earth Date</SelectItem>
              </SelectContent>
            </Select>

            {dateType === "earth" ? (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            ) : (
              <Input
                type="number"
                placeholder="Sol (e.g. 1000)"
                value={selectedSol}
                onChange={(e) => setSelectedSol(e.target.value)}
                className="w-40"
                min="0"
                max="4000"
              />
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <Camera className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Photos Loaded</p>
                  <p className="text-2xl font-bold">
                    {photos.length.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-orange-500/10">
                  <Rocket className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Rover</p>
                  <p className="text-2xl font-bold capitalize">
                    {selectedRover}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Camera Filter</p>
                  <p className="text-2xl font-bold">
                    {selectedCamera === "all" ? "All" : selectedCamera}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Mars Rover Photos
              </CardTitle>
              <CardDescription>
                Explore images captured by NASA&apos;s Mars rovers across
                different sols and cameras
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {loading && photos.length === 0 ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-48 w-full rounded-lg" />
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
                      Failed to load photos
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => fetchPhotos(true)} variant="outline">
                      <Loader2 className="h-4 w-4" />
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    {photos.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No photos found for the selected criteria</p>
                        <p className="text-sm mt-2">
                          Try adjusting your filters or selecting a different
                          date
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                          {photos.map((photo, index) => (
                            <motion.div
                              key={photo.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group relative bg-card border rounded-2xl overflow-hidden transition-all duration-500"
                            >
                              {/* Image Container */}
                              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                                <Image
                                  src={photo.img_src}
                                  alt={`Mars photo by ${photo.rover.name} - ${photo.camera.full_name}`}
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
                                    onClick={() => setSelectedPhoto(photo)}
                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
                                  >
                                    <ZoomIn className="h-4 w-4 text-gray-700" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleDownload(photo)}
                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
                                  >
                                    <Download className="h-4 w-4 text-gray-700" />
                                  </Button>
                                </div>

                                {/* Rover Status Badge */}
                                <div className="absolute top-3 left-3">
                                  <Badge
                                    variant="outline"
                                    className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-700 font-medium shadow-lg"
                                  >
                                    <Rocket className="h-3 w-3 mr-1" />
                                    {photo.rover.name}
                                  </Badge>
                                </div>

                                {/* Sol Badge */}
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                  <Badge className="dark:text-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Sol {photo.sol}
                                  </Badge>
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-4 space-y-3">
                                {/* Camera Info */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Camera
                                      </p>
                                      <p className="text-sm font-medium">
                                        {photo.camera.name}
                                      </p>
                                    </div>
                                  </div>

                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getRoverStatusColor(
                                      photo.rover.status
                                    )}`}
                                  >
                                    {getRoverStatus(photo.rover.status)}
                                  </Badge>
                                </div>

                                {/* Date Info */}
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                  <Calendar className="h-4 w-4 sm:w-5 sm:h-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">
                                      Earth Date
                                    </p>
                                    <p className="text-sm font-medium">
                                      {formatDate(photo.earth_date)}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-1 pr-2">
                                  <Button
                                    size="sm"
                                    className="w-1/2 dark:text-foreground"
                                    variant="outline"
                                    onClick={() => setSelectedPhoto(photo)}
                                  >
                                    <Eye className="h-3 w-3" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="w-1/2 dark:text-foreground"
                                    onClick={() => handleDownload(photo)}
                                  >
                                    <Download className="h-3 w-3" />
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {hasMore && (
                          <div className="text-center">
                            <Button
                              onClick={handleLoadMore}
                              disabled={loading}
                              variant="outline"
                              size="lg"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  Load More Photos
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Photo Modal */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent
          className="!max-w-3xl max-h-[80vh] p-0 overflow-auto bg-background border"
          showCloseButton={false}
        >
          {selectedPhoto && (
            <>
              {/* Header */}
              <DialogHeader className="p-4 sm:p-6 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <DialogTitle className="text-lg sm:text-xl font-semibold capitalize">
                        {selectedPhoto.rover.name} Rover
                      </DialogTitle>
                      <DialogDescription>
                        {selectedPhoto.camera.full_name}
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden sm:flex">
                      <Clock className="h-3 w-3 mr-1" />
                      Sol {selectedPhoto.sol}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedPhoto(null)}
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
                  src={selectedPhoto.img_src}
                  alt={`Mars photo by ${selectedPhoto.rover.name}`}
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
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-lg">Image unavailable</p>
                            <p class="text-sm opacity-75">This Mars rover image could not be loaded</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Mobile Sol Badge */}
                <div className="flex sm:hidden">
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    Sol {selectedPhoto.sol}
                  </Badge>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Earth Date
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDate(selectedPhoto.earth_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Camera className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Camera
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedPhoto.camera.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Mission Sol
                      </p>
                      <p className="text-sm font-semibold">
                        Sol {selectedPhoto.sol}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground text-center">
                    <span className="font-medium">Image ID:</span>{" "}
                    {selectedPhoto.id} •
                    <span className="font-medium">
                      {" "}
                      Captured by NASA&apos;s {selectedPhoto.rover.name} rover
                      on Mars
                    </span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="p-4 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={() => handleDownload(selectedPhoto)}
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="h-4 w-4" />
                    Download High Resolution
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPhoto(null)}
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

export default MarsGallery;
