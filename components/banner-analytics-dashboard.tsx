'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  Calendar,
  Clock,
  Users,
  MapPin,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { bannerAPI } from '@/lib/api/bannerAPI';

interface AnalyticsData {
  overview: {
    totalBanners: number;
    activeBanners: number;
    totalClicks: number;
    totalImpressions: number;
    averageCTR: number;
    topPerformingBanner: string;
  };
  performanceByPosition: Array<{
    position: string;
    count: number;
    clicks: number;
    impressions: number;
    ctr: number;
  }>;
  performanceByStatus: Array<{
    status: string;
    count: number;
  }>;
  clickTrends: Array<{
    date: string;
    clicks: number;
    impressions: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    clicks: number;
    impressions: number;
    percentage: number;
  }>;
  topBanners: Array<{
    id: string;
    title: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: string;
  }>;
}

export function BannerAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('ctr');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      const response = await bannerAPI.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'ctr':
        return <Target className="h-4 w-4" />;
      case 'clicks':
        return <MousePointer className="h-4 w-4" />;
      case 'impressions':
        return <Eye className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'ctr':
        return 'text-green-600';
      case 'clicks':
        return 'text-blue-600';
      case 'impressions':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-3 w-3 text-green-600" />;
    if (value < 0) return <ArrowDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Banners', analyticsData.overview.totalBanners],
      ['Active Banners', analyticsData.overview.activeBanners],
      ['Total Clicks', analyticsData.overview.totalClicks],
      ['Total Impressions', analyticsData.overview.totalImpressions],
      ['Average CTR', `${analyticsData.overview.averageCTR}%`],
      ['Top Performing Banner', analyticsData.overview.topPerformingBanner]
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `banner-analytics-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banner Analytics</h2>
          <p className="text-gray-600">Performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm text-sm">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalyticsData}
            className="bg-white/60 backdrop-blur-sm border-white/50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={exportAnalytics}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Banners
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {analyticsData.overview.totalBanners}
            </div>
            <p className="text-xs text-blue-600">
              {analyticsData.overview.activeBanners} active
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Clicks
            </CardTitle>
            <MousePointer className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatNumber(analyticsData.overview.totalClicks)}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Impressions
            </CardTitle>
            <Eye className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatNumber(analyticsData.overview.totalImpressions)}
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <TrendingUp className="h-3 w-3" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Average CTR
            </CardTitle>
            <Target className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {analyticsData.overview.averageCTR}%
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <TrendingUp className="h-3 w-3" />
              +2.1% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance by Position */}
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              Performance by Position
            </CardTitle>
            <CardDescription>
              Click-through rates by banner position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.performanceByPosition.map((item, index) => (
              <div key={item.position} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {item.position}
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {item.count} banners
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.ctr}% CTR
                  </span>
                </div>
                <Progress value={item.ctr} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatNumber(item.clicks)} clicks</span>
                  <span>{formatNumber(item.impressions)} impressions</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              Device Breakdown
            </CardTitle>
            <CardDescription>
              Performance across different devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.deviceBreakdown.map((item, index) => (
              <div key={item.device} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.device === 'mobile' ? (
                      <Smartphone className="h-4 w-4 text-green-600" />
                    ) : (
                      <Monitor className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {item.device}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {item.percentage}%
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatNumber(item.clicks)} clicks</span>
                  <span>{formatNumber(item.impressions)} impressions</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Banners */}
      <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Top Performing Banners
          </CardTitle>
          <CardDescription>
            Banners with the highest click-through rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topBanners.map((banner, index) => (
              <div
                key={banner.id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {banner.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {banner.position}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatNumber(banner.impressions)} impressions
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {banner.ctr}% CTR
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(banner.clicks)} clicks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




