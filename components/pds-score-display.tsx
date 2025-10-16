'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  BookOpen,
  Briefcase,
  BadgeCheck,
  FileCheck,
  GraduationCap,
  Target,
  TrendingUp
} from 'lucide-react';
import { PDSScoreBreakdown, CriteriaScore } from '@/types/scoring.types';

interface PDSScoreDisplayProps {
  scoreBreakdown: PDSScoreBreakdown;
  applicantName?: string;
  showDetails?: boolean;
  compact?: boolean;
}

const criteriaIcons: Record<string, any> = {
  education: GraduationCap,
  experience: Briefcase,
  training: BookOpen,
  eligibility: FileCheck,
  skills: Target,
  awards: Award,
  relevantExperience: TrendingUp,
  certifications: BadgeCheck
};

const criteriaColors: Record<string, string> = {
  education: 'text-blue-600 bg-blue-50 border-blue-200',
  experience: 'text-purple-600 bg-purple-50 border-purple-200',
  training: 'text-green-600 bg-green-50 border-green-200',
  eligibility: 'text-orange-600 bg-orange-50 border-orange-200',
  skills: 'text-pink-600 bg-pink-50 border-pink-200',
  awards: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  relevantExperience: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  certifications: 'text-teal-600 bg-teal-50 border-teal-200'
};

export function PDSScoreDisplay({
  scoreBreakdown,
  applicantName,
  showDetails = true,
  compact = false
}: PDSScoreDisplayProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', className: 'bg-green-100 text-green-700' };
    if (percentage >= 75) return { label: 'Very Good', className: 'bg-blue-100 text-blue-700' };
    if (percentage >= 60) return { label: 'Good', className: 'bg-orange-100 text-orange-700' };
    return { label: 'Fair', className: 'bg-red-100 text-red-700' };
  };

  const scoreBadge = getScoreBadge(scoreBreakdown.percentage);

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
        <div>
          <div className="text-sm text-gray-600">PDS Score</div>
          <div className={`text-2xl font-bold ${getScoreColor(scoreBreakdown.percentage)}`}>
            {scoreBreakdown.totalScore} / {scoreBreakdown.maxPossibleScore}
          </div>
        </div>
        <Badge className={scoreBadge.className}>{scoreBadge.label}</Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">PDS Evaluation Score</CardTitle>
              {applicantName && (
                <CardDescription className="text-base mt-1">
                  Applicant: <strong>{applicantName}</strong>
                </CardDescription>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={scoreBadge.className + ' text-lg px-4 py-1'}>
                {scoreBadge.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {scoreBreakdown.scoringSystemUsed === 'job-custom'
                  ? 'Job-Specific Scoring'
                  : scoreBreakdown.scoringSystemUsed === 'company-custom'
                  ? 'Company Custom Scoring'
                  : 'Default System Scoring'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Score */}
            <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-6xl font-bold text-gray-900">
                {scoreBreakdown.totalScore}
                <span className="text-3xl text-gray-500">
                  /{scoreBreakdown.maxPossibleScore}
                </span>
              </div>
              <div className="text-xl font-semibold text-gray-700 mt-2">
                {scoreBreakdown.percentage.toFixed(1)}% Match
              </div>
              <Progress
                value={scoreBreakdown.percentage}
                className="w-3/4 mx-auto mt-4 h-3"
              />
            </div>

            {showDetails && scoreBreakdown.appliedDate && (
              <div className="text-sm text-gray-600 text-center">
                Evaluated on: {new Date(scoreBreakdown.appliedDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown by Criteria</CardTitle>
            <CardDescription>
              Detailed points breakdown showing how the total score was calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {(Object.keys(scoreBreakdown.criteriaScores) as Array<keyof typeof scoreBreakdown.criteriaScores>).map(
                (key) => {
                  const criteria = scoreBreakdown.criteriaScores[key];
                  
                  if (!criteria.enabled) return null;

                  const Icon = criteriaIcons[key] || Target;
                  const colorClass = criteriaColors[key] || 'text-gray-600 bg-gray-50 border-gray-200';

                  return (
                    <Card key={key} className={`border-2 ${colorClass}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-sm font-semibold">
                              {criteria.label}
                            </CardTitle>
                            <div className="text-xs text-gray-600">
                              Weight: {criteria.weight}%
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Score */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-3xl font-bold">
                              {criteria.earnedPoints}
                              <span className="text-lg text-gray-500">
                                /{criteria.maxPoints}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {criteria.percentage.toFixed(1)}% of max
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              criteria.percentage >= 80
                                ? 'bg-green-50 text-green-700 border-green-300'
                                : criteria.percentage >= 60
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : 'bg-orange-50 text-orange-700 border-orange-300'
                            }>
                            {criteria.percentage >= 80
                              ? 'Excellent'
                              : criteria.percentage >= 60
                              ? 'Good'
                              : 'Fair'}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <Progress value={criteria.percentage} className="h-2" />

                        {/* Matched Criteria */}
                        {criteria.matchedCriteria && (
                          <div className="text-xs">
                            <div className="font-semibold text-gray-700 mb-1">
                              Qualification Met:
                            </div>
                            <div className="p-2 bg-white rounded border text-gray-600">
                              {criteria.matchedCriteria}
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        {criteria.details && (
                          <div className="text-xs text-gray-600 italic">
                            {criteria.details}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-sm font-semibold text-gray-700">
              📊 Scoring System Information
            </div>
            <div className="text-xs text-gray-600 max-w-2xl mx-auto">
              This score is calculated based on the{' '}
              <strong>
                {scoreBreakdown.scoringSystemUsed === 'job-custom'
                  ? 'job-specific'
                  : scoreBreakdown.scoringSystemUsed === 'company-custom'
                  ? 'company-customized'
                  : 'standard default'}
              </strong>{' '}
              PDS scoring criteria. Each criterion is weighted according to its importance
              for this position, ensuring a fair and objective evaluation aligned with the
              organization's requirements.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
