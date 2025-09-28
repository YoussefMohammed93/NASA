"use client";

import {
  Calendar,
  AlertTriangle,
  Shield,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "./ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface NEOData {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
    };
    orbiting_body: string;
  }>;
}

interface NEOResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NEOData[];
  };
}

type SortField = "name" | "size" | "distance" | "velocity" | "date";
type SortDirection = "asc" | "desc";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const parseDate = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00");
};

export default function NEODashboard() {
  const [neoData, setNeoData] = useState<NEOResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterHazardous, setFilterHazardous] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNEOData = async (start: Date, end: Date) => {
    try {
      setLoading(true);
      setError(null);

      const startStr = formatDate(start);
      const endStr = formatDate(end);

      const response = await fetch(
        `/api/neo?start_date=${startStr}&end_date=${endStr}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch NEO data: ${response.statusText}`);
      }

      const data: NEOResponse = await response.json();
      setNeoData(data);
    } catch (err) {
      console.error("Error fetching NEO data:", err);
      setError(err instanceof Error ? err.message : "Failed to load NEO data");
      toast.error("Failed to load asteroid data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNEOData(startDate, endDate);
  }, [startDate, endDate]);

  const handleDateChange = (type: "start" | "end", value: string) => {
    const newDate = parseDate(value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7); // NASA NEO API allows up to 7 days

    if (newDate > maxDate) {
      toast.error("Date range cannot exceed 7 days from today");
      return;
    }

    if (type === "start") {
      if (newDate <= endDate) {
        setStartDate(newDate);
      } else {
        toast.error("Start date must be before end date");
      }
    } else {
      if (newDate >= startDate) {
        setEndDate(newDate);
      } else {
        toast.error("End date must be after start date");
      }
    }
  };

  const getAllNEOs = (): NEOData[] => {
    if (!neoData) return [];

    const allNEOs: NEOData[] = [];
    Object.values(neoData.near_earth_objects).forEach((dateNEOs) => {
      allNEOs.push(...dateNEOs);
    });

    return allNEOs;
  };

  const getFilteredAndSortedNEOs = (): NEOData[] => {
    let neos = getAllNEOs();

    // Apply search filter
    if (searchTerm) {
      neos = neos.filter((neo) =>
        neo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply hazardous filter
    if (filterHazardous !== null) {
      neos = neos.filter(
        (neo) => neo.is_potentially_hazardous_asteroid === filterHazardous
      );
    }

    // Apply sorting
    neos.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "size":
          aValue = a.estimated_diameter.kilometers.estimated_diameter_max;
          bValue = b.estimated_diameter.kilometers.estimated_diameter_max;
          break;
        case "distance":
          aValue = parseFloat(
            a.close_approach_data[0]?.miss_distance.kilometers || "0"
          );
          bValue = parseFloat(
            b.close_approach_data[0]?.miss_distance.kilometers || "0"
          );
          break;
        case "velocity":
          aValue = parseFloat(
            a.close_approach_data[0]?.relative_velocity.kilometers_per_hour ||
              "0"
          );
          bValue = parseFloat(
            b.close_approach_data[0]?.relative_velocity.kilometers_per_hour ||
              "0"
          );
          break;
        case "date":
          aValue = new Date(
            a.close_approach_data[0]?.close_approach_date || ""
          ).getTime();
          bValue = new Date(
            b.close_approach_data[0]?.close_approach_date || ""
          ).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return neos;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getRiskLevel = (neo: NEOData): "low" | "medium" | "high" => {
    if (neo.is_potentially_hazardous_asteroid) return "high";

    const size = neo.estimated_diameter.kilometers.estimated_diameter_max;
    const distance = parseFloat(
      neo.close_approach_data[0]?.miss_distance.lunar || "999"
    );

    if (size > 1 || distance < 10) return "medium";
    return "low";
  };

  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20";
    }
  };

  const getRiskIcon = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-3 w-3" />;
      case "medium":
        return <Zap className="h-3 w-3" />;
      case "low":
        return <Shield className="h-3 w-3" />;
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-medium text-xs"
    >
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp className="h-3 w-3 ml-1" />
        ) : (
          <ChevronDown className="h-3 w-3 ml-1" />
        ))}
    </Button>
  );

  const filteredNEOs = getFilteredAndSortedNEOs();
  const hazardousCount = getAllNEOs().filter(
    (neo) => neo.is_potentially_hazardous_asteroid
  ).length;
  const totalCount = getAllNEOs().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-blue-100/20 dark:from-background dark:via-blue-950/20 dark:to-blue-900/10">
      <Header />
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-blue-700 dark:from-blue-500/25 dark:via-blue-600/20 dark:to-blue-700/15 border-b">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white/90 dark:text-blue-100/90">
              NEO Dashboard
            </h1>
            <p className="text-lg text-white/90 dark:text-blue-100/90 max-w-2xl mx-auto">
              Track near-Earth asteroids and comets. Monitor potentially
              hazardous objects and their approach dates.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={formatDate(startDate)}
                onChange={(e) => handleDateChange("start", e.target.value)}
                max={formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
                className="px-3 rounded-lg text-sm w-auto"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={formatDate(endDate)}
                onChange={(e) => handleDateChange("end", e.target.value)}
                max={formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
                className="px-3 rounded-lg text-sm w-auto"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search asteroids..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
              />
            </div>
            <Button
              variant={filterHazardous === true ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setFilterHazardous(filterHazardous === true ? null : true)
              }
              className="rounded-lg dark:text-foreground !py-4.5"
            >
              <Filter className="h-3 w-3 mr-1" />
              Hazardous
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Objects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : totalCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Potentially Hazardous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? <Skeleton className="h-8 w-16" /> : hazardousCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Filtered Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  filteredNEOs.length
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Near Earth Objects</CardTitle>
              <CardDescription>
                Asteroids and comets approaching Earth in the selected date
                range
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/30 text-sm font-medium min-w-[800px]">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <div className="max-h-80 overflow-auto">
                        <div className="min-w-[800px]">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-6 gap-4 p-4 border-b"
                            >
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-28" />
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden">
                      <div className="max-h-96 overflow-auto">
                        <div className="min-w-[800px]">
                          <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/30 text-sm font-medium">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="grid grid-cols-6 gap-4 p-4 border-b"
                              >
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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
                      Failed to Load NEO Data
                    </h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => fetchNEOData(startDate, endDate)}>
                      <Loader2 className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/30 text-sm font-medium min-w-[800px]">
                          <div className="flex items-center">
                            <SortButton field="name">Name</SortButton>
                          </div>
                          <div className="flex items-center">
                            <SortButton field="size">Size (km)</SortButton>
                          </div>
                          <div className="flex items-center">
                            <SortButton field="distance">Distance</SortButton>
                          </div>
                          <div className="flex items-center">
                            <SortButton field="velocity">Velocity</SortButton>
                          </div>
                          <div className="flex items-center">
                            <SortButton field="date">Approach Date</SortButton>
                          </div>
                          <div>Risk Level</div>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-auto">
                        <div className="min-w-[800px]">
                          {filteredNEOs.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No asteroids found matching your criteria</p>
                            </div>
                          ) : (
                            filteredNEOs.map((neo, index) => {
                              const riskLevel = getRiskLevel(neo);
                              const approach = neo.close_approach_data[0];

                              return (
                                <motion.div
                                  key={neo.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                                >
                                  <div className="font-medium text-sm">
                                    {neo.name.replace(/[()]/g, "")}
                                  </div>
                                  <div className="text-sm">
                                    {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                                      2
                                    )}{" "}
                                    -{" "}
                                    {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                                      2
                                    )}
                                  </div>
                                  <div className="text-sm">
                                    {approach
                                      ? `${formatNumber(
                                          parseFloat(
                                            approach.miss_distance.kilometers
                                          )
                                        )} km`
                                      : "N/A"}
                                  </div>
                                  <div className="text-sm">
                                    {approach
                                      ? `${formatNumber(
                                          parseFloat(
                                            approach.relative_velocity
                                              .kilometers_per_hour
                                          )
                                        )} km/h`
                                      : "N/A"}
                                  </div>
                                  <div className="text-sm">
                                    {approach
                                      ? new Date(
                                          approach.close_approach_date
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                  <div>
                                    <Badge
                                      variant="outline"
                                      className={`${getRiskColor(
                                        riskLevel
                                      )} text-xs`}
                                    >
                                      {getRiskIcon(riskLevel)}
                                      <span className="ml-1 capitalize">
                                        {riskLevel}
                                      </span>
                                    </Badge>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden">
                      <div className="max-h-96 overflow-auto">
                        <div className="min-w-[800px]">
                          <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/30 text-sm font-medium">
                            <div className="flex items-center">
                              <SortButton field="name">Name</SortButton>
                            </div>
                            <div className="flex items-center">
                              <SortButton field="size">Size (km)</SortButton>
                            </div>
                            <div className="flex items-center">
                              <SortButton field="distance">Distance</SortButton>
                            </div>
                            <div className="flex items-center">
                              <SortButton field="velocity">Velocity</SortButton>
                            </div>
                            <div className="flex items-center">
                              <SortButton field="date">
                                Approach Date
                              </SortButton>
                            </div>
                            <div>Risk Level</div>
                          </div>
                          <div>
                            {filteredNEOs.length === 0 ? (
                              <div className="p-8 text-center text-muted-foreground">
                                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No asteroids found matching your criteria</p>
                              </div>
                            ) : (
                              filteredNEOs.map((neo, index) => {
                                const riskLevel = getRiskLevel(neo);
                                const approach = neo.close_approach_data[0];

                                return (
                                  <motion.div
                                    key={neo.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="font-medium text-sm">
                                      {neo.name.replace(/[()]/g, "")}
                                    </div>
                                    <div className="text-sm">
                                      {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                                        2
                                      )}{" "}
                                      -{" "}
                                      {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                                        2
                                      )}
                                    </div>
                                    <div className="text-sm">
                                      {approach
                                        ? `${formatNumber(
                                            parseFloat(
                                              approach.miss_distance.kilometers
                                            )
                                          )} km`
                                        : "N/A"}
                                    </div>
                                    <div className="text-sm">
                                      {approach
                                        ? `${formatNumber(
                                            parseFloat(
                                              approach.relative_velocity
                                                .kilometers_per_hour
                                            )
                                          )} km/h`
                                        : "N/A"}
                                    </div>
                                    <div className="text-sm">
                                      {approach
                                        ? new Date(
                                            approach.close_approach_date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </div>
                                    <div>
                                      <Badge
                                        variant="outline"
                                        className={`${getRiskColor(
                                          riskLevel
                                        )} text-xs`}
                                      >
                                        {getRiskIcon(riskLevel)}
                                        <span className="ml-1 capitalize">
                                          {riskLevel}
                                        </span>
                                      </Badge>
                                    </div>
                                  </motion.div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
