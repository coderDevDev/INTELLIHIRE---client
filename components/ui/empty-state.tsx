import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };

  const ActionButton = ({
    action,
    variant = 'default'
  }: {
    action: any;
    variant?: 'default' | 'outline' | 'secondary';
  }) => {
    if (action.href) {
      return (
        <Button variant={variant} asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      );
    }
    return (
      <Button variant={variant} onClick={action.onClick}>
        {action.label}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size].container,
        className
      )}>
      {Icon && (
        <div
          className={cn(
            'flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6',
            sizeClasses[size].icon
          )}>
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <h3
        className={cn(
          'font-semibold text-gray-900 mb-2',
          sizeClasses[size].title
        )}>
        {title}
      </h3>

      <p
        className={cn(
          'text-gray-600 max-w-md mb-6',
          sizeClasses[size].description
        )}>
        {description}
      </p>

      <div className="flex gap-3">
        {action && <ActionButton action={action} variant={action.variant} />}
        {secondaryAction && (
          <ActionButton action={secondaryAction} variant="outline" />
        )}
      </div>
    </div>
  );
}

// Predefined empty states
export function EmptyApplications() {
  return (
    <EmptyState
      icon={require('lucide-react').FileText}
      title="No Applications Yet"
      description="You haven't applied to any jobs yet. Start your job search journey today!"
      action={{
        label: 'Browse Jobs',
        href: '/jobs'
      }}
      secondaryAction={{
        label: 'Complete Profile',
        href: '/dashboard/applicant/profile'
      }}
    />
  );
}

export function EmptyJobs() {
  return (
    <EmptyState
      icon={require('lucide-react').Briefcase}
      title="No Jobs Found"
      description="We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms."
      action={{
        label: 'Clear Filters',
        onClick: () => window.location.reload()
      }}
      secondaryAction={{
        label: 'Browse All Jobs',
        href: '/jobs'
      }}
    />
  );
}

export function EmptyDocuments() {
  return (
    <EmptyState
      icon={require('lucide-react').FileUp}
      title="No Documents Uploaded"
      description="Upload your PDS and resume to make your profile complete and improve your job applications."
      action={{
        label: 'Upload Documents',
        href: '/dashboard/applicant/documents'
      }}
    />
  );
}

export function EmptyMessages() {
  return (
    <EmptyState
      icon={require('lucide-react').MessageSquare}
      title="No Messages Yet"
      description="You don't have any messages yet. Messages from employers will appear here."
      action={{
        label: 'Browse Jobs',
        href: '/jobs'
      }}
    />
  );
}
