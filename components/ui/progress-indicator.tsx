import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  icon?: React.ReactNode;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  showLabels = true,
  className
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: {
      container: 'gap-2',
      step: 'gap-2',
      icon: 'h-4 w-4',
      label: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'gap-4',
      step: 'gap-3',
      icon: 'h-5 w-5',
      label: 'text-sm',
      description: 'text-xs'
    },
    lg: {
      container: 'gap-6',
      step: 'gap-4',
      icon: 'h-6 w-6',
      label: 'text-base',
      description: 'text-sm'
    }
  };

  const getStepIcon = (step: Step) => {
    if (step.icon) return step.icon;

    switch (step.status) {
      case 'completed':
        return (
          <CheckCircle
            className={cn('text-green-600', sizeClasses[size].icon)}
          />
        );
      case 'current':
        return (
          <Clock className={cn('text-blue-600', sizeClasses[size].icon)} />
        );
      case 'upcoming':
        return (
          <Circle className={cn('text-gray-400', sizeClasses[size].icon)} />
        );
    }
  };

  const getStepClasses = (step: Step) => {
    const baseClasses = 'flex items-center transition-all duration-200';

    switch (step.status) {
      case 'completed':
        return cn(baseClasses, 'text-green-600');
      case 'current':
        return cn(baseClasses, 'text-blue-600');
      case 'upcoming':
        return cn(baseClasses, 'text-gray-400');
    }
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={cn('flex flex-col', sizeClasses[size].container, className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start">
            <div
              className={cn(
                'flex flex-col items-center',
                sizeClasses[size].step
              )}>
              <div className={getStepClasses(step)}>{getStepIcon(step)}</div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-8 transition-colors duration-200',
                    step.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                  )}
                />
              )}
            </div>

            {showLabels && (
              <div className="ml-3 flex-1">
                <div
                  className={cn(
                    'font-medium',
                    sizeClasses[size].label,
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'current' && 'text-blue-600',
                    step.status === 'upcoming' && 'text-gray-400'
                  )}>
                  {step.label}
                </div>
                {step.description && (
                  <div
                    className={cn(
                      'text-gray-500',
                      sizeClasses[size].description
                    )}>
                    {step.description}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center',
        sizeClasses[size].container,
        className
      )}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              'flex flex-col items-center',
              sizeClasses[size].step
            )}>
            <div className={getStepClasses(step)}>{getStepIcon(step)}</div>

            {showLabels && (
              <div className="text-center mt-2">
                <div
                  className={cn(
                    'font-medium',
                    sizeClasses[size].label,
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'current' && 'text-blue-600',
                    step.status === 'upcoming' && 'text-gray-400'
                  )}>
                  {step.label}
                </div>
                {step.description && (
                  <div
                    className={cn(
                      'text-gray-500',
                      sizeClasses[size].description
                    )}>
                    {step.description}
                  </div>
                )}
              </div>
            )}
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-8 h-0.5 transition-colors duration-200',
                step.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Application status stepper
export function ApplicationStepper({ status }: { status: string }) {
  const steps = [
    {
      id: 'applied',
      label: 'Applied',
      description: 'Application submitted',
      status: 'completed' as const
    },
    {
      id: 'screening',
      label: 'Screening',
      description: 'Under review',
      status: 'current' as const
    },
    {
      id: 'interview',
      label: 'Interview',
      description: 'Interview scheduled',
      status: 'upcoming' as const
    },
    {
      id: 'offered',
      label: 'Offered',
      description: 'Job offer received',
      status: 'upcoming' as const
    },
    {
      id: 'hired',
      label: 'Hired',
      description: 'Position accepted',
      status: 'upcoming' as const
    }
  ];

  // Update step statuses based on current status
  const currentStepIndex = steps.findIndex(step => step.id === status);

  const updatedSteps = steps.map((step, index) => {
    if (index < currentStepIndex) {
      return { ...step, status: 'completed' as const };
    } else if (index === currentStepIndex) {
      return { ...step, status: 'current' as const };
    } else {
      return { ...step, status: 'upcoming' as const };
    }
  });

  return (
    <ProgressIndicator
      steps={updatedSteps}
      orientation="vertical"
      size="md"
      className="mt-4"
    />
  );
}

// Profile completion stepper
export function ProfileCompletionStepper({
  completion
}: {
  completion: number;
}) {
  const steps = [
    {
      id: 'personal',
      label: 'Personal Info',
      description: 'Basic information',
      status: 'completed' as const
    },
    {
      id: 'education',
      label: 'Education',
      description: 'Academic background',
      status: 'completed' as const
    },
    {
      id: 'experience',
      label: 'Experience',
      description: 'Work history',
      status: 'completed' as const
    },
    {
      id: 'skills',
      label: 'Skills',
      description: 'Certifications',
      status: 'upcoming' as const
    }
  ];

  // Calculate which steps are completed based on completion percentage
  const completedSteps = Math.floor((completion / 100) * steps.length);

  const updatedSteps = steps.map((step, index) => {
    if (index < completedSteps) {
      return { ...step, status: 'completed' as const };
    } else if (index === completedSteps && completion < 100) {
      return { ...step, status: 'current' as const };
    } else {
      return { ...step, status: 'upcoming' as const };
    }
  });

  return (
    <ProgressIndicator
      steps={updatedSteps}
      orientation="horizontal"
      size="sm"
      className="mt-4"
    />
  );
}
