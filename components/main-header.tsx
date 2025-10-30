'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Briefcase,
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  FileText,
  Building,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api-service';
import { NotificationCenter } from '@/components/notification-center';
import { toast } from 'sonner';

export function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    console.log('MainHeader - Current User:', currentUser);
    setUser(currentUser);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' }
    // { name: 'Services', href: '/services' },
    // { name: 'About', href: '/about' }
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  let currentRole = user?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30 shadow-lg md:sticky">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute top-0 right-20 w-24 h-24 bg-purple-300/8 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-pink-300/6 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container relative flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                InteliHire
              </span>
              <p className="text-xs text-gray-500 -mt-1 font-medium">
                AI Job Platform
              </p>
            </div>
          </Link>

          {/* Desktop navigation: */}
          <nav className="hidden md:flex md:space-x-2">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 group overflow-hidden',
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                )}>
                <span className="relative z-10">{item.name}</span>
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
                )}
                {!isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Enhanced Search Bar */}
        {/* <div className="hidden lg:flex flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearch} className="relative w-full group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <Input
                type="search"
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 h-11 bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </form>
        </div> */}

        {/* Right Side Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <>
              {/* Enhanced Notifications */}
              {/* <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full h-10 w-10 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
                onClick={() => setNotificationCenterOpen(true)}>
                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                    {notifications}
                  </Badge>
                )}
              </Button> */}

              {/* Enhanced User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 rounded-xl px-4 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        {user.firstName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          'U'}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName}`
                          : 'User'}
                      </p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-2">
                  <DropdownMenuLabel className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {user.firstName?.charAt(0) ||
                            user.email?.charAt(0) ||
                            'U'}
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : 'User'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {user.email}
                        </p>
                        <div className="inline-flex items-center gap-1 mt-1">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-gray-200 to-gray-300" />
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        currentRole === 'admin'
                          ? '/dashboard/admin'
                          : '/dashboard/applicant'
                      }
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <div className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                        Dashboard
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        currentRole === 'admin'
                          ? '/dashboard/admin/profile'
                          : '/dashboard/applicant/profile'
                      }
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <div className="p-1.5 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-200">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                        Profile
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/applicant/applications"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                        My Applications
                      </span>
                    </Link>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/applicant/analytics"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <div className="p-1.5 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors duration-200">
                        Analytics
                      </span>
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator className="bg-gradient-to-r from-gray-200 to-gray-300" />
                  {/* <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/applicant/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                        <Settings className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-700 transition-colors duration-200">
                        Settings
                      </span>
                    </Link>
                  </DropdownMenuItem> */}
                  {/* <DropdownMenuItem asChild>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <div className="p-1.5 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors duration-200">
                        <HelpCircle className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition-colors duration-200">
                        Help & Support
                      </span>
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator className="bg-gradient-to-r from-gray-200 to-gray-300" />
                  <DropdownMenuItem
                    onClick={() => {
                      authAPI.logout().then((response: any) => {
                        console.log(response);
                        if (response.success) {
                          window.location.href = '/login';
                        } else {
                          toast.error(response.message);
                          window.location.href = '/login';
                        }
                      });
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 group text-red-600 focus:text-red-600">
                    <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-200">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium group-hover:text-red-700 transition-colors duration-200">
                      Logout
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="rounded-xl px-4 py-2 font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                <Link href="/login" className="flex items-center gap-2">
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-xl px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group">
                <Link href="/register" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Enhanced Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="relative -m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
            onClick={() => setMobileMenuOpen(true)}>
            <span className="sr-only">Open main menu</span>
            <Menu
              className="h-6 w-6 group-hover:scale-110 transition-transform duration-200"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            'inset-0 z-[120] md:hidden transition-opacity duration-300 opacity-100 pointer-events-auto'
          )}
          aria-hidden={!mobileMenuOpen}>
          {/* Opaque/blur BG overlay for true coverage */}
          <div
            className="absolute inset-0 bg-white/90 backdrop-blur-xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Side menu sheet container, scrolling for overflow */}
          <div
            className={cn(
              'inset-y-0 right-0 z-[121] w-full sm:max-w-sm transform transition-transform duration-300',
              'bg-white px-6 py-6 shadow-2xl overflow-y-auto max-h-screen',
              'translate-x-0'
            )}>
            <div className="relative flex items-center justify-between mb-8">
              {/* logo/title */}
              <Link
                href="/"
                className="flex items-center gap-3 group"
                onClick={() => setMobileMenuOpen(false)}>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    InteliHire
                  </span>
                  <p className="text-xs text-gray-500 -mt-1 font-medium">
                    AI Job Platform
                  </p>
                </div>
              </Link>
              {/* X button */}
              <button
                type="button"
                className="relative -m-2.5 rounded-xl p-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group"
                onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Close menu</span>
                <X
                  className="h-6 w-6 group-hover:scale-110 transition-transform duration-200"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* NAVIGATION AT THE TOP! */}
            <nav className="space-y-1 pb-6">
              {navigation.map(item => (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(item.href);
                  }}
                  className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200">
                  <span className="text-blue-700">{item.name}</span>
                </button>
              ))}
            </nav>

            {/* User/profile/actions section here, after nav */}
            <div className="py-2">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                        {user.firstName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          'U'}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName}`
                          : 'User'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={
                      currentRole === 'admin'
                        ? '/dashboard/admin'
                        : '/dashboard/applicant'
                    }
                    className="flex items-center gap-3 -mx-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                    onClick={() => setMobileMenuOpen(false)}>
                    <div className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="group-hover:text-blue-700 transition-colors duration-200">
                      Dashboard
                    </span>
                  </Link>
                  {/* <Link
                    href={
                      currentRole === 'admin'
                        ? '/dashboard/admin/profile'
                        : '/dashboard/applicant/profile'
                    }
                    className="flex items-center gap-3 -mx-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                    onClick={() => setMobileMenuOpen(false)}>
                    <div className="p-1.5 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-200">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="group-hover:text-green-700 transition-colors duration-200">
                      Profile
                    </span>
                  </Link> */}
                  <button
                    onClick={() => {
                      authAPI.logout();
                      setMobileMenuOpen(false);
                      window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 -mx-3 w-full text-left rounded-xl px-4 py-3 text-base font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group">
                    <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-200">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="group-hover:text-red-700 transition-colors duration-200">
                      Logout
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <>
                    <button
                      className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push('/login');
                      }}>
                      <span className="text-blue-700">Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push('/register');
                      }}>
                      <span className="text-blue-700">Register</span>
                    </button>{' '}
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Center */}
      {/* <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        userId={user?.id}
      /> */}
    </header>
  );
}
