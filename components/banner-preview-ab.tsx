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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Eye,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Users,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface BannerPreviewProps {
  banner: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    position: 'top' | 'middle' | 'bottom' | 'sidebar';
    status: 'active' | 'inactive' | 'scheduled';
    priority: number;
    targetAudience: 'all' | 'applicants' | 'employers' | 'admin';
    clicks: number;
    impressions: number;
  };
  onClose?: () => void;
  isModal?: boolean;
}

export function BannerPreview({
  banner,
  onClose,
  isModal = false
}: BannerPreviewProps) {
  const [previewMode, setPreviewMode] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '320px', height: '200px' };
      case 'tablet':
        return { width: '768px', height: '300px' };
      default:
        return { width: '100%', height: '400px' };
    }
  };

  const getPositionStyles = () => {
    switch (banner.position) {
      case 'top':
        return 'rounded-b-lg';
      case 'middle':
        return 'rounded-lg';
      case 'bottom':
        return 'rounded-t-lg';
      case 'sidebar':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };

  const calculateCTR = () => {
    if (banner.impressions === 0) return 0;
    return ((banner.clicks / banner.impressions) * 100).toFixed(2);
  };

  const PreviewContent = () => (
    <div className="relative group">
      <div
        className={`relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer ${getPositionStyles()}`}
        style={getPreviewDimensions()}>
        {/* Banner Image */}
        <div className="relative h-full w-full">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

          {/* Banner Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-center">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-lg">
              {banner.title}
            </h3>
            <p className="text-sm md:text-base text-white/90 drop-shadow-md line-clamp-2">
              {banner.description}
            </p>
            {banner.linkUrl && (
              <div className="mt-2 flex items-center text-white/80 text-sm">
                Learn more →
              </div>
            )}
          </div>
        </div>

        {/* Preview Controls Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white rounded-full"
              onClick={() => setShowMetrics(!showMetrics)}>
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metrics Overlay */}
        {showMetrics && (
          <div className="absolute bottom-2 left-2 bg-black/80 text-white p-2 rounded-lg text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {banner.impressions}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {banner.clicks}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {calculateCTR()}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-5xl w-full max-h-[90vh] overflow-hidden relative z-10">
          <div className="p-6 border-b border-white/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Banner Preview
                </h2>
                <p className="text-gray-600">
                  Preview how your banner will appear to users
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMetrics(!showMetrics)}
                  className="bg-white/60 backdrop-blur-sm border-white/50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {showMetrics ? 'Hide' : 'Show'} Metrics
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-white/60 backdrop-blur-sm">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50/50 via-white/50 to-blue-50/50">
            <div className="space-y-6">
              {/* Device Preview Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className={
                    previewMode === 'desktop'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                      : 'bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80'
                  }>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                  className={
                    previewMode === 'tablet'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                      : 'bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80'
                  }>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Tablet
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className={
                    previewMode === 'mobile'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                      : 'bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80'
                  }>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>

              {/* Preview Container */}
              <div className="flex justify-center">
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-white/60 backdrop-blur-sm">
                  <PreviewContent />
                </div>
              </div>

              {/* Banner Details */}
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Banner Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Title
                      </Label>
                      <p className="text-sm text-gray-900">{banner.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Position
                      </Label>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {banner.position}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Status
                      </Label>
                      <Badge
                        className={`text-xs ${
                          banner.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                        {banner.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Priority
                      </Label>
                      <p className="text-sm text-gray-900">{banner.priority}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Target Audience
                      </Label>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        {banner.targetAudience}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        CTR
                      </Label>
                      <p className="text-sm font-bold text-gray-900">
                        {calculateCTR()}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <p className="text-sm text-gray-900">
                      {banner.description}
                    </p>
                  </div>

                  {banner.linkUrl && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Link URL
                      </Label>
                      <p className="text-sm text-blue-600 break-all">
                        {banner.linkUrl}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              {showMetrics && (
                <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 bg-blue-50/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {banner.clicks}
                        </div>
                        <div className="text-sm text-gray-600">Clicks</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {banner.impressions}
                        </div>
                        <div className="text-sm text-gray-600">Impressions</div>
                      </div>
                      <div className="text-center p-4 bg-green-50/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {calculateCTR()}%
                        </div>
                        <div className="text-sm text-gray-600">CTR</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          Banner Preview
        </CardTitle>
        <CardDescription>
          Preview how your banner will appear to users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Preview Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className="bg-white/60 backdrop-blur-sm border-white/50">
            <Maximize2 className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={previewMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('tablet')}
            className="bg-white/60 backdrop-blur-sm border-white/50">
            <Minimize2 className="h-4 w-4 mr-2" />
            Tablet
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="bg-white/60 backdrop-blur-sm border-white/50">
            <Minimize2 className="h-4 w-4 mr-2" />
            Mobile
          </Button>
        </div>

        {/* Preview Container */}
        <div className="flex justify-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <PreviewContent />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// A/B Testing Component
interface ABTestProps {
  banners: Array<{
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    position: 'top' | 'middle' | 'bottom' | 'sidebar';
    status: 'active' | 'inactive' | 'scheduled';
    priority: number;
    targetAudience: 'all' | 'applicants' | 'employers' | 'admin';
    clicks: number;
    impressions: number;
  }>;
  onStartTest?: (bannerIds: string[]) => void;
  onStopTest?: () => void;
}

export function ABTestManager({
  banners,
  onStartTest,
  onStopTest
}: ABTestProps) {
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [testConfig, setTestConfig] = useState({
    name: '',
    description: '',
    trafficSplit: 50,
    duration: 7,
    successMetric: 'ctr' as 'ctr' | 'clicks' | 'conversions'
  });
  const [isTestRunning, setIsTestRunning] = useState(false);

  const toggleBannerSelection = (bannerId: string) => {
    setSelectedBanners(prev =>
      prev.includes(bannerId)
        ? prev.filter(id => id !== bannerId)
        : [...prev, bannerId]
    );
  };

  const startABTest = () => {
    if (selectedBanners.length < 2) {
      alert('Please select at least 2 banners for A/B testing');
      return;
    }

    if (!testConfig.name.trim()) {
      alert('Please enter a test name');
      return;
    }

    setIsTestRunning(true);
    onStartTest?.(selectedBanners);
  };

  const stopABTest = () => {
    setIsTestRunning(false);
    onStopTest?.();
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          A/B Testing
        </CardTitle>
        <CardDescription>
          Test different banner variations to optimize performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isTestRunning ? (
          <>
            {/* Test Configuration */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  value={testConfig.name}
                  onChange={e =>
                    setTestConfig(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter test name"
                  className="bg-white/60 backdrop-blur-sm border-white/50"
                />
              </div>

              <div>
                <Label htmlFor="testDescription">Description</Label>
                <Textarea
                  id="testDescription"
                  value={testConfig.description}
                  onChange={e =>
                    setTestConfig(prev => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder="Describe what you're testing"
                  className="bg-white/60 backdrop-blur-sm border-white/50"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="trafficSplit">Traffic Split (%)</Label>
                  <Input
                    id="trafficSplit"
                    type="number"
                    min="10"
                    max="90"
                    value={testConfig.trafficSplit}
                    onChange={e =>
                      setTestConfig(prev => ({
                        ...prev,
                        trafficSplit: parseInt(e.target.value)
                      }))
                    }
                    className="bg-white/60 backdrop-blur-sm border-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="30"
                    value={testConfig.duration}
                    onChange={e =>
                      setTestConfig(prev => ({
                        ...prev,
                        duration: parseInt(e.target.value)
                      }))
                    }
                    className="bg-white/60 backdrop-blur-sm border-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="successMetric">Success Metric</Label>
                  <select
                    id="successMetric"
                    value={testConfig.successMetric}
                    onChange={e =>
                      setTestConfig(prev => ({
                        ...prev,
                        successMetric: e.target.value as any
                      }))
                    }
                    className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                    <option value="ctr">Click-through Rate</option>
                    <option value="clicks">Total Clicks</option>
                    <option value="conversions">Conversions</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Banner Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Select Banners to Test ({selectedBanners.length}/2+ selected)
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {banners.map(banner => (
                  <div
                    key={banner._id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedBanners.includes(banner._id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white/40 border-white/50 hover:bg-white/60'
                    }`}
                    onClick={() => toggleBannerSelection(banner._id)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {banner.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {banner.position} • {banner.clicks} clicks
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {banner.status}
                      </Badge>
                      {selectedBanners.includes(banner._id) && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Test Button */}
            <Button
              onClick={startABTest}
              disabled={selectedBanners.length < 2}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg">
              <Zap className="h-4 w-4 mr-2" />
              Start A/B Test
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">A/B Test Running</span>
            </div>
            <p className="text-sm text-gray-600">
              Testing {selectedBanners.length} banner variations
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Duration: {testConfig.duration} days</span>
              <span>•</span>
              <span>Split: {testConfig.trafficSplit}%</span>
              <span>•</span>
              <span>Metric: {testConfig.successMetric}</span>
            </div>
            <Button
              onClick={stopABTest}
              variant="outline"
              className="bg-white/60 backdrop-blur-sm border-white/50">
              <Pause className="h-4 w-4 mr-2" />
              Stop Test
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
