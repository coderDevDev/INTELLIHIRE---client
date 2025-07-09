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
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api-service';

export function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(5);
  const [systemStatus, setSystemStatus] = useState('operational');

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const routes = [
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
    // {
    //   label: 'Documents',
    //   icon: FileText,
    //   href: '/dashboard/admin/documents',
    //   active: pathname === '/dashboard/admin/documents',
    //   description: 'PDS and resumes',
    //   badge: '189'
    // },
    // {
    //   label: 'Analytics',
    //   icon: BarChart,
    //   href: '/dashboard/admin/analytics',
    //   active: pathname === '/dashboard/admin/analytics',
    //   description: 'System analytics'
    // },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/admin/messages',
      active: pathname === '/dashboard/admin/messages',
      description: 'Communications',
      badge: notifications.toString()
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/admin/settings',
      active: pathname === '/dashboard/admin/settings',
      description: 'System settings'
    }
  ];

  const secondaryRoutes = [
    {
      label: 'System Status',
      icon: Activity,
      href: '/dashboard/admin/status',
      active: pathname === '/dashboard/admin/status'
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      href: '/dashboard/admin/help',
      active: pathname === '/dashboard/admin/help'
    }
  ];

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

  return (
    <div className="flex flex-col h-screen w-72 bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-900">InteliHire</span>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Admin Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin'}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>

        {/* System Status */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              System Status
            </span>
            {getSystemStatusIcon()}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('text-sm', getSystemStatusColor())}>
              {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
            </span>
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-auto">
        <nav className="space-y-1 px-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Main Navigation
            </h3>
            {routes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden',
                  route.active
                    ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}>
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                    route.active
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-brand-blue group-hover:text-white'
                  )}>
                  <route.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{route.label}</span>
                    {/* {route.badge && (
                      <Badge
                        variant={route.active ? 'secondary' : 'default'}
                        className="ml-auto text-xs">
                        {route.badge}
                      </Badge>
                    )} */}
                  </div>
                  {route.description && (
                    <p
                      className={cn(
                        'text-xs truncate',
                        route.active ? 'text-blue-100' : 'text-gray-500'
                      )}>
                      {route.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              System
            </h3>
            {secondaryRoutes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden',
                  route.active
                    ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}>
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                    route.active
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-brand-blue group-hover:text-white'
                  )}>
                  <route.icon className="h-4 w-4" />
                </div>
                <span className="truncate">{route.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      {/* Logout Button */}
      <div className="p-6 border-t border-gray-100">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/login">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
}
