import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  variant?: 'default' | 'gradient' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  size = 'md',
  className
}: StatsCardProps) {
  const sizeClasses = {
    sm: {
      card: 'p-4',
      title: 'text-sm',
      value: 'text-2xl',
      description: 'text-xs',
      icon: 'h-8 w-8'
    },
    md: {
      card: 'p-6',
      title: 'text-sm',
      value: 'text-3xl',
      description: 'text-sm',
      icon: 'h-10 w-10'
    },
    lg: {
      card: 'p-8',
      title: 'text-base',
      value: 'text-4xl',
      description: 'text-base',
      icon: 'h-12 w-12'
    }
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    gradient:
      'bg-gradient-to-br from-brand-blue to-blue-600 text-white border-0 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-200 hover:border-brand-blue'
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 group hover:scale-105',
        variantClasses[variant],
        sizeClasses[size].card,
        className
      )}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p
              className={cn(
                'font-medium text-gray-600 mb-1',
                sizeClasses[size].title,
                variant === 'gradient' && 'text-blue-100'
              )}>
              {title}
            </p>

            <p
              className={cn(
                'font-bold text-gray-900 mb-1',
                sizeClasses[size].value,
                variant === 'gradient' && 'text-white'
              )}>
              {value}
            </p>

            {description && (
              <p
                className={cn(
                  'text-gray-500',
                  sizeClasses[size].description,
                  variant === 'gradient' && 'text-blue-100'
                )}>
                {description}
              </p>
            )}

            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}>
                  {trend.value}%
                </span>
                <span
                  className={cn(
                    'text-sm text-gray-500',
                    sizeClasses[size].description
                  )}>
                  {trend.label}
                </span>
              </div>
            )}
          </div>

          {Icon && (
            <div
              className={cn(
                'flex items-center justify-center rounded-lg p-2',
                sizeClasses[size].icon,
                variant === 'gradient'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-brand-blue group-hover:text-white'
              )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined stats cards
export function ApplicationsStatsCard({
  count,
  trend
}: {
  count: number;
  trend?: number;
}) {
  return (
    <StatsCard
      title="Total Applications"
      value={count}
      description="Active applications"
      icon={require('lucide-react').Briefcase}
      variant="gradient"
      trend={
        trend
          ? {
              value: Math.abs(trend),
              isPositive: trend > 0,
              label: 'from last month'
            }
          : undefined
      }
    />
  );
}

export function DocumentsStatsCard({ count }: { count: number }) {
  return (
    <StatsCard
      title="Documents"
      value={count}
      description="PDS & Resume uploaded"
      icon={require('lucide-react').FileUp}
      variant="default"
    />
  );
}

export function MatchesStatsCard({
  count,
  trend
}: {
  count: number;
  trend?: number;
}) {
  return (
    <StatsCard
      title="Job Matches"
      value={count}
      description="Based on your profile"
      icon={require('lucide-react').Search}
      variant="default"
      trend={
        trend
          ? {
              value: Math.abs(trend),
              isPositive: trend > 0,
              label: 'new matches'
            }
          : undefined
      }
    />
  );
}

export function ProfileCompletionCard({ percentage }: { percentage: number }) {
  return (
    <StatsCard
      title="Profile Completion"
      value={`${percentage}%`}
      description="Complete your profile"
      icon={require('lucide-react').TrendingUp}
      variant="outlined"
    />
  );
}
