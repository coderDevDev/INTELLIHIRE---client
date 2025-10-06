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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Database,
  Globe,
  Bell,
  Lock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailNotifications: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
  };
  features: {
    aiParsing: boolean;
    jobRecommendations: boolean;
    careerPathPrediction: boolean;
    resumeGeneration: boolean;
    videoInterviews: boolean;
    newsletterSystem: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'InteliHire',
      siteDescription: 'AI-Powered Job Portal for PESO',
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'InteliHire System'
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireEmailVerification: true,
      enableTwoFactor: false
    },
    features: {
      aiParsing: true,
      jobRecommendations: true,
      careerPathPrediction: true,
      resumeGeneration: true,
      videoInterviews: false,
      newsletterSystem: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock data - replace with actual API call
      setSettings(prev => prev);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // In a real implementation, this would save to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const updateSetting = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      fetchSettings();
      toast.success('Settings reset to defaults');
    }
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
            <p className="text-gray-600 font-medium">Loading settings...</p>
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
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-sm text-gray-600">
                Configure system preferences and features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Defaults
            </Button>
            <Button
              size="sm"
              onClick={saveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger value="general" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                General
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Email
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Security
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Features
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Basic system configuration and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Input
                        id="siteDescription"
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="maintenanceMode" className="text-base font-medium">
                          Maintenance Mode
                        </Label>
                        <p className="text-sm text-gray-600">
                          Enable maintenance mode to restrict access
                        </p>
                      </div>
                      <Switch
                        id="maintenanceMode"
                        checked={settings.general.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="registrationEnabled" className="text-base font-medium">
                          User Registration
                        </Label>
                        <p className="text-sm text-gray-600">
                          Allow new users to register accounts
                        </p>
                      </div>
                      <Switch
                        id="registrationEnabled"
                        checked={settings.general.registrationEnabled}
                        onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="emailNotifications" className="text-base font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          Send email notifications to users
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.general.emailNotifications}
                        onCheckedChange={(checked) => updateSetting('general', 'emailNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure SMTP settings for email notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <div className="relative">
                        <Input
                          id="smtpPassword"
                          type={showPasswords.smtpPassword ? "text" : "password"}
                          value={settings.email.smtpPassword}
                          onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border-white/50 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('smtpPassword')}>
                          {showPasswords.smtpPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/80 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Email Testing</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Test your email configuration to ensure notifications are working properly.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-white/60 backdrop-blur-sm border-white/50">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Test Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security policies and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="bg-white/60 backdrop-blur-sm border-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="requireEmailVerification" className="text-base font-medium">
                          Email Verification Required
                        </Label>
                        <p className="text-sm text-gray-600">
                          Require users to verify their email address
                        </p>
                      </div>
                      <Switch
                        id="requireEmailVerification"
                        checked={settings.security.requireEmailVerification}
                        onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="enableTwoFactor" className="text-base font-medium">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-600">
                          Enable 2FA for enhanced security
                        </p>
                      </div>
                      <Switch
                        id="enableTwoFactor"
                        checked={settings.security.enableTwoFactor}
                        onCheckedChange={(checked) => updateSetting('security', 'enableTwoFactor', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Settings */}
            <TabsContent value="features" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    Feature Toggles
                  </CardTitle>
                  <CardDescription>
                    Enable or disable system features and modules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="aiParsing" className="text-base font-medium">
                          AI Document Parsing
                        </Label>
                        <p className="text-sm text-gray-600">
                          Enable AI-powered PDS and resume parsing
                        </p>
                      </div>
                      <Switch
                        id="aiParsing"
                        checked={settings.features.aiParsing}
                        onCheckedChange={(checked) => updateSetting('features', 'aiParsing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="jobRecommendations" className="text-base font-medium">
                          Job Recommendations
                        </Label>
                        <p className="text-sm text-gray-600">
                          AI-powered job matching and recommendations
                        </p>
                      </div>
                      <Switch
                        id="jobRecommendations"
                        checked={settings.features.jobRecommendations}
                        onCheckedChange={(checked) => updateSetting('features', 'jobRecommendations', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="careerPathPrediction" className="text-base font-medium">
                          Career Path Prediction
                        </Label>
                        <p className="text-sm text-gray-600">
                          AI-powered career progression analysis
                        </p>
                      </div>
                      <Switch
                        id="careerPathPrediction"
                        checked={settings.features.careerPathPrediction}
                        onCheckedChange={(checked) => updateSetting('features', 'careerPathPrediction', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="resumeGeneration" className="text-base font-medium">
                          Resume Generation
                        </Label>
                        <p className="text-sm text-gray-600">
                          Automatic ATS-compliant resume generation
                        </p>
                      </div>
                      <Switch
                        id="resumeGeneration"
                        checked={settings.features.resumeGeneration}
                        onCheckedChange={(checked) => updateSetting('features', 'resumeGeneration', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="videoInterviews" className="text-base font-medium">
                          Video Interviews
                        </Label>
                        <p className="text-sm text-gray-600">
                          Integration with video interviewing platforms
                        </p>
                      </div>
                      <Switch
                        id="videoInterviews"
                        checked={settings.features.videoInterviews}
                        onCheckedChange={(checked) => updateSetting('features', 'videoInterviews', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <div>
                        <Label htmlFor="newsletterSystem" className="text-base font-medium">
                          Newsletter System
                        </Label>
                        <p className="text-sm text-gray-600">
                          Email marketing and newsletter functionality
                        </p>
                      </div>
                      <Switch
                        id="newsletterSystem"
                        checked={settings.features.newsletterSystem}
                        onCheckedChange={(checked) => updateSetting('features', 'newsletterSystem', checked)}
                      />
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
