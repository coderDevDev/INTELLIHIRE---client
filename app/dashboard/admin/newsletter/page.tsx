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
  Mail,
  Send,
  Users,
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
  Zap
} from 'lucide-react';
import { userAPI } from '@/lib/api-service';
import { toast } from 'sonner';

interface Newsletter {
  _id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: {
    total: number;
    sent: number;
    opened: number;
    clicked: number;
  };
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterTemplate {
  _id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('compose');

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    title: '',
    subject: '',
    content: '',
    recipients: 'all', // 'all', 'applicants', 'employers', 'custom'
    customEmails: '',
    scheduleDate: '',
    scheduleTime: ''
  });

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    try {
      setLoading(true);

      // Mock data - in real implementation, fetch from API
      const mockNewsletters: Newsletter[] = [
        {
          _id: '1',
          title: 'Weekly Job Opportunities',
          subject: 'New Job Opportunities This Week',
          content: 'Check out the latest job opportunities...',
          status: 'sent',
          recipients: { total: 150, sent: 150, opened: 120, clicked: 45 },
          sentAt: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: 'System Maintenance Notice',
          subject: 'Scheduled System Maintenance',
          content: 'We will be performing maintenance...',
          status: 'scheduled',
          recipients: { total: 200, sent: 0, opened: 0, clicked: 0 },
          scheduledAt: '2024-01-20T14:00:00Z',
          createdAt: '2024-01-18T11:00:00Z',
          updatedAt: '2024-01-18T11:00:00Z'
        },
        {
          _id: '3',
          title: 'New Features Update',
          subject: 'Exciting New Features Available',
          content: 'We are excited to announce...',
          status: 'draft',
          recipients: { total: 0, sent: 0, opened: 0, clicked: 0 },
          createdAt: '2024-01-19T15:00:00Z',
          updatedAt: '2024-01-19T15:00:00Z'
        }
      ];

      const mockTemplates: NewsletterTemplate[] = [
        {
          _id: '1',
          name: 'Job Opportunities',
          subject: 'New Job Opportunities Available',
          content:
            'Dear {{firstName}},\n\nWe have exciting new job opportunities...',
          category: 'jobs',
          createdAt: '2024-01-10T10:00:00Z'
        },
        {
          _id: '2',
          name: 'System Updates',
          subject: 'Important System Update',
          content: 'Dear {{firstName}},\n\nWe are writing to inform you...',
          category: 'system',
          createdAt: '2024-01-12T14:00:00Z'
        }
      ];

      setNewsletters(mockNewsletters);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
      toast.error('Failed to load newsletter data');
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async (newsletterId: string) => {
    try {
      setSending(newsletterId);
      // Mock sending - in real implementation, call API
      await new Promise(resolve => setTimeout(resolve, 2000));

      setNewsletters(prev =>
        prev.map(n =>
          n._id === newsletterId
            ? {
                ...n,
                status: 'sent' as const,
                sentAt: new Date().toISOString()
              }
            : n
        )
      );

      toast.success('Newsletter sent successfully');
    } catch (error) {
      toast.error('Failed to send newsletter');
    } finally {
      setSending(null);
    }
  };

  const deleteNewsletter = async (newsletterId: string) => {
    if (confirm('Are you sure you want to delete this newsletter?')) {
      try {
        setNewsletters(prev => prev.filter(n => n._id !== newsletterId));
        toast.success('Newsletter deleted successfully');
      } catch (error) {
        toast.error('Failed to delete newsletter');
      }
    }
  };

  const saveNewsletter = async () => {
    if (!composeForm.title || !composeForm.subject || !composeForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newNewsletter: Newsletter = {
        _id: Date.now().toString(),
        title: composeForm.title,
        subject: composeForm.subject,
        content: composeForm.content,
        status: 'draft',
        recipients: { total: 0, sent: 0, opened: 0, clicked: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setNewsletters(prev => [newNewsletter, ...prev]);

      // Reset form
      setComposeForm({
        title: '',
        subject: '',
        content: '',
        recipients: 'all',
        customEmails: '',
        scheduleDate: '',
        scheduleTime: ''
      });

      toast.success('Newsletter saved as draft');
    } catch (error) {
      toast.error('Failed to save newsletter');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Edit className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <p className="text-gray-600 font-medium">
              Loading newsletter data...
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
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Newsletter Management
              </h1>
              <p className="text-sm text-gray-600">
                Create and manage email newsletters and campaigns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNewsletterData}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab('compose')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Newsletter
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
                  Total Newsletters
                </CardTitle>
                <Mail className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {newsletters.length}
                </div>
                <p className="text-xs text-blue-600">All campaigns</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Sent This Month
                </CardTitle>
                <Send className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {newsletters.filter(n => n.status === 'sent').length}
                </div>
                <p className="text-xs text-green-600">Successful sends</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Open Rate
                </CardTitle>
                <Eye className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">78%</div>
                <p className="text-xs text-purple-600">Average open rate</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Click Rate
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">24%</div>
                <p className="text-xs text-orange-600">Average click rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Newsletter Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger
                value="compose"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Compose
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Compose Tab */}
            <TabsContent value="compose" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Edit className="h-5 w-5 text-blue-600" />
                    Compose Newsletter
                  </CardTitle>
                  <CardDescription>
                    Create a new newsletter or email campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Newsletter Title</Label>
                      <Input
                        id="title"
                        value={composeForm.title}
                        onChange={e =>
                          setComposeForm(prev => ({
                            ...prev,
                            title: e.target.value
                          }))
                        }
                        placeholder="Enter newsletter title"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        value={composeForm.subject}
                        onChange={e =>
                          setComposeForm(prev => ({
                            ...prev,
                            subject: e.target.value
                          }))
                        }
                        placeholder="Enter email subject line"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <select
                      id="recipients"
                      value={composeForm.recipients}
                      onChange={e =>
                        setComposeForm(prev => ({
                          ...prev,
                          recipients: e.target.value
                        }))
                      }
                      className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                      <option value="all">All Users</option>
                      <option value="applicants">Applicants Only</option>
                      <option value="employers">Employers Only</option>
                      <option value="custom">Custom List</option>
                    </select>
                  </div>

                  {composeForm.recipients === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customEmails">Custom Email List</Label>
                      <Textarea
                        id="customEmails"
                        value={composeForm.customEmails}
                        onChange={e =>
                          setComposeForm(prev => ({
                            ...prev,
                            customEmails: e.target.value
                          }))
                        }
                        placeholder="Enter email addresses separated by commas"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="content">Newsletter Content</Label>
                    <Textarea
                      id="content"
                      value={composeForm.content}
                      onChange={e =>
                        setComposeForm(prev => ({
                          ...prev,
                          content: e.target.value
                        }))
                      }
                      placeholder="Write your newsletter content here..."
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                      rows={10}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="scheduleDate">
                        Schedule Date (Optional)
                      </Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        value={composeForm.scheduleDate}
                        onChange={e =>
                          setComposeForm(prev => ({
                            ...prev,
                            scheduleDate: e.target.value
                          }))
                        }
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduleTime">
                        Schedule Time (Optional)
                      </Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={composeForm.scheduleTime}
                        onChange={e =>
                          setComposeForm(prev => ({
                            ...prev,
                            scheduleTime: e.target.value
                          }))
                        }
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={saveNewsletter}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                      <FileText className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Newsletter Campaigns
                  </CardTitle>
                  <CardDescription>
                    Manage your newsletter campaigns and track their performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {newsletters.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No newsletters found</p>
                    </div>
                  ) : (
                    newsletters.map(newsletter => (
                      <div
                        key={newsletter._id}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <Mail className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {newsletter.title}
                              </h4>
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  newsletter.status
                                )}`}>
                                {getStatusIcon(newsletter.status)}
                                {newsletter.status.charAt(0).toUpperCase() +
                                  newsletter.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {newsletter.subject}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                Created: {formatDate(newsletter.createdAt)}
                              </span>
                              {newsletter.sentAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Sent: {formatDate(newsletter.sentAt)}
                                  </span>
                                </>
                              )}
                              {newsletter.scheduledAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Scheduled:{' '}
                                    {formatDate(newsletter.scheduledAt)}
                                  </span>
                                </>
                              )}
                            </div>
                            {newsletter.status === 'sent' && (
                              <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                                <span>
                                  Recipients: {newsletter.recipients.total}
                                </span>
                                <span>
                                  Opened: {newsletter.recipients.opened}
                                </span>
                                <span>
                                  Clicked: {newsletter.recipients.clicked}
                                </span>
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
                          {newsletter.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendNewsletter(newsletter._id)}
                              disabled={sending === newsletter._id}
                              className="bg-white/60 backdrop-blur-sm border-white/50">
                              {sending === newsletter._id ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4 mr-2" />
                              )}
                              Send
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNewsletter(newsletter._id)}
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

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Newsletter Templates
                    </CardTitle>
                    <CardDescription>
                      Pre-built templates for common newsletter types
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
                  {templates.map(template => (
                    <div
                      key={template._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {template.subject}
                          </p>
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
                    Newsletter Analytics
                  </CardTitle>
                  <CardDescription>
                    Track performance metrics and engagement rates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        Performance Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Total Sent
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            1,250
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Open Rate
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            78%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Click Rate
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            24%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Unsubscribe Rate
                          </span>
                          <span className="text-sm font-semibold text-red-600">
                            2.1%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        Recent Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Last 30 Days
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            +12%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Best Performing
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            Job Opportunities
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Peak Send Time
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            10:00 AM
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Active Subscribers
                          </span>
                          <span className="text-sm font-semibold text-purple-600">
                            1,180
                          </span>
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


