import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Eye, ShoppingBag, Phone, TrendingUp, TrendingDown, 
  Monitor, Smartphone, Tablet, Globe, RefreshCw, BarChart3,
  MousePointer, MessageCircle, Calendar
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_name: string | null;
  page_path: string | null;
  source: string | null;
  product_name: string | null;
  device_type: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

interface MetricCard {
  title: string;
  value: number;
  previousValue: number;
  icon: React.ReactNode;
  color: string;
}

const COLORS = {
  direct: "hsl(var(--chart-1))",
  organic: "hsl(var(--chart-2))",
  social: "hsl(var(--chart-3))",
  referral: "hsl(var(--chart-4))",
  desktop: "hsl(var(--chart-1))",
  mobile: "hsl(var(--chart-2))",
  tablet: "hsl(var(--chart-3))",
};

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = subDays(new Date(), daysAgo * 2).toISOString(); // Fetch double for comparison
      
      const { data, error } = await supabase
        .from("analytics_events")
        .select("id, event_type, event_name, page_path, source, product_name, device_type, country, city, created_at")
        .gte("created_at", startDate)
        .order("created_at", { ascending: false })
        .limit(10000);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const days = parseInt(dateRange);
    const now = new Date();
    const periodStart = startOfDay(subDays(now, days));
    const previousPeriodStart = startOfDay(subDays(now, days * 2));

    const currentEvents = events.filter(e => new Date(e.created_at) >= periodStart);
    const previousEvents = events.filter(e => {
      const date = new Date(e.created_at);
      return date >= previousPeriodStart && date < periodStart;
    });

    const getCount = (evts: AnalyticsEvent[], type?: string) => 
      type ? evts.filter(e => e.event_type === type).length : evts.length;

    const getUniqueVisitors = (evts: AnalyticsEvent[]) => 
      new Set(evts.filter(e => e.event_type === "page_view").map(e => e.id)).size;

    return {
      totalVisitors: {
        current: getCount(currentEvents, "page_view"),
        previous: getCount(previousEvents, "page_view"),
      },
      productViews: {
        current: getCount(currentEvents, "product_view"),
        previous: getCount(previousEvents, "product_view"),
      },
      productClicks: {
        current: getCount(currentEvents, "product_click"),
        previous: getCount(previousEvents, "product_click"),
      },
      callClicks: {
        current: getCount(currentEvents, "call_click"),
        previous: getCount(previousEvents, "call_click"),
      },
      whatsappClicks: {
        current: getCount(currentEvents, "whatsapp_click"),
        previous: getCount(previousEvents, "whatsapp_click"),
      },
    };
  }, [events, dateRange]);

  // Traffic over time
  const trafficData = useMemo(() => {
    const days = parseInt(dateRange);
    const now = new Date();
    const periodStart = startOfDay(subDays(now, days));
    
    const dateRange2 = eachDayOfInterval({ start: periodStart, end: now });
    
    return dateRange2.map(date => {
      const dayEvents = events.filter(e => {
        const eventDate = new Date(e.created_at);
        return startOfDay(eventDate).getTime() === startOfDay(date).getTime();
      });
      
      return {
        date: format(date, "MMM dd"),
        visits: dayEvents.filter(e => e.event_type === "page_view").length,
        products: dayEvents.filter(e => e.event_type === "product_view").length,
      };
    });
  }, [events, dateRange]);

  // Traffic sources
  const sourceData = useMemo(() => {
    const days = parseInt(dateRange);
    const periodStart = startOfDay(subDays(new Date(), days));
    const currentEvents = events.filter(e => new Date(e.created_at) >= periodStart);
    
    const sources: Record<string, number> = { direct: 0, organic: 0, social: 0, referral: 0 };
    currentEvents.forEach(e => {
      const source = e.source || "direct";
      if (sources[source] !== undefined) {
        sources[source]++;
      } else {
        sources.direct++;
      }
    });

    const total = Object.values(sources).reduce((a, b) => a + b, 0) || 1;
    
    return Object.entries(sources).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: Math.round((value / total) * 100),
      fill: COLORS[name as keyof typeof COLORS] || COLORS.direct,
    }));
  }, [events, dateRange]);

  // Device breakdown
  const deviceData = useMemo(() => {
    const days = parseInt(dateRange);
    const periodStart = startOfDay(subDays(new Date(), days));
    const currentEvents = events.filter(e => new Date(e.created_at) >= periodStart);
    
    const devices: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    currentEvents.forEach(e => {
      const device = e.device_type || "desktop";
      if (devices[device] !== undefined) {
        devices[device]++;
      }
    });

    const total = Object.values(devices).reduce((a, b) => a + b, 0) || 1;
    
    return Object.entries(devices).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: Math.round((value / total) * 100),
      fill: COLORS[name as keyof typeof COLORS] || COLORS.desktop,
    }));
  }, [events, dateRange]);

  // Top products
  const topProducts = useMemo(() => {
    const days = parseInt(dateRange);
    const periodStart = startOfDay(subDays(new Date(), days));
    const currentEvents = events.filter(e => 
      new Date(e.created_at) >= periodStart && 
      (e.event_type === "product_view" || e.event_type === "product_click") &&
      e.product_name
    );
    
    const productCounts: Record<string, { views: number; clicks: number }> = {};
    currentEvents.forEach(e => {
      const name = e.product_name!;
      if (!productCounts[name]) {
        productCounts[name] = { views: 0, clicks: 0 };
      }
      if (e.event_type === "product_view") productCounts[name].views++;
      if (e.event_type === "product_click") productCounts[name].clicks++;
    });

    return Object.entries(productCounts)
      .map(([name, counts]) => ({ name, ...counts, total: counts.views + counts.clicks }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [events, dateRange]);

  // Top locations
  const topLocations = useMemo(() => {
    const days = parseInt(dateRange);
    const periodStart = startOfDay(subDays(new Date(), days));
    const currentEvents = events.filter(e => 
      new Date(e.created_at) >= periodStart && e.city
    );
    
    const locationCounts: Record<string, number> = {};
    currentEvents.forEach(e => {
      const location = `${e.city}, ${e.country}`;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [events, dateRange]);

  // Recent activity
  const recentActivity = useMemo(() => {
    return events.slice(0, 10).map(e => ({
      ...e,
      timeAgo: getTimeAgo(new Date(e.created_at)),
    }));
  }, [events]);

  const getPercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                <p className="text-sm text-muted-foreground">Track your website performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as "7" | "30" | "90")}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchAnalytics} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Page Views"
          value={metrics.totalVisitors.current}
          previousValue={metrics.totalVisitors.previous}
          icon={<Eye className="w-5 h-5" />}
          color="text-blue-500"
        />
        <MetricCard
          title="Product Views"
          value={metrics.productViews.current}
          previousValue={metrics.productViews.previous}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="text-purple-500"
        />
        <MetricCard
          title="Product Clicks"
          value={metrics.productClicks.current}
          previousValue={metrics.productClicks.previous}
          icon={<MousePointer className="w-5 h-5" />}
          color="text-orange-500"
        />
        <MetricCard
          title="Call Clicks"
          value={metrics.callClicks.current}
          previousValue={metrics.callClicks.previous}
          icon={<Phone className="w-5 h-5" />}
          color="text-green-500"
        />
        <MetricCard
          title="WhatsApp"
          value={metrics.whatsappClicks.current}
          previousValue={metrics.whatsappClicks.previous}
          icon={<MessageCircle className="w-5 h-5" />}
          color="text-emerald-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Traffic Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVisits)" name="Page Views" />
                  <Area type="monotone" dataKey="products" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorProducts)" name="Product Views" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }} />
                  <span className="text-muted-foreground">{source.name}</span>
                  <span className="font-medium ml-auto">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceData.map((device) => (
              <div key={device.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {device.name === "Desktop" && <Monitor className="w-4 h-4 text-muted-foreground" />}
                    {device.name === "Mobile" && <Smartphone className="w-4 h-4 text-muted-foreground" />}
                    {device.name === "Tablet" && <Tablet className="w-4 h-4 text-muted-foreground" />}
                    <span>{device.name}</span>
                  </div>
                  <span className="font-medium">{device.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${device.percentage}%`, backgroundColor: device.fill }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No product data yet</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.views} views · {product.clicks} clicks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topLocations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No location data yet</p>
            ) : (
              <div className="space-y-3">
                {topLocations.map((loc) => (
                  <div key={loc.location} className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{loc.location}</span>
                    <span className="text-sm font-medium text-muted-foreground ml-2">{loc.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity recorded yet</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 text-sm">
                  <div className={`p-1.5 rounded-full ${getActivityColor(activity.event_type)}`}>
                    {getActivityIcon(activity.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{getActivityLabel(activity)}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.city && `${activity.city} · `}{activity.device_type} · {activity.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, previousValue, icon, color }: MetricCard) {
  const change = previousValue === 0 ? (value > 0 ? 100 : 0) : Math.round(((value - previousValue) / previousValue) * 100);
  const isPositive = change >= 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={color}>{icon}</span>
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        </div>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getActivityIcon(eventType: string) {
  switch (eventType) {
    case "page_view": return <Eye className="w-3 h-3" />;
    case "product_view": return <ShoppingBag className="w-3 h-3" />;
    case "product_click": return <MousePointer className="w-3 h-3" />;
    case "call_click": return <Phone className="w-3 h-3" />;
    case "whatsapp_click": return <MessageCircle className="w-3 h-3" />;
    default: return <Eye className="w-3 h-3" />;
  }
}

function getActivityColor(eventType: string): string {
  switch (eventType) {
    case "page_view": return "bg-blue-500/10 text-blue-500";
    case "product_view": return "bg-purple-500/10 text-purple-500";
    case "product_click": return "bg-orange-500/10 text-orange-500";
    case "call_click": return "bg-green-500/10 text-green-500";
    case "whatsapp_click": return "bg-emerald-500/10 text-emerald-500";
    default: return "bg-muted text-muted-foreground";
  }
}

function getActivityLabel(activity: AnalyticsEvent): string {
  switch (activity.event_type) {
    case "page_view": return `Viewed ${activity.page_path || "page"}`;
    case "product_view": return `Viewed ${activity.product_name || "product"}`;
    case "product_click": return `Clicked ${activity.product_name || "product"}`;
    case "call_click": return `Call button clicked`;
    case "whatsapp_click": return `WhatsApp button clicked`;
    default: return activity.event_type;
  }
}
