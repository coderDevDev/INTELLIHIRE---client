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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Award,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  Target,
  Zap,
  Brain,
  FileText,
  GraduationCap,
  Briefcase,
  MapPin
} from 'lucide-react';
import { userAPI, jobAPI, applicationAPI } from '@/lib/api-service';
import { toast } from 'sonner';

interface ApplicantRanking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  overallScore: number;
  educationScore: number;
  experienceScore: number;
  skillsScore: number;
  locationScore: number;
  profileCompleteness: number;
  applications: number;
  successfulApplications: number;
  lastActive: string;
  documents: {
    hasPDS: boolean;
    hasResume: boolean;
    hasCertificates: boolean;
  };
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: Array<{
    position: string;
    company: string;
    duration: string;
  }>;
}

interface RankingCriteria {
  education: number;
  experience: number;
  skills: number;
  location: number;
  profileCompleteness: number;
  applicationHistory: number;
}

export default function ApplicantRankingPage() {
  const [rankings, setRankings] = useState<ApplicantRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [criteria, setCriteria] = useState<RankingCriteria>({
    education: 25,
    experience: 30,
    skills: 20,
    location: 10,
    profileCompleteness: 10,
    applicationHistory: 5
  });
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'overall' | 'education' | 'experience' | 'skills'>('overall');

  useEffect(() => {
    fetchRankings();
  }, [selectedJob, criteria]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      
      // Fetch applicants and applications data
      const [applicantsRes, applicationsRes] = await Promise.all([
        userAPI.getApplicants({ limit: 1000, page: 1 }),
        applicationAPI.getAdminApplications({ limit: 1000, page: 1 })
      ]);

      const applicants = applicantsRes.users || applicantsRes || [];
      const applications = applicationsRes.applications || applicationsRes || [];

      // Calculate rankings
      const rankedApplicants = applicants.map((applicant: any) => {
        const userApplications = applications.filter((app: any) => 
          app.userId === applicant._id
        );
        const successfulApps = userApplications.filter((app: any) => 
          ['hired', 'offered'].includes(app.status)
        );

        // Calculate individual scores
        const educationScore = calculateEducationScore(applicant);
        const experienceScore = calculateExperienceScore(applicant);
        const skillsScore = calculateSkillsScore(applicant);
        const locationScore = calculateLocationScore(applicant);
        const profileCompleteness = calculateProfileCompleteness(applicant);
        const applicationHistoryScore = calculateApplicationHistoryScore(userApplications, successfulApps);

        // Calculate overall score based on criteria weights
        const overallScore = Math.round(
          (educationScore * criteria.education / 100) +
          (experienceScore * criteria.experience / 100) +
          (skillsScore * criteria.skills / 100) +
          (locationScore * criteria.location / 100) +
          (profileCompleteness * criteria.profileCompleteness / 100) +
          (applicationHistoryScore * criteria.applicationHistory / 100)
        );

        return {
          _id: applicant._id,
          firstName: applicant.firstName || 'Unknown',
          lastName: applicant.lastName || 'User',
          email: applicant.email,
          overallScore,
          educationScore,
          experienceScore,
          skillsScore,
          locationScore,
          profileCompleteness,
          applications: userApplications.length,
          successfulApplications: successfulApps.length,
          lastActive: applicant.updatedAt || applicant.createdAt,
          documents: {
            hasPDS: !!applicant.pdsFile,
            hasResume: !!applicant.resumeFile,
            hasCertificates: applicant.certification && applicant.certification.length > 0
          },
          skills: applicant.skills || [],
          education: applicant.education || [],
          experience: applicant.experience || []
        };
      });

      // Sort by selected criteria
      const sortedRankings = rankedApplicants.sort((a, b) => {
        switch (sortBy) {
          case 'education':
            return b.educationScore - a.educationScore;
          case 'experience':
            return b.experienceScore - a.experienceScore;
          case 'skills':
            return b.skillsScore - a.skillsScore;
          default:
            return b.overallScore - a.overallScore;
        }
      });

      setRankings(sortedRankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      toast.error('Failed to load applicant rankings');
    } finally {
      setLoading(false);
    }
  };

  const calculateEducationScore = (applicant: any) => {
    if (!applicant.education || applicant.education.length === 0) return 0;
    
    let score = 0;
    applicant.education.forEach((edu: any) => {
      const degree = (edu.degree || '').toLowerCase();
      if (degree.includes('phd') || degree.includes('doctor')) score += 100;
      else if (degree.includes('master') || degree.includes('ms') || degree.includes('ma')) score += 80;
      else if (degree.includes('bachelor') || degree.includes('bs') || degree.includes('ba')) score += 60;
      else if (degree.includes('associate') || degree.includes('diploma')) score += 40;
      else if (degree.includes('high school')) score += 20;
    });
    
    return Math.min(score, 100);
  };

  const calculateExperienceScore = (applicant: any) => {
    if (!applicant.experience || applicant.experience.length === 0) return 0;
    
    const experienceCount = applicant.experience.length;
    const yearsOfExperience = estimateYearsOfExperience(applicant.experience);
    
    let score = Math.min(experienceCount * 10, 50); // Up to 50 points for number of positions
    score += Math.min(yearsOfExperience * 5, 50); // Up to 50 points for years of experience
    
    return Math.min(score, 100);
  };

  const calculateSkillsScore = (applicant: any) => {
    if (!applicant.skills || applicant.skills.length === 0) return 0;
    
    const skillCount = applicant.skills.length;
    return Math.min(skillCount * 5, 100); // 5 points per skill, max 100
  };

  const calculateLocationScore = (applicant: any) => {
    // Mock location scoring - in real implementation, this would consider job locations
    return Math.random() * 100; // Random score for demo
  };

  const calculateProfileCompleteness = (applicant: any) => {
    const fields = [
      applicant.firstName,
      applicant.lastName,
      applicant.phoneNumber,
      applicant.address,
      applicant.education?.length > 0,
      applicant.experience?.length > 0,
      applicant.skills?.length > 0,
      applicant.pdsFile,
      applicant.resumeFile
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const calculateApplicationHistoryScore = (applications: any[], successfulApps: any[]) => {
    if (applications.length === 0) return 0;
    
    const successRate = (successfulApps.length / applications.length) * 100;
    return Math.min(successRate, 100);
  };

  const estimateYearsOfExperience = (experience: any[]) => {
    return experience.reduce((total, exp) => {
      // Simple estimation - in real implementation, parse actual dates
      return total + 2; // Assume 2 years per position
    }, 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-blue-100 text-blue-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const filteredRankings = rankings.filter(applicant =>
    `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading applicant rankings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Applicant Ranking
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered applicant ranking and evaluation system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRankings}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Rankings
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export Rankings
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Ranking Criteria */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Ranking Criteria
              </CardTitle>
              <CardDescription>
                Adjust the weight of different factors in the ranking algorithm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Education</Label>
                    <span className="text-sm text-gray-600">{criteria.education}%</span>
                  </div>
                  <Progress value={criteria.education} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Experience</Label>
                    <span className="text-sm text-gray-600">{criteria.experience}%</span>
                  </div>
                  <Progress value={criteria.experience} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Skills</Label>
                    <span className="text-sm text-gray-600">{criteria.skills}%</span>
                  </div>
                  <Progress value={criteria.skills} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Location</Label>
                    <span className="text-sm text-gray-600">{criteria.location}%</span>
                  </div>
                  <Progress value={criteria.location} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Profile Completeness</Label>
                    <span className="text-sm text-gray-600">{criteria.profileCompleteness}%</span>
                  </div>
                  <Progress value={criteria.profileCompleteness} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Application History</Label>
                    <span className="text-sm text-gray-600">{criteria.applicationHistory}%</span>
                  </div>
                  <Progress value={criteria.applicationHistory} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortBy('overall')}
                    className={sortBy === 'overall' ? 'bg-blue-500 text-white' : 'bg-white/60 backdrop-blur-sm border-white/50'}>
                    Overall Score
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortBy('education')}
                    className={sortBy === 'education' ? 'bg-blue-500 text-white' : 'bg-white/60 backdrop-blur-sm border-white/50'}>
                    Education
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortBy('experience')}
                    className={sortBy === 'experience' ? 'bg-blue-500 text-white' : 'bg-white/60 backdrop-blur-sm border-white/50'}>
                    Experience
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredRankings.length} of {rankings.length} applicants
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rankings List */}
          <div className="space-y-4">
            {filteredRankings.map((applicant, index) => (
              <Card key={applicant._id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {applicant.firstName} {applicant.lastName}
                          </h3>
                          <Badge className={`text-xs ${getScoreBadgeColor(applicant.overallScore)}`}>
                            {applicant.overallScore} points
                          </Badge>
                          {index < 3 && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Top {index + 1}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{applicant.email}</p>
                        
                        {/* Score Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(applicant.educationScore)}`}>
                              {applicant.educationScore}
                            </div>
                            <div className="text-xs text-gray-600">Education</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(applicant.experienceScore)}`}>
                              {applicant.experienceScore}
                            </div>
                            <div className="text-xs text-gray-600">Experience</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(applicant.skillsScore)}`}>
                              {applicant.skillsScore}
                            </div>
                            <div className="text-xs text-gray-600">Skills</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(applicant.locationScore)}`}>
                              {applicant.locationScore}
                            </div>
                            <div className="text-xs text-gray-600">Location</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(applicant.profileCompleteness)}`}>
                              {applicant.profileCompleteness}%
                            </div>
                            <div className="text-xs text-gray-600">Profile</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {applicant.applications}
                            </div>
                            <div className="text-xs text-gray-600">Applications</div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {applicant.education.length} degrees
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {applicant.experience.length} positions
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {applicant.skills.length} skills
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {applicant.successfulApplications} successful
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        <Brain className="h-4 w-4 mr-2" />
                        AI Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
