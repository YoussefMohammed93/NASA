"use client";

import {
  Calendar,
  AlertTriangle,
  Eye,
  Loader2,
  X,
  Zap,
  Sun,
  Activity,
  TrendingUp,
  Clock,
  MapPin,
  Filter,
  Shield,
  Radio,
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
import { useState, useEffect, useCallback } from "react";

interface LinkedEvent {
  activityID?: string;
  link?: string;
}

interface Instrument {
  displayName: string;
}

interface CmeAnalysis {
  speed?: number;
  halfAngle?: number;
  latitude?: number;
  longitude?: number;
  isEarthDirected?: boolean;
}

interface KpIndexEntry {
  kpIndex: number;
  observedTime?: string;
  source?: string;
}

interface SpaceWeatherEvent {
  id: string;
  eventType: string;
  beginTime: string;
  peakTime?: string;
  endTime?: string;
  sourceLocation?: string;
  activeRegionNum?: number;
  note: string;
  linkedEvents: LinkedEvent[];
  classType?: string;
  instruments?: Instrument[];
  speed?: number;
  halfAngle?: number;
  latitude?: number;
  longitude?: number;
  mostAccurateIsEarthDirection?: boolean;
  cmeAnalyses?: CmeAnalysis[];
  allKpIndex?: KpIndexEntry[];
  kpIndex?: number;
  intensityValue?: number;
}

interface SpaceWeatherResponse {
  events: SpaceWeatherEvent[];
  summary: {
    total: number;
    flares: number;
    cmes: number;
    geomagneticStorms: number;
    solarEnergeticParticles: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  dateRange: {
    start: string;
    end: string;
  };
}

const SpaceWeatherDashboard = () => {
  const [allEvents, setAllEvents] = useState<SpaceWeatherEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<SpaceWeatherEvent[]>(
    []
  );
  const [selectedEvent, setSelectedEvent] = useState<SpaceWeatherEvent | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventType, setEventType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState<
    SpaceWeatherResponse["summary"] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  const EVENTS_PER_PAGE = 12;

  const eventTypes = [
    { value: "all", label: "All Events", icon: Activity },
    { value: "flare", label: "Solar Flares", icon: Sun },
    { value: "cme", label: "Coronal Mass Ejections", icon: Radio },
    { value: "geomagneticStorm", label: "Geomagnetic Storms", icon: Zap },
    {
      value: "solarEnergeticParticle",
      label: "Solar Energetic Particles",
      icon: Shield,
    },
  ];

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        type: eventType,
      });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/space-weather?${params}`);
      if (!response.ok) throw new Error("Failed to fetch space weather data");

      const data: SpaceWeatherResponse = await response.json();

      setAllEvents(data.events);
      setSummary(data.summary);

      // Reset pagination and show first page
      setCurrentPage(1);
      setDisplayedEvents(data.events.slice(0, EVENTS_PER_PAGE));

      if (data.events.length === 0) {
        toast.info("No space weather events found for the selected criteria");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load space weather data");
    } finally {
      setLoading(false);
    }
  }, [eventType, startDate, endDate, EVENTS_PER_PAGE]);

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

  useEffect(() => {
    fetchEvents();
  }, [eventType, startDate, endDate, fetchEvents]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "flare":
        return Sun;
      case "cme":
        return Radio;
      case "geomagneticStorm":
        return Zap;
      case "solarEnergeticParticle":
        return Shield;
      default:
        return Activity;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "flare":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "cme":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "geomagneticStorm":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "solarEnergeticParticle":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getSeverityLevel = (event: SpaceWeatherEvent) => {
    if (event.classType) {
      const classType = event.classType.toUpperCase();
      if (classType.includes("X"))
        return { level: "Extreme", color: "bg-red-500" };
      if (classType.includes("M"))
        return { level: "Strong", color: "bg-orange-500" };
      if (classType.includes("C"))
        return { level: "Moderate", color: "bg-yellow-500" };
      if (classType.includes("B"))
        return { level: "Minor", color: "bg-green-500" };
    }
    if (event.kpIndex && event.kpIndex >= 7)
      return { level: "Severe", color: "bg-red-500" };
    if (event.kpIndex && event.kpIndex >= 5)
      return { level: "Strong", color: "bg-orange-500" };
    return { level: "Minor", color: "bg-blue-500" };
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-700 dark:from-blue-500/25 dark:via-blue-600/20 dark:to-blue-700/15 border-b">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white/90">
              Space Weather Monitor
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Track real-time solar activity, geomagnetic storms, and space
              weather events that affect Earth&apos;s magnetosphere and
              technology systems.
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
          className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between mb-6"
        >
          {/* Event Type Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Event Type:</span>
            </div>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      <span className="truncate">{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-36"
                max={new Date().toISOString().split("T")[0]}
                placeholder="Start date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-36"
                max={new Date().toISOString().split("T")[0]}
                placeholder="End date"
              />
              {(startDate || endDate) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6"
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

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Sun className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Solar Flares
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {summary.flares}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200/50 dark:border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Radio className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CMEs</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {summary.cmes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200/50 dark:border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Geo Storms</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {summary.geomagneticStorms}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200/50 dark:border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SEP Events</p>
                    <p className="text-2xl font-bold text-red-600">
                      {summary.solarEnergeticParticles}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Space Weather Events
                  </CardTitle>
                  <CardDescription className="pt-2">
                    Real-time monitoring of solar activity and space weather
                    phenomena from NASA&apos;s DONKI database
                  </CardDescription>
                </div>
                {allEvents.length > 0 && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span>
                        Showing {displayedEvents.length} of {allEvents.length}{" "}
                        events
                      </span>
                    </div>
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
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
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
                    className="p-6 text-center"
                  >
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Failed to load space weather data
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => fetchEvents()} variant="outline">
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
                    {allEvents.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No space weather events found</p>
                        <p className="text-sm mt-2">
                          Try adjusting your filters or date range
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {displayedEvents.map((event, index) => {
                          const EventIcon = getEventIcon(event.eventType);
                          const severity = getSeverityLevel(event);

                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group relative p-4 sm:p-5 border rounded-xl transition-all duration-300 cursor-pointer bg-gradient-to-r from-background to-muted/20"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-start gap-3 sm:gap-4">
                                <div
                                  className={`p-2 sm:p-3 rounded-full ${getEventColor(
                                    event.eventType
                                  )} flex-shrink-0`}
                                >
                                  <EventIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                                    <div className="min-w-0 flex-1">
                                      <h3 className="font-semibold text-base sm:text-lg capitalize truncate">
                                        {event.eventType
                                          .replace(/([A-Z])/g, " $1")
                                          .trim()}
                                        {event.classType && (
                                          <span className="hidden sm:inline ml-2 text-sm font-normal text-muted-foreground">
                                            Class {event.classType}
                                          </span>
                                        )}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <Badge
                                          className={`${severity.color} text-white text-xs`}
                                        >
                                          {severity.level}
                                        </Badge>
                                        {event.classType && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs sm:hidden"
                                          >
                                            Class {event.classType}
                                          </Badge>
                                        )}
                                        {event.activeRegionNum && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            AR {event.activeRegionNum}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-left sm:text-right text-sm text-muted-foreground flex-shrink-0">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-xs sm:text-sm">
                                          {formatDateTime(event.beginTime)}
                                        </span>
                                      </div>
                                      {event.sourceLocation && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <MapPin className="h-3 w-3" />
                                          <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                            {event.sourceLocation}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {event.note && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {event.note}
                                    </p>
                                  )}

                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                      {event.peakTime && (
                                        <span className="whitespace-nowrap">
                                          Peak: {formatDateTime(event.peakTime)}
                                        </span>
                                      )}
                                      {event.speed && (
                                        <span className="whitespace-nowrap">
                                          Speed: {event.speed} km/s
                                        </span>
                                      )}
                                      {event.kpIndex && (
                                        <span className="whitespace-nowrap">
                                          Kp Index: {event.kpIndex}
                                        </span>
                                      )}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto"
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sm:inline">
                                        View Details
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Load More Button */}
                        {hasMoreEvents && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center pt-6"
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
        <DialogContent
          className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col"
          showCloseButton={false}
        >
          {selectedEvent && (
            <>
              {/* Header */}
              <DialogHeader className="p-4 sm:p-6 border-b bg-muted/30 flex-shrink-0">
                <div className="flex justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 sm:p-3 rounded-full ${getEventColor(
                        selectedEvent.eventType
                      )} flex-shrink-0`}
                    >
                      {(() => {
                        const EventIcon = getEventIcon(selectedEvent.eventType);
                        return <EventIcon className="h-5 w-5 sm:h-6 sm:w-6" />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col items-start">
                      <DialogTitle className="text-lg sm:text-xl capitalize truncate">
                        {selectedEvent.eventType
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                        {selectedEvent.classType && (
                          <span className="hidden sm:inline">
                            {" "}
                            - Class {selectedEvent.classType}
                          </span>
                        )}
                      </DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm truncate">
                        Event ID: {selectedEvent.id}
                      </DialogDescription>
                      {selectedEvent.classType && (
                        <div className="sm:hidden mt-1">
                          <Badge variant="outline" className="text-xs">
                            Class {selectedEvent.classType}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedEvent(null)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Event Timeline */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">
                      Timeline
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200/50 dark:border-green-500/20">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Begin Time
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm break-all">
                            {formatDateTime(selectedEvent.beginTime)}
                          </p>
                        </CardContent>
                      </Card>

                      {selectedEvent.peakTime && (
                        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-500/20">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <span className="text-sm font-medium">
                                Peak Time
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm break-all">
                              {formatDateTime(selectedEvent.peakTime)}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {selectedEvent.endTime && (
                        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200/50 dark:border-red-500/20">
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-red-600 flex-shrink-0" />
                              <span className="text-sm font-medium">
                                End Time
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm break-all">
                              {formatDateTime(selectedEvent.endTime)}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Event Properties */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">
                      Event Properties
                    </h4>
                    <Card>
                      <CardContent className="p-4 sm:p-5">
                        <div className="space-y-3 text-sm">
                          {selectedEvent.activeRegionNum && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-muted-foreground font-medium">
                                Active Region:
                              </span>
                              <span className="font-mono">
                                AR {selectedEvent.activeRegionNum}
                              </span>
                            </div>
                          )}
                          {selectedEvent.sourceLocation && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-muted-foreground font-medium">
                                Source Location:
                              </span>
                              <span className="font-mono break-all">
                                {selectedEvent.sourceLocation}
                              </span>
                            </div>
                          )}
                          {selectedEvent.speed && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-muted-foreground font-medium">
                                Speed:
                              </span>
                              <span className="font-mono">
                                {selectedEvent.speed} km/s
                              </span>
                            </div>
                          )}
                          {selectedEvent.kpIndex && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-muted-foreground font-medium">
                                Kp Index:
                              </span>
                              <span className="font-mono">
                                {selectedEvent.kpIndex}
                              </span>
                            </div>
                          )}
                          {selectedEvent.halfAngle && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-muted-foreground font-medium">
                                Half Angle:
                              </span>
                              <span className="font-mono">
                                {selectedEvent.halfAngle}°
                              </span>
                            </div>
                          )}
                          {selectedEvent.latitude !== undefined &&
                            selectedEvent.longitude !== undefined && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                <span className="text-muted-foreground font-medium">
                                  Coordinates:
                                </span>
                                <span className="font-mono">
                                  {selectedEvent.latitude}°,{" "}
                                  {selectedEvent.longitude}°
                                </span>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Information */}
                  {selectedEvent.note && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm sm:text-base">
                        Additional Information
                      </h4>
                      <Card>
                        <CardContent className="p-4 sm:p-5">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedEvent.note}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Linked Events */}
                  {selectedEvent.linkedEvents &&
                    selectedEvent.linkedEvents.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">
                          Linked Events
                        </h4>
                        <Card>
                          <CardContent className="p-4 sm:p-5">
                            <div className="text-sm text-muted-foreground">
                              {selectedEvent.linkedEvents.length} related
                              event(s) found
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t bg-muted/30 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEvent(null)}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </Button>
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

export default SpaceWeatherDashboard;
