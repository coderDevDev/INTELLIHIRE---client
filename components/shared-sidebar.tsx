'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Briefcase,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Bell,
  Shield,
  HelpCircle,
  Activity,
  AlertCircle,
  CheckCircle,
  User,
  Search,
  TrendingUp,
  Calendar,
  ChevronRight,
  Download,
  Upload,
  FileUp,
  Brain,
  Award,
  Target,
  Newspaper,
  Image,
  Video,
  Mail,
  FileCheck,
  Star,
  Filter,
  Eye,
  PieChart,
  LineChart,
  Building2,
  UserCheck,
  ClipboardList,
  BookOpen,
  GraduationCap,
  BriefcaseBusiness,
  MapPin,
  Clock,
  DollarSign,
  TrendingDown,
  Users2,
  FileSpreadsheet,
  Send,
  Megaphone,
  Flag,
  Zap,
  Lightbulb,
  Route,
  BarChart3,
  Layers,
  Database,
  Cpu,
  Workflow,
  GitBranch,
  Network,
  Globe,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api-service';

interface SharedSidebarProps {
  role: 'admin' | 'applicant' | 'employer';
}

export function SharedSidebar({ role }: SharedSidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(0);
  const [systemStatus, setSystemStatus] = useState('operational');

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);

    // Set notifications based on role
    if (role === 'admin') {
      setNotifications(5);
    } else if (role === 'applicant') {
      setNotifications(3);
    } else {
      setNotifications(2);
    }
  }, [role]);

  // Admin routes
  const adminRoutes = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard/admin',
      active: pathname === '/dashboard/admin',
      description: 'Overview and analytics'
    },
    {
      label: 'Job Postings',
      icon: Briefcase,
      href: '/dashboard/admin/jobs',
      active: pathname === '/dashboard/admin/jobs',
      description: 'Manage job postings',
      badge: '12'
    },
    {
      label: 'Applicants',
      icon: Users,
      href: '/dashboard/admin/applicants',
      active: pathname === '/dashboard/admin/applicants',
      description: 'View applicants',
      badge: '245'
    },
    {
      label: 'AI Parsing',
      icon: Brain,
      href: '/dashboard/admin/ai-parsing',
      active: pathname === '/dashboard/admin/ai-parsing',
      description: 'AI document processing',
      badge: 'NEW'
    },
    {
      label: 'Applicant Ranking',
      icon: Award,
      href: '/dashboard/admin/ranking',
      active: pathname === '/dashboard/admin/ranking',
      description: 'Automatic applicant ranking'
    },
    {
      label: 'Reports',
      icon: FileSpreadsheet,
      href: '/dashboard/admin/reports',
      active: pathname === '/dashboard/admin/reports',
      description: 'Generate reports'
    },
    {
      label: 'Newsletter',
      icon: Mail,
      href: '/dashboard/admin/newsletter',
      active: pathname === '/dashboard/admin/newsletter',
      description: 'Email marketing'
    },
    {
      label: 'Banner Management',
      icon: Image,
      href: '/dashboard/admin/banners',
      active: pathname === '/dashboard/admin/banners',
      description: 'Manage banners'
    },
    {
      label: 'PDS Templates',
      icon: Download,
      href: '/dashboard/admin/pds-templates',
      active: pathname === '/dashboard/admin/pds-templates',
      description: 'Download PDS templates'
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/admin/messages',
      active: pathname === '/dashboard/admin/messages',
      description: 'Communications',
      badge: notifications.toString()
    },
    {
      label: 'Analytics',
      icon: BarChart,
      href: '/dashboard/admin/analytics',
      active: pathname === '/dashboard/admin/analytics',
      description: 'System analytics'
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/admin/settings',
      active: pathname === '/dashboard/admin/settings',
      description: 'System settings'
    }
  ];

  // Applicant routes
  const applicantRoutes = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard/applicant',
      active: pathname === '/dashboard/applicant',
      description: 'Overview and analytics'
    },
    {
      label: 'Profile',
      icon: User,
      href: '/dashboard/applicant/profile',
      active: pathname === '/dashboard/applicant/profile',
      description: 'Manage your profile'
    },
    {
      label: 'My Applications',
      icon: Briefcase,
      href: '/dashboard/applicant/applications',
      active: pathname === '/dashboard/applicant/applications',
      description: 'Track applications',
      badge: '3'
    },
    {
      label: 'Documents',
      icon: FileText,
      href: '/dashboard/applicant/documents',
      active: pathname === '/dashboard/applicant/documents',
      description: 'PDS and resumes'
    },

    {
      label: 'Job Recommendations',
      icon: Star,
      href: '/dashboard/applicant/recommendations',
      active: pathname === '/dashboard/applicant/recommendations',
      description: 'AI-powered job suggestions'
    },
    {
      label: 'Career Path',
      icon: Route,
      href: '/dashboard/applicant/career-path',
      active: pathname === '/dashboard/applicant/career-path',
      description: 'Career predictions'
    },
    {
      label: 'Success Prediction',
      icon: Target,
      href: '/dashboard/applicant/success-prediction',
      active: pathname === '/dashboard/applicant/success-prediction',
      description: 'Application success rate'
    }
    // {
    //   label: 'Job Matches',
    //   icon: Search,
    //   href: '/dashboard/applicant/matches',
    //   active: pathname === '/dashboard/applicant/matches',
    //   description: 'Recommended jobs'
    // },
    // {
    //   label: 'Messages',
    //   icon: MessageSquare,
    //   href: '/dashboard/applicant/messages',
    //   active: pathname === '/dashboard/applicant/messages',
    //   description: 'Communications',
    //   badge: notifications.toString()
    // },
    // {
    //   label: 'Analytics',
    //   icon: TrendingUp,
    //   href: '/dashboard/applicant/analytics',
    //   active: pathname === '/dashboard/applicant/analytics',
    //   description: 'Application insights'
    // }
  ];

  // Employer routes
  const employerRoutes = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard/employer',
      active: pathname === '/dashboard/employer',
      description: 'Overview and analytics'
    },
    {
      label: 'My Jobs',
      icon: Briefcase,
      href: '/dashboard/employer/jobs',
      active: pathname === '/dashboard/employer/jobs',
      description: 'Manage job postings',
      badge: '8'
    },
    {
      label: 'Applications',
      icon: Users,
      href: '/dashboard/employer/applications',
      active: pathname === '/dashboard/employer/applications',
      description: 'Review applications',
      badge: '24'
    },
    {
      label: 'Applicant Ranking',
      icon: Award,
      href: '/dashboard/employer/ranking',
      active: pathname === '/dashboard/employer/ranking',
      description: 'AI-powered applicant ranking'
    },
    {
      label: 'Export Applicants',
      icon: FileSpreadsheet,
      href: '/dashboard/employer/export',
      active: pathname === '/dashboard/employer/export',
      description: 'Export applicant lists'
    },
    {
      label: 'Video Interviews',
      icon: Video,
      href: '/dashboard/employer/interviews',
      active: pathname === '/dashboard/employer/interviews',
      description: 'Schedule video interviews'
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/employer/messages',
      active: pathname === '/dashboard/employer/messages',
      description: 'Communications',
      badge: notifications.toString()
    },
    {
      label: 'Analytics',
      icon: BarChart,
      href: '/dashboard/employer/analytics',
      active: pathname === '/dashboard/employer/analytics',
      description: 'Performance insights'
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/employer/settings',
      active: pathname === '/dashboard/employer/settings',
      description: 'Account settings'
    }
  ];

  // Secondary routes based on role
  const getSecondaryRoutes = () => {
    if (role === 'admin') {
      return [
        {
          label: 'System Status',
          icon: Activity,
          href: '/dashboard/admin/status',
          active: pathname === '/dashboard/admin/status'
        },
        {
          label: 'Integrations',
          icon: Network,
          href: '/dashboard/admin/integrations',
          active: pathname === '/dashboard/admin/integrations'
        },
        {
          label: 'Help & Support',
          icon: HelpCircle,
          href: '/dashboard/admin/help',
          active: pathname === '/dashboard/admin/help'
        }
      ];
    } else if (role === 'applicant') {
      return [
        {
          label: 'Resume Conversion',
          icon: FileCheck,
          href: '/dashboard/applicant/resume-conversion',
          active: pathname === '/dashboard/applicant/resume-conversion'
        },
        {
          label: 'Settings',
          icon: Settings,
          href: '/dashboard/applicant/settings',
          active: pathname === '/dashboard/applicant/settings'
        },
        {
          label: 'Help & Support',
          icon: HelpCircle,
          href: '/dashboard/applicant/help',
          active: pathname === '/dashboard/applicant/help'
        }
      ];
    } else {
      return [
        {
          label: 'Settings',
          icon: Settings,
          href: '/dashboard/employer/settings',
          active: pathname === '/dashboard/employer/settings'
        },
        {
          label: 'Help & Support',
          icon: HelpCircle,
          href: '/dashboard/employer/help',
          active: pathname === '/dashboard/employer/help'
        }
      ];
    }
  };

  const routes =
    role === 'admin'
      ? adminRoutes
      : role === 'applicant'
      ? applicantRoutes
      : employerRoutes;
  const secondaryRoutes = getSecondaryRoutes();

  const getRoleTitle = () => {
    switch (role) {
      case 'admin':
        return 'Admin Panel';
      case 'applicant':
        return 'Job Platform';
      case 'employer':
        return 'Employer Portal';
      default:
        return 'Dashboard';
    }
  };

  const getSystemStatusIcon = () => {
    switch (systemStatus) {
      case 'operational':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'maintenance':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'operational':
        return 'text-green-600';
      case 'maintenance':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProfileCompletion = () => {
    if (role === 'applicant') {
      return 75;
    } else if (role === 'employer') {
      return 90;
    }
    return 100; // Admin
  };

  return (
    <div className="flex flex-col h-full w-80 bg-white/90 backdrop-blur-xl border-r border-white/50 shadow-xl relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-32 left-10 w-32 h-32 bg-purple-300/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 right-20 w-36 h-36 bg-pink-300/6 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
        <div
          className="absolute bottom-40 left-20 w-28 h-28 bg-green-300/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-white/50 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              InteliHire
            </span>
            <p className="text-sm text-gray-500 font-medium">
              {getRoleTitle()}
            </p>
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      {(role === 'applicant' || role === 'employer') && (
        <div className="p-6 border-b border-white/50 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-lg">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : 'User'}
              </p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="relative bg-white/60 backdrop-blur-sm hover:bg-white/80">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* Profile Completion */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm text-gray-500 font-semibold">
                {getProfileCompletion()}%
              </span>
            </div>
            <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-3 border border-white/50">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${getProfileCompletion()}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Status Section */}
      {role === 'admin' && (
        <div className="p-6 border-b border-white/50 relative z-10">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-2">
              {getSystemStatusIcon()}
              <span className={`text-sm font-medium ${getSystemStatusColor()}`}>
                System {systemStatus}
              </span>
            </div>
            <div className="ml-auto text-xs text-gray-500">
              All systems operational
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-auto relative z-10">
        <nav className="space-y-1 px-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Main Navigation
            </h3>
            {routes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-medium transition-all duration-300 relative overflow-hidden',
                  route.active
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-md backdrop-blur-sm hover:scale-[1.01]'
                )}>
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
                    route.active
                      ? 'bg-white/20 text-white shadow-md'
                      : 'bg-white/60 backdrop-blur-sm text-gray-600 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-md'
                  )}>
                  <route.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">
                      {route.label}
                    </span>
                    {route.badge && (
                      <Badge
                        variant={route.active ? 'secondary' : 'default'}
                        className={cn(
                          'ml-auto text-xs font-semibold',
                          route.active
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-blue-100 text-blue-600 border-blue-200'
                        )}>
                        {route.badge}
                      </Badge>
                    )}
                  </div>
                  {route.description && (
                    <p
                      className={cn(
                        'text-xs truncate mt-1',
                        route.active ? 'text-blue-100' : 'text-gray-500'
                      )}>
                      {route.description}
                    </p>
                  )}
                </div>
                {role === 'applicant' && (
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      route.active
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                )}
              </Link>
            ))}
          </div>

          <Separator className="my-6 bg-white/50" />

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              {role === 'admin' ? 'System' : 'Account'}
            </h3>
            {secondaryRoutes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden',
                  route.active
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-md backdrop-blur-sm'
                )}>
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300',
                    route.active
                      ? 'bg-white/20 text-white'
                      : 'bg-white/60 backdrop-blur-sm text-gray-600 group-hover:bg-blue-500 group-hover:text-white'
                  )}>
                  <route.icon className="h-4 w-4" />
                </div>
                <span className="truncate">{route.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Quick Actions for Applicant */}
      {role === 'applicant' && (
        <div className="p-4 border-t border-white/50 relative z-10">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <Link href="/jobs" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Find Jobs
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <Link
                  href="/dashboard/applicant/documents"
                  className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Documents
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <Link
                  href="/dashboard/applicant/pds-template"
                  className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  PDS Template
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <Link
                  href="/dashboard/applicant/profile"
                  className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-6 border-t border-white/50 relative z-10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md transition-all duration-300 text-gray-700 hover:text-red-600 hover:bg-red-50/80"
          asChild>
          <Link href="/login">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </Button>

        {/* Version */}
        <div className="text-xs text-gray-400 text-center mt-3 font-medium">
          v1.0.0 • InteliHire
        </div>
      </div>
    </div>
  );
}
