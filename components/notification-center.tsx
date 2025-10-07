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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Settings,
  Check,
  Trash2,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Briefcase,
  FileText,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Zap,
  Shield,
  Award,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'job'
    | 'application'
    | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    jobId?: string;
    applicationId?: string;
    userId?: string;
    companyId?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export function NotificationCenter({
  isOpen,
  onClose,
  userId
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<
    'all' | 'unread' | 'job' | 'application' | 'system'
  >('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'job',
          title: 'New Job Match Found',
          message:
            'A Software Developer position at Tech Corp matches your profile 95%',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          read: false,
          priority: 'high',
          category: 'Job Recommendations',
          actionUrl: '/jobs/123',
          actionText: 'View Job',
          metadata: { jobId: '123', companyId: 'tech-corp' }
        },
        {
          id: '2',
          type: 'application',
          title: 'Application Status Update',
          message:
            'Your application for Nurse position at City Hospital has been approved',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          priority: 'high',
          category: 'Application Updates',
          actionUrl: '/dashboard/applicant/applications/456',
          actionText: 'View Application',
          metadata: { applicationId: '456', jobId: 'nurse-123' }
        },
        {
          id: '3',
          type: 'system',
          title: 'Profile Completion Reminder',
          message: 'Complete your profile to get better job recommendations',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          priority: 'medium',
          category: 'Profile',
          actionUrl: '/dashboard/applicant/profile',
          actionText: 'Complete Profile'
        },
        {
          id: '4',
          type: 'info',
          title: 'New Feature Available',
          message: 'AI-powered job matching is now available in your dashboard',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          read: true,
          priority: 'low',
          category: 'System Updates'
        },
        {
          id: '5',
          type: 'warning',
          title: 'Document Expiring Soon',
          message:
            'Your PDS document will expire in 30 days. Please update it.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
          priority: 'medium',
          category: 'Documents',
          actionUrl: '/dashboard/applicant/documents',
          actionText: 'Update Documents'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'job':
        return <Briefcase className="h-5 w-5 text-purple-600" />;
      case 'application':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'job') return notif.type === 'job';
    if (filter === 'application') return notif.type === 'application';
    if (filter === 'system') return notif.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-xl border-l border-white/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/50">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/60">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-white/50">
          <div className="flex gap-2 mb-3">
            {(['all', 'unread', 'job', 'application', 'system'] as const).map(
              filterType => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={cn(
                    'capitalize',
                    filter === filterType
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-white/60'
                  )}>
                  {filterType}
                </Button>
              )
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="w-full bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : `No ${filter} notifications found`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <Card
                  key={notification.id}
                  className={cn(
                    'group hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 hover:-translate-y-1',
                    !notification.read &&
                      'ring-2 ring-blue-500/20 bg-blue-50/60'
                  )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4
                            className={cn(
                              'font-semibold text-sm',
                              !notification.read
                                ? 'text-gray-900'
                                : 'text-gray-700'
                            )}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-xs',
                                getPriorityColor(notification.priority)
                              )}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(notification.timestamp)}
                            {notification.category && (
                              <>
                                <span>•</span>
                                <span>{notification.category}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {notification.actionUrl &&
                              notification.actionText && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-6 px-2 hover:bg-white/60"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    // Navigate to action URL
                                    window.location.href =
                                      notification.actionUrl!;
                                  }}>
                                  {notification.actionText}
                                </Button>
                              )}

                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-white/60"
                                onClick={() => markAsRead(notification.id)}>
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
