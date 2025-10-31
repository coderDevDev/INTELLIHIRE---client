'use client';

import { useState, useEffect } from 'react';
import { emailCampaignAPI, jobAPI } from '@/lib/api-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Mail,
  Send,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  FileText,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [contentView, setContentView] = useState<'code' | 'preview'>('preview');

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'custom',
    recipients: {
      type: 'all',
      customEmails: [],
      filters: {}
    },
    attachedJobs: [],
    template: 'default'
  });

  const [testEmail, setTestEmail] = useState({
    email: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (formData.recipients) {
      fetchRecipientCount();
    }
  }, [formData.recipients]);

  const fetchCampaigns = async () => {
    try {
      const data = await emailCampaignAPI.getCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (error: any) {
      toast.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await emailCampaignAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await jobAPI.getJobs({ limit: 100 });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchRecipientCount = async () => {
    try {
      const data = await emailCampaignAPI.getRecipientCount(formData.recipients);
      setRecipientCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch recipient count:', error);
    }
  };

  const handleCreate = async () => {
    try {
      if (editingCampaign) {
        await emailCampaignAPI.updateCampaign(editingCampaign._id, formData);
        toast.success('Campaign updated successfully');
      } else {
        await emailCampaignAPI.createCampaign(formData);
        toast.success('Campaign created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCampaigns();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save campaign');
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      return;
    }

    setSending(id);
    try {
      const result = await emailCampaignAPI.sendCampaign(id);
      toast.success(`Campaign sent! ${result.stats.sent} emails delivered`);
      fetchCampaigns();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send campaign');
    } finally {
      setSending(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await emailCampaignAPI.deleteCampaign(id);
      toast.success('Campaign deleted successfully');
      fetchCampaigns();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleSendTest = async () => {
    try {
      await emailCampaignAPI.sendTestEmail(testEmail);
      toast.success('Test email sent successfully');
      setIsTestModalOpen(false);
      setTestEmail({ email: '', subject: '', content: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    }
  };

  const openEditModal = (campaign: any) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      type: campaign.type,
      recipients: campaign.recipients,
      attachedJobs: campaign.attachedJobs?.map((j: any) => j._id) || [],
      template: campaign.template
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      subject: '',
      content: '',
      type: 'custom',
      recipients: {
        type: 'all',
        customEmails: [],
        filters: {}
      },
      attachedJobs: [],
      template: 'default'
    });
  };

  const loadTemplate = async (type: string) => {
    if (!type || type === 'custom') return;
    
    setLoadingTemplate(true);
    try {
      const response = await emailCampaignAPI.getTemplate(type);
      if (response.template) {
        setFormData(prev => ({
          ...prev,
          subject: response.template.subject,
          content: response.template.content
        }));
        toast.success('Template loaded successfully!');
      }
    } catch (error: any) {
      toast.error('Failed to load template');
      console.error('Template load error:', error);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      draft: { color: 'bg-gray-500', label: 'Draft', icon: FileText },
      scheduled: { color: 'bg-blue-500', label: 'Scheduled', icon: Clock },
      sending: { color: 'bg-yellow-500', label: 'Sending', icon: Loader2 },
      sent: { color: 'bg-green-500', label: 'Sent', icon: CheckCircle },
      failed: { color: 'bg-red-500', label: 'Failed', icon: XCircle }
    };

    const { color, label, icon: Icon } = config[status] || config.draft;

    return (
      <Badge className={`${color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: any = {
      newsletter: 'bg-purple-100 text-purple-700',
      job_alert: 'bg-blue-100 text-blue-700',
      reminder: 'bg-orange-100 text-orange-700',
      announcement: 'bg-green-100 text-green-700',
      custom: 'bg-gray-100 text-gray-700'
    };

    return (
      <Badge variant="outline" className={colors[type] || colors.custom}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Email Marketing
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage email campaigns for job alerts, newsletters, and announcements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsTestModalOpen(true)}
            className="bg-white">
            <Mail className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Campaigns</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {stats.totalCampaigns}
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Emails Sent</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {stats.totalEmailsSent}
                  </p>
                </div>
                <Send className="h-12 w-12 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {stats.successRate}%
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Scheduled</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {stats.scheduledCampaigns}
                  </p>
                </div>
                <Calendar className="h-12 w-12 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No campaigns yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Create your first email campaign to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <Card
                  key={campaign._id}
                  className="hover:shadow-lg transition-all duration-300 border-l-4"
                  style={{
                    borderLeftColor:
                      campaign.status === 'sent'
                        ? '#10b981'
                        : campaign.status === 'scheduled'
                        ? '#3b82f6'
                        : '#6b7280'
                  }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {campaign.name}
                          </h3>
                          {getStatusBadge(campaign.status)}
                          {getTypeBadge(campaign.type)}
                        </div>
                        <p className="text-gray-600 mb-3">{campaign.subject}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {campaign.stats.totalRecipients || 0} recipients
                            </span>
                          </div>
                          {campaign.stats.sent > 0 && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>{campaign.stats.sent} sent</span>
                            </div>
                          )}
                          {campaign.stats.failed > 0 && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span>{campaign.stats.failed} failed</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(campaign.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(campaign)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSend(campaign._id)}
                              disabled={sending === campaign._id}
                              className="bg-green-600 hover:bg-green-700">
                              {sending === campaign._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                        {campaign.status !== 'sent' &&
                          campaign.status !== 'sending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(campaign._id)}
                              className="text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Campaign Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Campaign Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Monthly Newsletter - January 2025"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email Subject</label>
              <Input
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., New Job Opportunities This Week"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Campaign Type</label>
                <div className="flex gap-2">
                  <Select
                    value={formData.type}
                    onValueChange={value =>
                      setFormData({ ...formData, type: value })
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="job_alert">Job Alert</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.type !== 'custom' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadTemplate(formData.type)}
                      disabled={loadingTemplate}
                      className="whitespace-nowrap">
                      {loadingTemplate ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Use Template'
                      )}
                    </Button>
                  )}
                </div>
                {formData.type !== 'custom' && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Click "Use Template" to load a pre-designed email for this type
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Recipients</label>
                <Select
                  value={formData.recipients.type}
                  onValueChange={value =>
                    setFormData({
                      ...formData,
                      recipients: { ...formData.recipients, type: value }
                    })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="applicants">Applicants Only</SelectItem>
                    <SelectItem value="employers">Employers Only</SelectItem>
                    <SelectItem value="custom">Custom List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recipientCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    This campaign will reach {recipientCount} recipients
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Email Content
                </label>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setContentView('preview')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      contentView === 'preview'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}>
                    <Eye className="h-3 w-3 inline mr-1" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentView('code')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      contentView === 'code'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}>
                    <FileText className="h-3 w-3 inline mr-1" />
                    HTML Code
                  </button>
                </div>
              </div>
              
              {contentView === 'code' ? (
                <>
                  <Textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your email content here... You can use HTML tags for formatting."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{'}firstName{'}'} to personalize with recipient&apos;s name
                  </p>
                </>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium">Email Preview</span>
                    <span className="text-xs text-gray-500">How recipients will see it</span>
                  </div>
                  <div 
                    className="bg-white p-4 max-h-96 overflow-y-auto"
                    style={{ minHeight: '300px' }}>
                    {formData.content ? (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formData.content.replace(/{{firstName}}/g, 'John')
                        }} 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No content to preview</p>
                          <p className="text-xs mt-1">Select a template or switch to HTML Code to write content</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Attach Jobs (Optional)
              </label>
              <Select
                value={formData.attachedJobs[0] || ''}
                onValueChange={value =>
                  setFormData({ ...formData, attachedJobs: [value] })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job to feature" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job._id} value={job._id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name || !formData.subject || !formData.content}
              className="bg-blue-600 hover:bg-blue-700">
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Email Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recipient Email</label>
              <Input
                type="email"
                value={testEmail.email}
                onChange={e =>
                  setTestEmail({ ...testEmail, email: e.target.value })
                }
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                value={testEmail.subject}
                onChange={e =>
                  setTestEmail({ ...testEmail, subject: e.target.value })
                }
                placeholder="Test Email Subject"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                value={testEmail.content}
                onChange={e =>
                  setTestEmail({ ...testEmail, content: e.target.value })
                }
                placeholder="Test email content..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendTest}
              disabled={
                !testEmail.email || !testEmail.subject || !testEmail.content
              }
              className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
