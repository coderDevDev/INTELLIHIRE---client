'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Bell,
  ChevronRight,
  Search,
  TrendingUp,
  Calendar,
  Shield,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { authAPI } from '@/lib/api-service';
import { useEffect, useState } from 'react';

export function ApplicantSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const routes = [
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
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/applicant/messages',
      active: pathname === '/dashboard/applicant/messages',
      description: 'Communications',
      badge: notifications.toString()
    },
    {
      label: 'Job Matches',
      icon: Search,
      href: '/dashboard/applicant/matches',
      active: pathname === '/dashboard/applicant/matches',
      description: 'Recommended jobs'
    },
    {
      label: 'Analytics',
      icon: TrendingUp,
      href: '/dashboard/applicant/analytics',
      active: pathname === '/dashboard/applicant/analytics',
      description: 'Application insights'
    }
  ];

  const secondaryRoutes = [
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
            <p className="text-xs text-gray-500">Job Platform</p>
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
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

        {/* Profile Completion */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile</span>
            <span className="text-sm text-gray-500">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '75%' }}></div>
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
                    {route.badge && (
                      <Badge
                        variant={route.active ? 'secondary' : 'default'}
                        className="ml-auto text-xs">
                        {route.badge}
                      </Badge>
                    )}
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
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    route.active
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Account
            </h3>
            {secondaryRoutes.map(route => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                  route.active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}>
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                    route.active
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700'
                  )}>
                  <route.icon className="h-4 w-4" />
                </div>
                <span className="truncate">{route.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-3">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link href="/jobs" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                Find Jobs
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link
                href="/dashboard/applicant/profile"
                className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Profile
              </Link>
            </Button>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
            asChild>
            <Link href="/login">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </Button>

          {/* Version */}
          <div className="text-xs text-gray-400 text-center">
            v1.0.0 • InteliHire
          </div>
        </div>
      </div>
    </div>
  );
}
