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
  Download,
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
  Image,
  Link,
  Target,
  Zap,
  FileUp,
  Users,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface PdsTemplate {
  _id: string;
  name: string;
  description: string;
  version: string;
  fileUrl: string;
  category: 'standard' | 'government' | 'private' | 'academic';
  downloads: number;
  lastUpdated: string;
  createdAt: string;
  isActive: boolean;
  fileSize: string;
  language: string;
}

interface TemplateCategory {
  name: string;
  count: number;
  description: string;
}

export default function PdsTemplatesPage() {
  const [templates, setTemplates] = useState<PdsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: 'standard' as const,
    language: 'english',
    file: null as File | null
  });

  const categories: TemplateCategory[] = [
    {
      name: 'standard',
      count: 3,
      description: 'Standard PDS templates for general use'
    },
    {
      name: 'government',
      count: 2,
      description: 'Government-specific PDS templates'
    },
    { name: 'private', count: 1, description: 'Private sector PDS templates' },
    {
      name: 'academic',
      count: 1,
      description: 'Academic institution PDS templates'
    }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      // Mock data - in real implementation, fetch from API
      const mockTemplates: PdsTemplate[] = [
        {
          _id: '1',
          name: 'Standard PDS Form',
          description:
            'Basic Personal Data Sheet template for general job applications',
          version: '2.1',
          fileUrl: '/templates/standard-pds.pdf',
          category: 'standard',
          downloads: 1250,
          lastUpdated: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-01T10:00:00Z',
          isActive: true,
          fileSize: '245 KB',
          language: 'english'
        },
        {
          _id: '2',
          name: 'Government PDS Form',
          description: 'Official government Personal Data Sheet template',
          version: '1.8',
          fileUrl: '/templates/government-pds.pdf',
          category: 'government',
          downloads: 890,
          lastUpdated: '2024-01-10T14:00:00Z',
          createdAt: '2024-01-05T09:00:00Z',
          isActive: true,
          fileSize: '312 KB',
          language: 'english'
        },
        {
          _id: '3',
          name: 'Private Sector PDS',
          description: 'Personal Data Sheet template for private companies',
          version: '1.5',
          fileUrl: '/templates/private-pds.pdf',
          category: 'private',
          downloads: 456,
          lastUpdated: '2024-01-08T16:00:00Z',
          createdAt: '2024-01-03T11:00:00Z',
          isActive: true,
          fileSize: '198 KB',
          language: 'english'
        },
        {
          _id: '4',
          name: 'Academic PDS Form',
          description: 'Personal Data Sheet template for academic institutions',
          version: '1.2',
          fileUrl: '/templates/academic-pds.pdf',
          category: 'academic',
          downloads: 234,
          lastUpdated: '2024-01-12T13:00:00Z',
          createdAt: '2024-01-07T15:00:00Z',
          isActive: true,
          fileSize: '267 KB',
          language: 'english'
        },
        {
          _id: '5',
          name: 'Standard PDS (Filipino)',
          description:
            'Basic Personal Data Sheet template in Filipino language',
          version: '2.0',
          fileUrl: '/templates/standard-pds-filipino.pdf',
          category: 'standard',
          downloads: 678,
          lastUpdated: '2024-01-14T12:00:00Z',
          createdAt: '2024-01-10T10:00:00Z',
          isActive: true,
          fileSize: '289 KB',
          language: 'filipino'
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load PDS templates');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t._id === templateId);
      if (!template) return;

      // Mock download - in real implementation, trigger actual file download
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update download count
      setTemplates(prev =>
        prev.map(t =>
          t._id === templateId ? { ...t, downloads: t.downloads + 1 } : t
        )
      );

      toast.success(`Downloading ${template.name}`);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const uploadTemplate = async () => {
    if (!templateForm.name || !templateForm.description || !templateForm.file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    try {
      // Mock upload - in real implementation, upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTemplate: PdsTemplate = {
        _id: Date.now().toString(),
        name: templateForm.name,
        description: templateForm.description,
        version: '1.0',
        fileUrl: `/templates/${templateForm.name
          .toLowerCase()
          .replace(/\s+/g, '-')}.pdf`,
        category: templateForm.category,
        downloads: 0,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isActive: true,
        fileSize: `${Math.round(templateForm.file.size / 1024)} KB`,
        language: templateForm.language
      };

      setTemplates(prev => [newTemplate, ...prev]);

      // Reset form
      setTemplateForm({
        name: '',
        description: '',
        category: 'standard',
        language: 'english',
        file: null
      });

      toast.success('Template uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload template');
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        setTemplates(prev => prev.filter(t => t._id !== templateId));
        toast.success('Template deleted successfully');
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government':
        return <Award className="h-4 w-4" />;
      case 'private':
        return <Briefcase className="h-4 w-4" />;
      case 'academic':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'government':
        return 'bg-blue-100 text-blue-700';
      case 'private':
        return 'bg-green-100 text-green-700';
      case 'academic':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <p className="text-gray-600 font-medium">
              Loading PDS templates...
            </p>
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
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                PDS Templates
              </h1>
              <p className="text-sm text-gray-600">
                Manage and download Personal Data Sheet templates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTemplates}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab('upload')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Upload Template
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
                  Total Templates
                </CardTitle>
                <FileText className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {templates.length}
                </div>
                <p className="text-xs text-blue-600">Available templates</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Downloads
                </CardTitle>
                <Download className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {templates.reduce((sum, t) => sum + t.downloads, 0)}
                </div>
                <p className="text-xs text-green-600">All time downloads</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Templates
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {templates.filter(t => t.isActive).length}
                </div>
                <p className="text-xs text-purple-600">Currently available</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Categories
                </CardTitle>
                <Target className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {categories.length}
                </div>
                <p className="text-xs text-orange-600">Template categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Template Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              {/* Search and Filter */}
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search templates..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/60 backdrop-blur-sm border-white/50"
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category.name} value={category.name}>
                            {category.name.charAt(0).toUpperCase() +
                              category.name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-sm text-gray-600">
                      Showing {filteredTemplates.length} of {templates.length}{' '}
                      templates
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Templates List */}
              <div className="space-y-4">
                {filteredTemplates.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                    <CardContent className="py-12">
                      <div className="text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No templates found</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredTemplates.map(template => (
                    <Card
                      key={template._id}
                      className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {template.name}
                                </h3>
                                <Badge
                                  className={`text-xs ${getCategoryColor(
                                    template.category
                                  )}`}>
                                  {getCategoryIcon(template.category)}
                                  {template.category.charAt(0).toUpperCase() +
                                    template.category.slice(1)}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  v{template.version}
                                </Badge>
                                {template.isActive && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Size: {template.fileSize}</span>
                                <span>•</span>
                                <span>Language: {template.language}</span>
                                <span>•</span>
                                <span>Downloads: {template.downloads}</span>
                                <span>•</span>
                                <span>
                                  Updated: {formatDate(template.lastUpdated)}
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
                              size="sm"
                              onClick={() => downloadTemplate(template._id)}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTemplate(template._id)}
                              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Upload New Template
                  </CardTitle>
                  <CardDescription>
                    Upload a new PDS template to the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={templateForm.name}
                        onChange={e =>
                          setTemplateForm(prev => ({
                            ...prev,
                            name: e.target.value
                          }))
                        }
                        placeholder="Enter template name"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateCategory">Category</Label>
                      <select
                        id="templateCategory"
                        value={templateForm.category}
                        onChange={e =>
                          setTemplateForm(prev => ({
                            ...prev,
                            category: e.target.value as any
                          }))
                        }
                        className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                        <option value="standard">Standard</option>
                        <option value="government">Government</option>
                        <option value="private">Private</option>
                        <option value="academic">Academic</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="templateDescription">Description</Label>
                    <Textarea
                      id="templateDescription"
                      value={templateForm.description}
                      onChange={e =>
                        setTemplateForm(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                      placeholder="Enter template description"
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="templateLanguage">Language</Label>
                      <select
                        id="templateLanguage"
                        value={templateForm.language}
                        onChange={e =>
                          setTemplateForm(prev => ({
                            ...prev,
                            language: e.target.value
                          }))
                        }
                        className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                        <option value="english">English</option>
                        <option value="filipino">Filipino</option>
                        <option value="spanish">Spanish</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateFile">Template File</Label>
                      <div className="relative">
                        <Input
                          id="templateFile"
                          type="file"
                          accept=".pdf"
                          onChange={e =>
                            setTemplateForm(prev => ({
                              ...prev,
                              file: e.target.files?.[0] || null
                            }))
                          }
                          className="bg-white/60 backdrop-blur-sm border-white/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/80 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Upload Guidelines
                        </h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Only PDF files are accepted</li>
                          <li>• Maximum file size: 5MB</li>
                          <li>• Ensure the template is properly formatted</li>
                          <li>
                            • Include all necessary fields for data collection
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={uploadTemplate}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Template
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

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Template Analytics
                  </CardTitle>
                  <CardDescription>
                    Track template usage and download statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        Download Statistics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Total Downloads
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {templates.reduce((sum, t) => sum + t.downloads, 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Most Downloaded
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {templates.reduce(
                              (max, t) =>
                                t.downloads > max.downloads ? t : max,
                              templates[0]
                            )?.name || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Average Downloads
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            {Math.round(
                              templates.reduce(
                                (sum, t) => sum + t.downloads,
                                0
                              ) / templates.length
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        Category Breakdown
                      </h3>
                      <div className="space-y-3">
                        {categories.map(category => {
                          const categoryTemplates = templates.filter(
                            t => t.category === category.name
                          );
                          const categoryDownloads = categoryTemplates.reduce(
                            (sum, t) => sum + t.downloads,
                            0
                          );
                          return (
                            <div
                              key={category.name}
                              className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 capitalize">
                                {category.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  {categoryDownloads}
                                </span>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  {categoryTemplates.length} templates
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
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





