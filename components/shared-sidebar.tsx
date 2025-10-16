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
  Tablet,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
    };

    // Listen for storage changes (when profile is updated)
    const handleStorageChange = () => {
      const updatedUser = authAPI.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom profile update event
    window.addEventListener('profileUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, [role, isMobileOpen, isCollapsed]);

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
      label: 'Companies',
      icon: Building2,
      href: '/dashboard/admin/companies',
      active: pathname === '/dashboard/admin/companies',
      description: 'Manage companies'
    },
    // {
    //   label: 'AI Parsing',
    //   icon: Brain,
    //   href: '/dashboard/admin/ai-parsing',
    //   active: pathname === '/dashboard/admin/ai-parsing',
    //   description: 'AI document processing',
    //   badge: 'NEW'
    // },
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
    // {
    //   label: 'Newsletter',
    //   icon: Mail,
    //   href: '/dashboard/admin/newsletter',
    //   active: pathname === '/dashboard/admin/newsletter',
    //   description: 'Email marketing'
    // },
    {
      label: 'Banner Management',
      icon: Image,
      href: '/dashboard/admin/banners',
      active: pathname === '/dashboard/admin/banners',
      description: 'Manage banners'
    },
    // {
    //   label: 'PDS Templates',
    //   icon: Download,
    //   href: '/dashboard/admin/pds-templates',
    //   active: pathname === '/dashboard/admin/pds-templates',
    //   description: 'Download PDS templates'
    // },
    // {
    //   label: 'Messages',
    //   icon: MessageSquare,
    //   href: '/dashboard/admin/messages',
    //   active: pathname === '/dashboard/admin/messages',
    //   description: 'Communications',
    //   badge: notifications.toString()
    // },
    {
      label: 'Analytics',
      icon: BarChart,
      href: '/dashboard/admin/analytics',
      active: pathname === '/dashboard/admin/analytics',
      description: 'System analytics'
    }
    // {
    //   label: 'Settings',
    //   icon: Settings,
    //   href: '/dashboard/admin/settings',
    //   active: pathname === '/dashboard/admin/settings',
    //   description: 'System settings'
    // }
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
      description: 'Track applications'
      // badge: '3'
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
    }
    // {
    //   label: 'Success Prediction',
    //   icon: Target,
    //   href: '/dashboard/applicant/success-prediction',
    //   active: pathname === '/dashboard/applicant/success-prediction',
    //   description: 'Application success rate'
    // }
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
      description: 'Manage job postings'
      // badge: '8'
    },
    {
      label: 'Applications',
      icon: Users,
      href: '/dashboard/employer/applications',
      active: pathname === '/dashboard/employer/applications',
      description: 'Review applications'
      // badge: '24'
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
      description: 'Communications'
      // badge: notifications.toString()
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
        // {
        //   label: 'System Status',
        //   icon: Activity,
        //   href: '/dashboard/admin/status',
        //   active: pathname === '/dashboard/admin/status'
        // },
        // {
        //   label: 'Integrations',
        //   icon: Network,
        //   href: '/dashboard/admin/integrations',
        //   active: pathname === '/dashboard/admin/integrations'
        // },
        // {
        //   label: 'Help & Support',
        //   icon: HelpCircle,
        //   href: '/dashboard/admin/help',
        //   active: pathname === '/dashboard/admin/help'
        // }
      ];
    } else if (role === 'applicant') {
      return [
        // {
        //   label: 'Resume Conversion',
        //   icon: FileCheck,
        //   href: '/dashboard/applicant/resume-conversion',
        //   active: pathname === '/dashboard/applicant/resume-conversion'
        // },
        // {
        //   label: 'Settings',
        //   icon: Settings,
        //   href: '/dashboard/applicant/settings',
        //   active: pathname === '/dashboard/applicant/settings'
        // },
        // {
        //   label: 'Help & Support',
        //   icon: HelpCircle,
        //   href: '/dashboard/applicant/help',
        //   active: pathname === '/dashboard/applicant/help'
        // }
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
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileOpen}>
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col h-full bg-white/90 backdrop-blur-xl border-r border-white/50 shadow-xl relative overflow-hidden transition-all duration-300 ease-in-out',
          // Desktop behavior
          'hidden lg:flex',
          isCollapsed ? 'lg:w-20' : 'lg:w-80',
          // Mobile behavior
          'lg:relative lg:translate-x-0',
          // Mobile menu
          'fixed inset-y-0 left-0 z-40',
          isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0'
        )}
        role="navigation"
        aria-label={`${getRoleTitle()} navigation`}>
        {/* Header */}
        <div className="p-6 border-b border-white/50 relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 group',
              isCollapsed && 'justify-center w-full'
            )}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 shrink-0">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  InteliHire
                </span>
                <p className="text-sm text-gray-500 font-medium">
                  {getRoleTitle()}
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'hidden lg:flex shrink-0 h-8 w-8 bg-white/60 border-0 hover:bg-white/80 hover:scale-110 transition-all duration-300',
              isCollapsed && 'absolute top-6 right-6'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Profile Section */}
        {(role === 'applicant' || role === 'employer') && !isCollapsed && (
          <div className="p-6 border-b border-white/50 relative z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
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
              {/* <Button
                variant="ghost"
                size="sm"
                className="relative bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 hover:scale-110 transition-all duration-300 shrink-0">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                    {notifications}
                  </Badge>
                )}
              </Button> */}
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
              <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-md"
                  style={{ width: `${getProfileCompletion()}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Profile */}
        {(role === 'applicant' || role === 'employer') && isCollapsed && (
          <div className="p-3 border-b border-white/50 relative z-10 flex justify-center">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer hover:scale-110 transition-transform">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              {/* {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                  {notifications}
                </Badge>
              )} */}
            </div>
          </div>
        )}

        {/* Admin Status Section */}
        {role === 'admin' && !isCollapsed && (
          <div className="p-6 border-b border-white/50 relative z-10 transition-all duration-300">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2">
                {getSystemStatusIcon()}
                <span
                  className={`text-sm font-medium ${getSystemStatusColor()}`}>
                  System {systemStatus}
                </span>
              </div>
              <div className="ml-auto text-xs text-gray-500">
                All systems operational
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Admin Status */}
        {role === 'admin' && isCollapsed && (
          <div className="p-3 border-b border-white/50 relative z-10 flex justify-center">
            <div className="cursor-pointer">{getSystemStatusIcon()}</div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-auto relative z-10 custom-scrollbar">
          <nav className={cn('space-y-1', isCollapsed ? 'px-2' : 'px-4')}>
            <div className="mb-6">
              {routes.map(route => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'group flex items-center rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden',
                    isCollapsed ? 'justify-center p-3 my-2' : 'gap-4 px-4 py-3',
                    route.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm hover:scale-[1.01]'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  aria-label={route.label}
                  aria-current={route.active ? 'page' : undefined}>
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-xl transition-all duration-300 shrink-0',
                      isCollapsed ? 'w-10 h-10' : 'w-10 h-10',
                      route.active
                        ? 'bg-white/20 text-white'
                        : 'bg-white/60 backdrop-blur-sm text-gray-600 group-hover:bg-blue-500 group-hover:text-white'
                    )}>
                    <route.icon className="h-5 w-5" />
                    {route.badge && isCollapsed && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                        {route.badge}
                      </Badge>
                    )}
                  </div>
                  {!isCollapsed && (
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
                                ? 'bg-white/20 text-white border-0'
                                : 'bg-blue-100 text-blue-600 border-0'
                            )}>
                            {route.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <Separator className="my-8 bg-white/50" />

            <div className="mb-6">
              {secondaryRoutes.map(route => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'group flex items-center rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden',
                    isCollapsed ? 'justify-center p-3 my-2' : 'gap-4 px-4 py-3',
                    route.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 backdrop-blur-sm'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  aria-label={route.label}
                  aria-current={route.active ? 'page' : undefined}>
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-lg transition-all duration-300 shrink-0',
                      isCollapsed ? 'w-8 h-8' : 'w-8 h-8',
                      route.active
                        ? 'bg-white/20 text-white'
                        : 'bg-white/60 backdrop-blur-sm text-gray-600 group-hover:bg-blue-500 group-hover:text-white'
                    )}>
                    <route.icon className="h-4 w-4" />
                  </div>
                  {!isCollapsed && (
                    <span className="truncate">{route.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Quick Actions for Applicant */}
        {role === 'applicant' && !isCollapsed && (
          <div className="p-4 border-t border-white/50 relative z-10 transition-all duration-300">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300">
                <Link
                  href="/jobs"
                  className="flex items-center gap-1"
                  onClick={() => setIsMobileOpen(false)}>
                  <Search className="h-3 w-3" />
                  Find Jobs
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300">
                <Link
                  href="/dashboard/applicant/documents"
                  className="flex items-center gap-1"
                  onClick={() => setIsMobileOpen(false)}>
                  <FileText className="h-3 w-3" />
                  Documents
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300">
                <Link
                  href="/dashboard/applicant/pds-template"
                  className="flex items-center gap-1"
                  onClick={() => setIsMobileOpen(false)}>
                  <Download className="h-3 w-3" />
                  PDS Template
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300">
                <Link
                  href="/dashboard/applicant/profile"
                  className="flex items-center gap-1"
                  onClick={() => setIsMobileOpen(false)}>
                  <User className="h-3 w-3" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div
          className={cn(
            'border-t border-white/50 relative z-10 transition-all duration-300',
            isCollapsed ? 'p-3' : 'p-6'
          )}>
          <Button
            variant="ghost"
            className={cn(
              'bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-gray-700 hover:text-red-600 hover:bg-red-50/80',
              isCollapsed
                ? 'w-full justify-center p-3'
                : 'w-full justify-start gap-3'
            )}
            asChild>
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Logout">
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </Link>
          </Button>

          {/* Version */}
          {!isCollapsed && (
            <div className="text-xs text-gray-400 text-center mt-3 font-medium">
              v1.0.0 • InteliHire
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
