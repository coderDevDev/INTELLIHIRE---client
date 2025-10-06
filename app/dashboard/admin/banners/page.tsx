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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Link,
  Target,
  Zap,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { toast } from 'sonner';

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  status: 'active' | 'inactive' | 'scheduled';
  priority: number;
  startDate?: string;
  endDate?: string;
  targetAudience: 'all' | 'applicants' | 'employers' | 'admin';
  clicks: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

interface BannerTemplate {
  _id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [templates, setTemplates] = useState<BannerTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage');
  
  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'top' as const,
    priority: 1,
    startDate: '',
    endDate: '',
    targetAudience: 'all' as const
  });

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in real implementation, fetch from API
      const mockBanners: Banner[] = [
        {
          _id: '1',
          title: 'New Job Opportunities',
          description: 'Discover exciting career opportunities',
          imageUrl: '/api/placeholder/800/200',
          linkUrl: '/jobs',
          position: 'top',
          status: 'active',
          priority: 1,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          targetAudience: 'all',
          clicks: 245,
          impressions: 1250,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        },
        {
          _id: '2',
          title: 'System Maintenance',
          description: 'Scheduled maintenance on Sunday',
          imageUrl: '/api/placeholder/800/200',
          linkUrl: '/maintenance',
          position: 'middle',
          status: 'scheduled',
          priority: 2,
          startDate: '2024-01-21',
          endDate: '2024-01-22',
          targetAudience: 'all',
          clicks: 0,
          impressions: 0,
          createdAt: '2024-01-18T14:00:00Z',
          updatedAt: '2024-01-18T14:00:00Z'
        },
        {
          _id: '3',
          title: 'Employer Portal',
          description: 'Post jobs and find talent',
          imageUrl: '/api/placeholder/800/200',
          linkUrl: '/employer',
          position: 'sidebar',
          status: 'inactive',
          priority: 3,
          targetAudience: 'employers',
          clicks: 89,
          impressions: 456,
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z'
        }
      ];

      const mockTemplates: BannerTemplate[] = [
        {
          _id: '1',
          name: 'Job Promotion',
          title: 'New Job Opportunities',
          description: 'Discover exciting career opportunities',
          imageUrl: '/api/placeholder/800/200',
          category: 'jobs',
          createdAt: '2024-01-10T10:00:00Z'
        },
        {
          _id: '2',
          name: 'System Notice',
          title: 'System Maintenance',
          description: 'Scheduled maintenance notice',
          imageUrl: '/api/placeholder/800/200',
          category: 'system',
          createdAt: '2024-01-12T14:00:00Z'
        }
      ];

      setBanners(mockBanners);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching banner data:', error);
      toast.error('Failed to load banner data');
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async () => {
    if (!bannerForm.title || !bannerForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newBanner: Banner = {
        _id: Date.now().toString(),
        title: bannerForm.title,
        description: bannerForm.description,
        imageUrl: bannerForm.imageUrl || '/api/placeholder/800/200',
        linkUrl: bannerForm.linkUrl,
        position: bannerForm.position,
        status: 'active',
        priority: bannerForm.priority,
        startDate: bannerForm.startDate,
        endDate: bannerForm.endDate,
        targetAudience: bannerForm.targetAudience,
        clicks: 0,
        impressions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setBanners(prev => [newBanner, ...prev]);
      
      // Reset form
      setBannerForm({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        position: 'top',
        priority: 1,
        startDate: '',
        endDate: '',
        targetAudience: 'all'
      });

      toast.success('Banner created successfully');
    } catch (error) {
      toast.error('Failed to create banner');
    }
  };

  const toggleBannerStatus = async (bannerId: string) => {
    try {
      setBanners(prev => prev.map(banner => 
        banner._id === bannerId 
          ? { 
              ...banner, 
              status: banner.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date().toISOString()
            }
          : banner
      ));
      
      toast.success('Banner status updated');
    } catch (error) {
      toast.error('Failed to update banner status');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        setBanners(prev => prev.filter(banner => banner._id !== bannerId));
        toast.success('Banner deleted successfully');
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'top':
        return <Monitor className="h-4 w-4" />;
      case 'middle':
        return <Tablet className="h-4 w-4" />;
      case 'bottom':
        return <Smartphone className="h-4 w-4" />;
      case 'sidebar':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading banner data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Banner Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage promotional banners and announcements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBannerData}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab('create')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Banner
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Banners
                </CardTitle>
                <Image className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {banners.length}
                </div>
                <p className="text-xs text-blue-600">All banners</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Banners
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {banners.filter(b => b.status === 'active').length}
                </div>
                <p className="text-xs text-green-600">Currently showing</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Clicks
                </CardTitle>
                <Target className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {banners.reduce((sum, b) => sum + b.clicks, 0)}
                </div>
                <p className="text-xs text-purple-600">All time clicks</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Avg CTR
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {(() => {
                    const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
                    const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
                    return calculateCTR(totalClicks, totalImpressions);
                  })()}%
                </div>
                <p className="text-xs text-orange-600">Click-through rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Banner Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger value="manage" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Manage
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Create
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Templates
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Manage Tab */}
            <TabsContent value="manage" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Banner Management
                  </CardTitle>
                  <CardDescription>
                    Manage your promotional banners and track their performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {banners.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No banners found</p>
                    </div>
                  ) : (
                    banners.map((banner) => (
                      <div
                        key={banner._id}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {banner.title}
                              </h4>
                              <Badge className={`text-xs ${getStatusColor(banner.status)}`}>
                                {getStatusIcon(banner.status)}
                                {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                {getPositionIcon(banner.position)}
                                {banner.position}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Priority: {banner.priority}</span>
                              <span>•</span>
                              <span>Target: {banner.targetAudience}</span>
                              <span>•</span>
                              <span>Created: {formatDate(banner.createdAt)}</span>
                              {banner.startDate && (
                                <>
                                  <span>•</span>
                                  <span>Start: {formatDate(banner.startDate)}</span>
                                </>
                              )}
                              {banner.endDate && (
                                <>
                                  <span>•</span>
                                  <span>End: {formatDate(banner.endDate)}</span>
                                </>
                              )}
                            </div>
                            {banner.status === 'active' && (
                              <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                                <span>Clicks: {banner.clicks}</span>
                                <span>Impressions: {banner.impressions}</span>
                                <span>CTR: {calculateCTR(banner.clicks, banner.impressions)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/60 backdrop-blur-sm border-white/50">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBannerStatus(banner._id)}
                            className="bg-white/60 backdrop-blur-sm border-white/50">
                            <Edit className="h-4 w-4 mr-2" />
                            {banner.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteBanner(banner._id)}
                            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    Create New Banner
                  </CardTitle>
                  <CardDescription>
                    Create a new promotional banner or announcement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Banner Title</Label>
                      <Input
                        id="title"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter banner title"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkUrl">Link URL</Label>
                      <Input
                        id="linkUrl"
                        value={bannerForm.linkUrl}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, linkUrl: e.target.value }))}
                        placeholder="https://example.com"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter banner description"
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <select
                        id="position"
                        value={bannerForm.position}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, position: e.target.value as any }))}
                        className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                        <option value="sidebar">Sidebar</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={bannerForm.priority}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <select
                        id="targetAudience"
                        value={bannerForm.targetAudience}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                        className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                        <option value="all">All Users</option>
                        <option value="applicants">Applicants</option>
                        <option value="employers">Employers</option>
                        <option value="admin">Admin Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date (Optional)</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={bannerForm.startDate}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={bannerForm.endDate}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={createBanner}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Banner
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Banner Templates
                    </CardTitle>
                    <CardDescription>
                      Pre-built banner templates for common use cases
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                          <img
                            src={template.imageUrl}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {template.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Created: {formatDate(template.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/60 backdrop-blur-sm border-white/50">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/60 backdrop-blur-sm border-white/50">
                          <Edit className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Banner Analytics
                  </CardTitle>
                  <CardDescription>
                    Track banner performance and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Total Impressions</span>
                          <span className="text-sm font-semibold text-gray-900">2,156</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Total Clicks</span>
                          <span className="text-sm font-semibold text-green-600">334</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Average CTR</span>
                          <span className="text-sm font-semibold text-blue-600">15.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Best Performing</span>
                          <span className="text-sm font-semibold text-purple-600">Job Opportunities</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">Position Performance</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Top Position</span>
                          <span className="text-sm font-semibold text-gray-900">18.2% CTR</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Middle Position</span>
                          <span className="text-sm font-semibold text-blue-600">12.8% CTR</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Sidebar</span>
                          <span className="text-sm font-semibold text-green-600">8.5% CTR</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Bottom</span>
                          <span className="text-sm font-semibold text-orange-600">6.2% CTR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
