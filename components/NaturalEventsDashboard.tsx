"use client";

import {
  Search,
  Globe,
  Flame,
  CloudRain,
  Mountain,
  Waves,
  Zap,
  Wind,
  AlertTriangle,
  Eye,
  ExternalLink,
  MapPin,
  Loader2,
  RefreshCw,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
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
import { useState, useEffect, useCallback, useMemo } from "react";

// Types
interface EonetGeometry {
  type: "Point" | "Polygon";
  coordinates: number[] | number[][];
}

interface EonetSource {
  id: string;
  url: string;
}

interface EonetCategory {
  id: string;
  title: string;
}

interface NaturalEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  status: "Open" | "Closed";
  closedDate: string | null;
  categories: EonetCategory[];
  sources: EonetSource[];
  coordinates: {
    lat: number;
    lon: number;
  } | null;
  geometry: EonetGeometry[];
  lastUpdated: string;
}

interface NaturalEventsResponse {
  events: NaturalEvent[];
  summary: {
    total: number;
    open: number;
    closed: number;
    categories: Record<string, number>;
  };
}

const NaturalEventsDashboard = () => {
  const [allEvents, setAllEvents] = useState<NaturalEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<NaturalEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<NaturalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NaturalEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [summary, setSummary] = useState<
    NaturalEventsResponse["summary"] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  const EVENTS_PER_PAGE = 15;

  // Category definitions with icons and colors
  const categoryConfig = {
    Wildfires: {
      icon: Flame,
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200/50 dark:border-red-500/20",
    },
    "Severe Storms": {
      icon: CloudRain,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200/50 dark:border-blue-500/20",
    },
    Volcanoes: {
      icon: Mountain,
      color: "bg-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200/50 dark:border-orange-500/20",
    },
    Floods: {
      icon: Waves,
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
      borderColor: "border-cyan-200/50 dark:border-cyan-500/20",
    },
    Earthquakes: {
      icon: Zap,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200/50 dark:border-purple-500/20",
    },
    Cyclones: {
      icon: Wind,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      borderColor: "border-indigo-200/50 dark:border-indigo-500/20",
    },
  };

  const statusConfig = {
    Open: {
      icon: AlertCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    Closed: {
      icon: CheckCircle,
      color: "bg-gray-500",
      textColor: "text-gray-600",
    },
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "100",
        days: "30",
      });

      if (selectedCategory !== "all") {
        // Map category names to EONET category IDs
        const categoryMap: Record<string, string> = {
          Wildfires: "8",
          "Severe Storms": "10",
          Volcanoes: "12",
          Floods: "5",
          Earthquakes: "16",
          Cyclones: "10",
        };
        const categoryId = categoryMap[selectedCategory];
        if (categoryId) {
          params.append("category", categoryId);
        }
      }

      if (selectedStatus !== "all") {
        params.append("status", selectedStatus.toLowerCase());
      }

      const response = await fetch(`/api/natural-events?${params}`);
      if (!response.ok) throw new Error("Failed to fetch natural events data");

      const data: NaturalEventsResponse = await response.json();

      setAllEvents(data.events);
      setSummary(data.summary);

      // Reset pagination and show first page
      setCurrentPage(1);
      setDisplayedEvents(data.events.slice(0, EVENTS_PER_PAGE));

      if (data.events.length === 0) {
        toast.info("No natural events found for the selected criteria");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load natural events data");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, EVENTS_PER_PAGE]);

  const loadMoreEvents = useCallback(() => {
    setLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * EVENTS_PER_PAGE;

      setDisplayedEvents(allEvents.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      setLoadingMore(false);

      toast.success(
        `Loaded ${Math.min(
          EVENTS_PER_PAGE,
          allEvents.length - (nextPage - 1) * EVENTS_PER_PAGE
        )} more events`
      );
    }, 500);
  }, [currentPage, allEvents, EVENTS_PER_PAGE]);

  const hasMoreEvents = displayedEvents.length < allEvents.length;

  // Filter events based on search query
  const filteredEventsData = useMemo(() => {
    if (!searchQuery.trim()) return displayedEvents;

    const query = searchQuery.toLowerCase();
    return displayedEvents.filter(
      (event: NaturalEvent) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.categories.some((cat: EonetCategory) =>
          cat.title.toLowerCase().includes(query)
        )
    );
  }, [displayedEvents, searchQuery]);

  useEffect(() => {
    setFilteredEvents(filteredEventsData);
  }, [filteredEventsData]);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus, fetchEvents]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (categoryTitle: string) => {
    const config = categoryConfig[categoryTitle as keyof typeof categoryConfig];
    return config?.icon || Globe;
  };

  const getCategoryColor = (categoryTitle: string) => {
    const config = categoryConfig[categoryTitle as keyof typeof categoryConfig];
    return config?.color || "bg-gray-500";
  };

  const getCategoryBg = (categoryTitle: string) => {
    const config = categoryConfig[categoryTitle as keyof typeof categoryConfig];
    return config?.bgColor || "bg-gray-50 dark:bg-gray-950/20";
  };

  const getCategoryBorder = (categoryTitle: string) => {
    const config = categoryConfig[categoryTitle as keyof typeof categoryConfig];
    return config?.borderColor || "border-gray-200/50 dark:border-gray-500/20";
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Unique Layout */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-700 dark:from-blue-500/25 dark:via-blue-600/20 dark:to-blue-700/15 border-b" />
        <div className="relative max-w-7xl mx-auto px-5 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-4 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Globe className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white/95">
              Natural Events Monitor
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Real-time tracking of natural phenomena worldwide through
              NASA&apos;s Earth Observing System
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content with Unique Grid Layout */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-transparent border-none">
            <CardContent className="p-0 !pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(categoryConfig).map((category) => {
                      const Icon = getCategoryIcon(category);
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {category}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open Events</SelectItem>
                    <SelectItem value="closed">Closed Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <AlertCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.open}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200/50 dark:border-gray-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-500/20">
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {summary.closed}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 dark:border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.keys(summary.categories).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Events Grid with Unique Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Natural Events Timeline
                  </CardTitle>
                  <CardDescription className="pt-2">
                    Live monitoring of natural phenomena from NASA&apos;s EONET
                    system
                  </CardDescription>
                </div>
                {allEvents.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>
                      Showing {displayedEvents.length} of {allEvents.length}{" "}
                      events
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className="p-6 border rounded-xl bg-muted/20"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex items-center gap-2">
                                  <Skeleton className="h-3 w-3 rounded-full" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-2 mb-4">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                            <Skeleton className="h-3 w-3/5" />
                          </div>

                          {/* Categories */}
                          <div className="flex gap-2 mb-4">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>

                          {/* Location & Sources */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>

                          {/* Button */}
                          <div className="pt-4 border-t">
                            <Skeleton className="h-8 w-full rounded" />
                          </div>
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
                    className="p-8 text-center"
                  >
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Failed to load natural events
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => fetchEvents()} variant="outline">
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
                    className="p-6"
                  >
                    {allEvents.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No natural events found</p>
                        <p className="text-sm mt-2">
                          Try adjusting your filters or search terms
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event, index) => {
                          const primaryCategory = event.categories[0];
                          const CategoryIcon = getCategoryIcon(
                            primaryCategory?.title || ""
                          );
                          const StatusIcon = statusConfig[event.status].icon;

                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group relative"
                            >
                              <Card
                                className={`cursor-pointer transition-all duration-200 ${getCategoryBg(
                                  primaryCategory?.title || ""
                                )} ${getCategoryBorder(
                                  primaryCategory?.title || ""
                                )} border-2`}
                                onClick={() => setSelectedEvent(event)}
                              >
                                <CardContent className="p-6">
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`p-3 rounded-full ${getCategoryColor(
                                          primaryCategory?.title || ""
                                        )} bg-opacity-20`}
                                      >
                                        <CategoryIcon className="h-6 w-6 text-white" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-sm sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                          {event.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                          <StatusIcon
                                            className={`h-4 w-4 ${
                                              statusConfig[event.status]
                                                .textColor
                                            }`}
                                          />
                                          <span
                                            className={`text-sm font-medium ${
                                              statusConfig[event.status]
                                                .textColor
                                            }`}
                                          >
                                            {event.status}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  {event.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                      {event.description}
                                    </p>
                                  )}

                                  {/* Categories */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {event.categories.map((category) => (
                                      <Badge
                                        key={category.id}
                                        className="text-xs dark:text-foreground"
                                      >
                                        {category.title}
                                      </Badge>
                                    ))}
                                  </div>

                                  {/* Location & Sources */}
                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    {event.coordinates && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                          {event.coordinates.lat.toFixed(2)}°,{" "}
                                          {event.coordinates.lon.toFixed(2)}°
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <ExternalLink className="h-4 w-4" />
                                      <span>
                                        {event.sources.length} source(s)
                                      </span>
                                    </div>
                                  </div>

                                  {/* View Details Button */}
                                  <div className="mt-4 pt-4 border-t">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}

                        {/* Load More Button */}
                        {hasMoreEvents && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center pt-6 col-span-full"
                          >
                            <Button
                              onClick={loadMoreEvents}
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
                                  Load More Events
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col">
          {selectedEvent && (
            <>
              {/* Header */}
              <DialogHeader className="p-4 sm:p-6 border-b bg-muted/30 flex-shrink-0">
                <div className="flex justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`p-3 rounded-full ${getCategoryColor(
                        selectedEvent.categories[0]?.title || ""
                      )} bg-opacity-20 flex-shrink-0`}
                    >
                      {(() => {
                        const CategoryIcon = getCategoryIcon(
                          selectedEvent.categories[0]?.title || ""
                        );
                        return <CategoryIcon className="h-6 w-6 text-white" />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1 flex items-start flex-col">
                      <DialogTitle className="text-lg sm:text-xl line-clamp-2">
                        {selectedEvent.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm mt-1">
                        Event ID: {selectedEvent.id}
                      </DialogDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={`${
                            statusConfig[selectedEvent.status].color
                          } text-white text-xs`}
                        >
                          {selectedEvent.status}
                        </Badge>
                        {selectedEvent.categories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Description */}
                  {selectedEvent.description && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm sm:text-base">
                        Description
                      </h4>
                      <Card>
                        <CardContent className="p-4 sm:p-5">
                          <p className="text-sm leading-relaxed">
                            {selectedEvent.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Location */}
                  {selectedEvent.coordinates && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm sm:text-base">
                        Location
                      </h4>
                      <Card>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Latitude:{" "}
                              {selectedEvent.coordinates.lat.toFixed(4)}°,
                              Longitude:{" "}
                              {selectedEvent.coordinates.lon.toFixed(4)}°
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Sources */}
                  {selectedEvent.sources.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm sm:text-base">
                        Sources
                      </h4>
                      <div className="space-y-2">
                        {selectedEvent.sources.map((source, index) => (
                          <Card key={index}>
                            <CardContent className="p-4 sm:p-5">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {source.id}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    window.open(source.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View Source
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Information */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">
                      Status Information
                    </h4>
                    <Card>
                      <CardContent className="p-4 sm:p-5">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Status:
                            </span>
                            <span
                              className={`font-medium ${
                                statusConfig[selectedEvent.status].textColor
                              }`}
                            >
                              {selectedEvent.status}
                            </span>
                          </div>
                          {selectedEvent.closedDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Closed Date:
                              </span>
                              <span>
                                {formatDate(selectedEvent.closedDate)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Last Updated:
                            </span>
                            <span>{formatDate(selectedEvent.lastUpdated)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

export default NaturalEventsDashboard;
