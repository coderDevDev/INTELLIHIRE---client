'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  Award,
  Download,
  RefreshCw,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  BarChart3,
  FileText,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  MapPin,
  Target,
  Edit3,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import applicantRankingAPI from '@/lib/api/applicantRankingAPI';
import { applicationAPI } from '@/lib/api-service';
import { ResumeModal } from '@/components/resume-modal';

interface ApplicantRanking {
  _id: string;
  applicantId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
  };
  jobId: {
    _id: string;
    title: string;
    companyId: string;
  };
  applicationId: {
    _id: string;
    appliedAt: string;
    status: string;
  };
  overallScore: number;
  algorithmicScore: number;
  aiScore: number;
  scoringBreakdown: {
    experienceScore: number;
    skillsScore: number;
    educationScore: number;
    locationScore: number;
    atsKeywordsScore: number;
  };
  matchReasons: string[];
  concerns: string[];
  strengths: string[];
  rank: number;
  totalApplicants: number;
  percentile: number;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  isManuallyAdjusted: boolean;
  manualAdjustmentReason?: string;
  adminNotes?: string;
  rankedAt: string;
  lastUpdated: string;
}

interface Job {
  _id: string;
  title: string;
  companyId: {
    _id: string;
    name: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  postedDate: string;
  expiryDate: string;
  applicationCount: number;
}

interface RankingStats {
  totalRankings: number;
  averageScore: number;
  statusCounts: {
    pending: number;
    shortlisted: number;
    rejected: number;
    hired: number;
  };
  topPerformers: ApplicantRanking[];
  recentRankings: ApplicantRanking[];
}

function ApplicantRankingPageContent() {
  const searchParams = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');

  // State management
  const [activeTab, setActiveTab] = useState('job-rankings');
  const [rankings, setRankings] = useState<ApplicantRanking[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<RankingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [autoRecalculated, setAutoRecalculated] = useState(false);

  // Filters
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRanking, setSelectedRanking] =
    useState<ApplicantRanking | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [resumeMetadata, setResumeMetadata] = useState<any>(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adjustingRanking, setAdjustingRanking] = useState(false);

  // Status update form
  const [statusUpdateData, setStatusUpdateData] = useState({
    applicationStatus: '',
    statusNotes: '',
    interviewDate: '',
    interviewLocation: '',
    interviewType: '',
    rejectionReason: ''
  });

  // Form data
  const [adjustmentData, setAdjustmentData] = useState({
    overallScore: 0,
    manualAdjustmentReason: '',
    adminNotes: ''
  });

  // Load initial data
  useEffect(() => {
    loadAvailableJobs();
    loadStats();
  }, []);

  // Load rankings when filters change
  useEffect(() => {
    if (activeTab === 'job-rankings' && selectedJob) {
      loadJobRankings();
    } else if (activeTab === 'overall-rankings') {
      loadOverallRankings();
    }
  }, [activeTab, selectedJob, statusFilter, sortBy, sortOrder, currentPage]);

  const loadAvailableJobs = async () => {
    try {
      const response = await applicantRankingAPI.getAvailableJobs();
      if (response.success) {
        setJobs(response.jobs);

        // If jobId is provided in URL, auto-select that job
        if (
          jobIdFromUrl &&
          response.jobs.some((j: Job) => j._id === jobIdFromUrl)
        ) {
          setSelectedJob(jobIdFromUrl);
        } else if (response.jobs.length > 0 && !selectedJob) {
          setSelectedJob(response.jobs[0]._id);
        }
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load available jobs');
    }
  };

  const loadJobRankings = async () => {
    if (!selectedJob) return;

    setLoading(true);
    try {
      const response = await applicantRankingAPI.getJobRankings(selectedJob, {
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder
      });

      if (response.success) {
        setRankings(response.rankings);
        setTotalPages(response.totalPages);
        setTotal(response.total);

        // Auto-recalculate if no rankings exist but job came from URL
        if (
          response.rankings.length === 0 &&
          jobIdFromUrl &&
          !autoRecalculated
        ) {
          setAutoRecalculated(true);
          toast.info(
            'No rankings found. Calculating rankings automatically...'
          );
          setTimeout(() => {
            handleRecalculateRankings();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error loading job rankings:', error);
      toast.error('Failed to load job rankings');
    } finally {
      setLoading(false);
    }
  };

  const loadOverallRankings = async () => {
    setLoading(true);
    try {
      const response = await applicantRankingAPI.getOverallRankings({
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder
      });

      if (response.success) {
        setRankings(response.rankings);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      }
    } catch (error) {
      console.error('Error loading overall rankings:', error);
      toast.error('Failed to load overall rankings');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await applicantRankingAPI.getRankingStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRecalculateRankings = async () => {
    if (!selectedJob) {
      toast.error('Please select a job first');
      return;
    }

    setRecalculating(true);
    try {
      const response = await applicantRankingAPI.recalculateJobRankings(
        selectedJob
      );
      if (response.success) {
        toast.success(response.message);
        loadJobRankings();
        loadStats();
      }
    } catch (error) {
      console.error('Error recalculating rankings:', error);
      toast.error('Failed to recalculate rankings');
    } finally {
      setRecalculating(false);
    }
  };

  const handleAdjustRanking = async () => {
    if (!selectedRanking) return;

    setAdjustingRanking(true);
    try {
      toast.info('Adjusting ranking...');

      const response = await applicantRankingAPI.adjustRanking(
        selectedRanking._id,
        adjustmentData
      );
      if (response.success) {
        toast.success('Ranking adjusted successfully');
        setShowAdjustModal(false);
        loadJobRankings();
        loadStats();
      }
    } catch (error) {
      console.error('Error adjusting ranking:', error);
      toast.error('Failed to adjust ranking. Please try again.');
    } finally {
      setAdjustingRanking(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params: any = {};

      // Add jobId for job-specific rankings
      if (activeTab === 'job-rankings' && selectedJob) {
        params.jobId = selectedJob;
      }

      // Add status filter (but not 'all')
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }

      // Use the new applicationAPI export function
      const blob = await applicationAPI.exportRankedApplicants(params, 'csv');

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ranked-applicants-${
        params.jobId ? 'job-' + params.jobId : 'all'
      }-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const openDetailsModal = (ranking: ApplicantRanking) => {
    setSelectedRanking(ranking);
    setShowDetailsModal(true);
  };

  const openAdjustModal = (ranking: ApplicantRanking) => {
    setSelectedRanking(ranking);
    setAdjustmentData({
      overallScore: ranking.overallScore,
      manualAdjustmentReason: ranking.manualAdjustmentReason || '',
      adminNotes: ranking.adminNotes || ''
    });
    setShowAdjustModal(true);
  };

  const openResumeModal = async (applicantId: string) => {
    setLoadingResume(true);
    try {
      // Fetch the applicant's latest resume using the admin endpoint
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/resume/user/${applicantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResumeData(data.resumeData);
          setResumeMetadata(data.metadata);
          setShowResumeModal(true);
        } else {
          toast.error(data.message || 'Resume not found for this applicant');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Resume not found for this applicant');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
    } finally {
      setLoadingResume(false);
    }
  };

  const openStatusModal = async (ranking: ApplicantRanking) => {
    setSelectedRanking(ranking);

    // Fetch full application details to get interview data
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${ranking.applicationId._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const applicationData = await response.json();

        // Use existing notes or generate template
        const initialNotes =
          applicationData.notes ||
          getStatusNoteTemplate(
            applicationData.status,
            ranking.applicantId.firstName
          );

        // Format interview date for datetime-local input
        const formatDateForInput = (date: string) => {
          if (!date) return '';
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setStatusUpdateData({
          applicationStatus: applicationData.status,
          statusNotes: initialNotes,
          interviewDate:
            formatDateForInput(applicationData.interviewDate) || '',
          interviewLocation: applicationData.interviewLocation || '',
          interviewType: applicationData.interviewType || '',
          rejectionReason: applicationData.rejectionReason || ''
        });
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      // Fallback to basic data
      const initialNotes = getStatusNoteTemplate(
        ranking.applicationId.status,
        ranking.applicantId.firstName
      );
      setStatusUpdateData({
        applicationStatus: ranking.applicationId.status,
        statusNotes: initialNotes,
        interviewDate: '',
        interviewLocation: '',
        interviewType: '',
        rejectionReason: ''
      });
    }

    setShowStatusModal(true);
  };

  // Auto-fill status notes based on application status
  const getStatusNoteTemplate = (status: string, applicantName: string) => {
    const templates: Record<string, string> = {
      applied: `Thank you for your application, ${applicantName}. We have received your application and will review it shortly.`,
      screening: `Hello ${applicantName}, your application is currently under review. Our team is carefully evaluating your qualifications and experience.`,
      interview: `Congratulations ${applicantName}! We would like to invite you for an interview. Please check the interview details below and confirm your availability.`,
      offered: `Great news ${applicantName}! We are pleased to offer you this position. Details of the offer will be sent to your email shortly.`,
      hired: `Congratulations ${applicantName}! Welcome to our team. We look forward to working with you. HR will contact you regarding onboarding.`,
      rejected: `Dear ${applicantName}, thank you for your interest in this position. After careful consideration, we have decided to move forward with other candidates. We encourage you to apply for other opportunities.`,
      withdrawn: `Application withdrawn by ${applicantName}.`
    };
    return templates[status] || '';
  };

  const handleApplicationStatusChange = (newStatus: string) => {
    setStatusUpdateData(prev => ({
      ...prev,
      applicationStatus: newStatus,
      statusNotes: getStatusNoteTemplate(
        newStatus,
        selectedRanking?.applicantId.firstName || 'Applicant'
      )
    }));
  };

  // Get valid status transitions based on current status
  const getValidStatusTransitions = (currentStatus: string): string[] => {
    const statusFlow: Record<string, string[]> = {
      applied: ['applied', 'screening', 'rejected', 'withdrawn'],
      screening: ['screening', 'interview', 'rejected', 'withdrawn'],
      interview: ['interview', 'offered', 'rejected', 'withdrawn'],
      offered: ['offered', 'hired', 'rejected', 'withdrawn'],
      hired: ['hired'], // Final state - cannot change
      rejected: ['rejected'], // Final state - cannot change
      withdrawn: ['withdrawn'] // Final state - cannot change
    };
    return (
      statusFlow[currentStatus] || [
        'applied',
        'screening',
        'interview',
        'offered',
        'hired',
        'rejected',
        'withdrawn'
      ]
    );
  };

  const isStatusDisabled = (status: string, currentStatus: string): boolean => {
    const validTransitions = getValidStatusTransitions(currentStatus);
    return !validTransitions.includes(status);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRanking) return;

    setUpdatingStatus(true);
    try {
      toast.info('Updating application status...');

      // Update application status
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const applicationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${selectedRanking.applicationId._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: statusUpdateData.applicationStatus,
            notes: statusUpdateData.statusNotes,
            interviewDate: statusUpdateData.interviewDate || undefined,
            interviewLocation: statusUpdateData.interviewLocation || undefined,
            interviewType: statusUpdateData.interviewType || undefined,
            rejectionReason: statusUpdateData.rejectionReason || undefined
          })
        }
      );

      if (!applicationResponse.ok) {
        throw new Error('Failed to update application status');
      }

      // Map application status to ranking status
      const rankingStatusMap: Record<string, string> = {
        applied: 'pending',
        screening: 'pending',
        interview: 'shortlisted',
        offered: 'shortlisted',
        hired: 'hired',
        rejected: 'rejected',
        withdrawn: 'rejected'
      };

      const rankingStatus =
        rankingStatusMap[statusUpdateData.applicationStatus] || 'pending';

      // Update ranking status
      const rankingResponse = await applicantRankingAPI.updateRankingStatus(
        selectedRanking._id,
        rankingStatus,
        statusUpdateData.statusNotes
      );

      if (rankingResponse.success) {
        toast.success(
          'Status updated successfully - Applicant will be notified via email'
        );
        setShowStatusModal(false);
        loadJobRankings();
        loadOverallRankings();
        loadStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'hired':
        return <Star className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredRankings = rankings.filter(ranking => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      ranking.applicantId.firstName.toLowerCase().includes(searchLower) ||
      ranking.applicantId.lastName.toLowerCase().includes(searchLower) ||
      ranking.applicantId.email.toLowerCase().includes(searchLower) ||
      ranking.jobId.title.toLowerCase().includes(searchLower)
    );
  });

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
            <p className="text-gray-600 font-medium">Loading ranking data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Applicant Ranking
              </h1>
              <p className="text-sm text-gray-600">
                Automatic applicant ranking system with AI-powered scoring
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            {activeTab === 'job-rankings' && selectedJob && (
              <Button
                onClick={handleRecalculateRankings}
                disabled={recalculating}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    recalculating ? 'animate-spin' : ''
                  }`}
                />
                {recalculating ? 'Recalculating...' : 'Recalculate'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          {stats && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total Rankings
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalRankings}
                  </div>
                  <p className="text-xs text-blue-600">All rankings</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Average Score
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {Math.round(stats.averageScore)}%
                  </div>
                  <p className="text-xs text-green-600">Overall average</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Shortlisted
                  </CardTitle>
                  <Award className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.statusCounts.shortlisted || 0}
                  </div>
                  <p className="text-xs text-purple-600">Top candidates</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Hired
                  </CardTitle>
                  <BarChart3 className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.statusCounts.hired || 0}
                  </div>
                  <p className="text-xs text-orange-600">Successfully hired</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ranking Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger
                value="job-rankings"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Per Job Ranking
              </TabsTrigger>
              <TabsTrigger
                value="overall-rankings"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Overall Ranking
              </TabsTrigger>
            </TabsList>

            {/* Job Rankings Tab */}
            <TabsContent value="job-rankings" className="space-y-6">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Job-Specific Rankings
                  </CardTitle>
                  <CardDescription>
                    Rank applicants within a specific job posting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <Label htmlFor="job-select">Select Job</Label>
                      <Select
                        value={selectedJob}
                        onValueChange={setSelectedJob}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a job..." />
                        </SelectTrigger>
                        <SelectContent>
                          {jobs.map(job => (
                            <SelectItem key={job._id} value={job._id}>
                              {job.title} ({job.applicationCount} applicants)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-[150px]">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shortlisted">
                            Shortlisted
                          </SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-[150px]">
                      <Label htmlFor="sort-by">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rank">Rank</SelectItem>
                          <SelectItem value="overallScore">
                            Overall Score
                          </SelectItem>
                          <SelectItem value="algorithmicScore">
                            Algorithmic Score
                          </SelectItem>
                          <SelectItem value="aiScore">AI Score</SelectItem>
                          <SelectItem value="rankedAt">Date Ranked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-[100px]">
                      <Label htmlFor="sort-order">Order</Label>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="search"
                          placeholder="Search applicants..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rankings Table */}
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="flex flex-col items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">
                          Loading rankings...
                        </p>
                      </div>
                    </div>
                  ) : filteredRankings.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium mb-2">
                          No rankings found for the selected criteria
                        </p>
                        <p className="text-sm text-gray-400 mb-4">
                          Rankings are automatically calculated when applicants
                          submit their applications.
                        </p>
                        <p className="text-sm text-gray-400 mb-4">
                          If you have existing applications, click the
                          "Recalculate" button to generate rankings.
                        </p>
                        {selectedJob && (
                          <Button
                            onClick={handleRecalculateRankings}
                            disabled={recalculating}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                            <RefreshCw
                              className={`mr-2 h-4 w-4 ${
                                recalculating ? 'animate-spin' : ''
                              }`}
                            />
                            {recalculating
                              ? 'Recalculating...'
                              : 'Calculate Rankings'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rank</TableHead>
                              <TableHead>Applicant</TableHead>
                              <TableHead>Job Title</TableHead>
                              <TableHead>Overall Score</TableHead>
                              <TableHead>Algorithmic</TableHead>
                              <TableHead>AI Score</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRankings.map(ranking => (
                              <TableRow key={ranking._id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                      #{ranking.rank}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {ranking.percentile}th percentile
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">
                                      {ranking.applicantId.firstName}{' '}
                                      {ranking.applicantId.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {ranking.applicantId.email}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <p className="font-medium">
                                    {ranking.jobId.title}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={ranking.overallScore}
                                      className="w-16"
                                    />
                                    <span className="text-sm font-medium">
                                      {ranking.overallScore}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {ranking.algorithmicScore}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {ranking.aiScore}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={getStatusColor(ranking.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(ranking.status)}
                                      {ranking.status}
                                    </div>
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openDetailsModal(ranking)}
                                      title="View Details">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openResumeModal(ranking.applicantId._id)
                                      }
                                      disabled={loadingResume}
                                      title="View Resume"
                                      className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openStatusModal(ranking)}
                                      title="Change Status"
                                      className="bg-green-50 hover:bg-green-100 border-green-200">
                                      <Edit3 className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openAdjustModal(ranking)}
                                      title="Adjust Ranking">
                                      <Target className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(prev => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="bg-white/80 backdrop-blur-sm border border-white/50">
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600 font-medium">
                            Page {currentPage} of {totalPages} ({total} total)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(prev =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="bg-white/80 backdrop-blur-sm border border-white/50">
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overall Rankings Tab */}
            <TabsContent value="overall-rankings" className="space-y-6">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Overall Rankings
                  </CardTitle>
                  <CardDescription>
                    Rank applicants across all job postings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="min-w-[150px]">
                      <Label htmlFor="sort-by-overall">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overallScore">
                            Overall Score
                          </SelectItem>
                          <SelectItem value="algorithmicScore">
                            Algorithmic Score
                          </SelectItem>
                          <SelectItem value="aiScore">AI Score</SelectItem>
                          <SelectItem value="rankedAt">Date Ranked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-[100px]">
                      <Label htmlFor="sort-order-overall">Order</Label>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <Label htmlFor="search-overall">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="search-overall"
                          placeholder="Search applicants..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Overall Rankings Table */}
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="flex flex-col items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">
                          Loading rankings...
                        </p>
                      </div>
                    </div>
                  ) : filteredRankings.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium mb-2">
                          No overall rankings found
                        </p>
                        <p className="text-sm text-gray-400">
                          Rankings are automatically calculated when applicants
                          submit their applications.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rank</TableHead>
                              <TableHead>Applicant</TableHead>
                              <TableHead>Job Title</TableHead>
                              <TableHead>Overall Score</TableHead>
                              <TableHead>Algorithmic</TableHead>
                              <TableHead>AI Score</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRankings.map((ranking, index) => (
                              <TableRow key={ranking._id}>
                                <TableCell className="font-medium">
                                  <Badge variant="outline">#{index + 1}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">
                                      {ranking.applicantId.firstName}{' '}
                                      {ranking.applicantId.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {ranking.applicantId.email}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <p className="font-medium">
                                    {ranking.jobId.title}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={ranking.overallScore}
                                      className="w-16"
                                    />
                                    <span className="text-sm font-medium">
                                      {ranking.overallScore}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {ranking.algorithmicScore}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {ranking.aiScore}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={getStatusColor(ranking.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(ranking.status)}
                                      {ranking.status}
                                    </div>
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openDetailsModal(ranking)}
                                      title="View Details">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openResumeModal(ranking.applicantId._id)
                                      }
                                      disabled={loadingResume}
                                      title="View Resume"
                                      className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openStatusModal(ranking)}
                                      title="Change Status"
                                      className="bg-green-50 hover:bg-green-100 border-green-200">
                                      <Edit3 className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openAdjustModal(ranking)}
                                      title="Adjust Ranking">
                                      <Target className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(prev => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="bg-white/80 backdrop-blur-sm border border-white/50">
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600 font-medium">
                            Page {currentPage} of {totalPages} ({total} total)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(prev =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="bg-white/80 backdrop-blur-sm border border-white/50">
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ranking Details Modal */}
          <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ranking Details</DialogTitle>
                <DialogDescription>
                  Detailed analysis for {selectedRanking?.applicantId.firstName}{' '}
                  {selectedRanking?.applicantId.lastName}
                </DialogDescription>
              </DialogHeader>

              {selectedRanking && (
                <div className="space-y-6">
                  {/* Applicant Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Applicant Information
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Name:</strong>{' '}
                          {selectedRanking.applicantId.firstName}{' '}
                          {selectedRanking.applicantId.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong>{' '}
                          {selectedRanking.applicantId.email}
                        </p>
                        <p>
                          <strong>Phone:</strong>{' '}
                          {selectedRanking.applicantId.phone || 'N/A'}
                        </p>
                        <p>
                          <strong>Location:</strong>{' '}
                          {selectedRanking.applicantId.location || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Job Information</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Position:</strong>{' '}
                          {selectedRanking.jobId.title}
                        </p>
                        <p>
                          <strong>Applied:</strong>{' '}
                          {new Date(
                            selectedRanking.applicationId.appliedAt
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Rank:</strong> #{selectedRanking.rank} of{' '}
                          {selectedRanking.totalApplicants}
                        </p>
                        <p>
                          <strong>Percentile:</strong>{' '}
                          {selectedRanking.percentile}
                          th
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Scoring Breakdown */}
                  <div>
                    <h3 className="font-semibold mb-3">Scoring Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Overall Score</span>
                          <span className="text-sm font-medium">
                            {selectedRanking.overallScore}%
                          </span>
                        </div>
                        <Progress value={selectedRanking.overallScore} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Algorithmic Score</span>
                          <span className="text-sm font-medium">
                            {selectedRanking.algorithmicScore}%
                          </span>
                        </div>
                        <Progress value={selectedRanking.algorithmicScore} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">AI Score</span>
                          <span className="text-sm font-medium">
                            {selectedRanking.aiScore}%
                          </span>
                        </div>
                        <Progress value={selectedRanking.aiScore} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Experience Score</span>
                          <span className="text-sm font-medium">
                            {selectedRanking.scoringBreakdown.experienceScore}%
                          </span>
                        </div>
                        <Progress
                          value={
                            selectedRanking.scoringBreakdown.experienceScore
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Skills Score</span>
                          <span className="text-sm font-medium">
                            {selectedRanking.scoringBreakdown.skillsScore}%
                          </span>
                        </div>
                        <Progress
                          value={selectedRanking.scoringBreakdown.skillsScore}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Education Score</span>
                          <span className="text-sm font-medium">
                            {selectedRanking.scoringBreakdown.educationScore}%
                          </span>
                        </div>
                        <Progress
                          value={
                            selectedRanking.scoringBreakdown.educationScore
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {selectedRanking.matchReasons.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Match Reasons
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedRanking.matchReasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {selectedRanking.strengths.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        Strengths
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedRanking.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Concerns */}
                  {selectedRanking.concerns.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Concerns
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedRanking.concerns.map((concern, index) => (
                          <li key={index}>{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {selectedRanking.adminNotes && (
                    <div>
                      <h3 className="font-semibold mb-2">Admin Notes</h3>
                      <p className="text-sm bg-gray-50 p-3 rounded">
                        {selectedRanking.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Adjust Ranking Modal */}
          <Dialog open={showAdjustModal} onOpenChange={setShowAdjustModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust Ranking</DialogTitle>
                <DialogDescription>
                  Manually adjust the ranking for{' '}
                  {selectedRanking?.applicantId.firstName}{' '}
                  {selectedRanking?.applicantId.lastName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="overall-score">Overall Score</Label>
                  <Input
                    id="overall-score"
                    type="number"
                    min="0"
                    max="100"
                    value={adjustmentData.overallScore}
                    onChange={e =>
                      setAdjustmentData(prev => ({
                        ...prev,
                        overallScore: parseInt(e.target.value) || 0
                      }))
                    }
                    disabled={adjustingRanking}
                  />
                </div>

                <div>
                  <Label htmlFor="adjustment-reason">Adjustment Reason</Label>
                  <Textarea
                    id="adjustment-reason"
                    placeholder="Explain why this ranking is being adjusted..."
                    value={adjustmentData.manualAdjustmentReason}
                    onChange={e =>
                      setAdjustmentData(prev => ({
                        ...prev,
                        manualAdjustmentReason: e.target.value
                      }))
                    }
                    disabled={adjustingRanking}
                  />
                </div>

                <div>
                  <Label htmlFor="admin-notes">Admin Notes</Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Additional notes..."
                    value={adjustmentData.adminNotes}
                    onChange={e =>
                      setAdjustmentData(prev => ({
                        ...prev,
                        adminNotes: e.target.value
                      }))
                    }
                    disabled={adjustingRanking}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAdjustModal(false)}
                  disabled={adjustingRanking}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAdjustRanking}
                  disabled={adjustingRanking}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  {adjustingRanking ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Adjusting...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Adjustments
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Resume Modal */}
          <ResumeModal
            isOpen={showResumeModal}
            onClose={() => {
              setShowResumeModal(false);
              setResumeData(null);
              setResumeMetadata(null);
            }}
            resumeData={resumeData}
            metadata={resumeMetadata}
          />

          {/* Status Update Modal */}
          <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Update Application Status</DialogTitle>
                <DialogDescription>
                  Change status for {selectedRanking?.applicantId.firstName}{' '}
                  {selectedRanking?.applicantId.lastName} -{' '}
                  {selectedRanking?.jobId.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Application Status */}
                <div>
                  <Label htmlFor="application-status">Application Status</Label>
                  <Select
                    value={statusUpdateData.applicationStatus}
                    onValueChange={handleApplicationStatusChange}
                    disabled={updatingStatus}>
                    <SelectTrigger disabled={updatingStatus}>
                      <SelectValue placeholder="Select application status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="applied"
                        disabled={isStatusDisabled(
                          'applied',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          Applied
                          {isStatusDisabled(
                            'applied',
                            selectedRanking?.applicationId.status || ''
                          ) && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Not allowed)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="screening"
                        disabled={isStatusDisabled(
                          'screening',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          Screening
                          {isStatusDisabled(
                            'screening',
                            selectedRanking?.applicationId.status || ''
                          ) && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Not allowed)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="interview"
                        disabled={isStatusDisabled(
                          'interview',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                          Interview
                          {isStatusDisabled(
                            'interview',
                            selectedRanking?.applicationId.status || ''
                          ) && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Not allowed)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="offered"
                        disabled={isStatusDisabled(
                          'offered',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          Offered
                          {isStatusDisabled(
                            'offered',
                            selectedRanking?.applicationId.status || ''
                          ) && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Not allowed)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="hired"
                        disabled={isStatusDisabled(
                          'hired',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-600"></div>
                          Hired
                          {isStatusDisabled(
                            'hired',
                            selectedRanking?.applicationId.status || ''
                          ) && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Not allowed)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="rejected"
                        disabled={isStatusDisabled(
                          'rejected',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          Rejected
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="withdrawn"
                        disabled={isStatusDisabled(
                          'withdrawn',
                          selectedRanking?.applicationId.status || ''
                        )}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                          Withdrawn
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Status notes will be auto-filled with a template message
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Current:{' '}
                    <strong>{selectedRanking?.applicationId.status}</strong> →
                    Only valid next steps are shown
                  </p>
                </div>

                {/* Status Notes - Auto-filled from template */}
                <div>
                  <Label
                    htmlFor="status-notes"
                    className="flex items-center gap-2">
                    Status Notes
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-700">
                      Auto-filled
                    </Badge>
                  </Label>
                  <Textarea
                    id="status-notes"
                    placeholder="Add notes about this status change..."
                    value={statusUpdateData.statusNotes}
                    onChange={e =>
                      setStatusUpdateData(prev => ({
                        ...prev,
                        statusNotes: e.target.value
                      }))
                    }
                    rows={4}
                    className="mt-2"
                    disabled={updatingStatus}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💬 This message will be visible to the applicant. You can
                    edit it before saving.
                  </p>
                </div>

                {/* Interview Details (show when status is interview) */}
                {statusUpdateData.applicationStatus === 'interview' && (
                  <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900">
                      Interview Details
                    </h4>

                    <div>
                      <Label htmlFor="interview-date">Interview Date</Label>
                      <Input
                        id="interview-date"
                        type="datetime-local"
                        value={statusUpdateData.interviewDate}
                        onChange={e =>
                          setStatusUpdateData(prev => ({
                            ...prev,
                            interviewDate: e.target.value
                          }))
                        }
                        disabled={updatingStatus}
                      />
                    </div>

                    <div>
                      <Label htmlFor="interview-location">
                        Interview Location
                      </Label>
                      <Input
                        id="interview-location"
                        placeholder="e.g., Office, Zoom, Google Meet link"
                        value={statusUpdateData.interviewLocation}
                        onChange={e =>
                          setStatusUpdateData(prev => ({
                            ...prev,
                            interviewLocation: e.target.value
                          }))
                        }
                        disabled={updatingStatus}
                      />
                    </div>

                    <div>
                      <Label htmlFor="interview-type">Interview Type</Label>
                      <Select
                        value={statusUpdateData.interviewType}
                        onValueChange={value =>
                          setStatusUpdateData(prev => ({
                            ...prev,
                            interviewType: value
                          }))
                        }
                        disabled={updatingStatus}>
                        <SelectTrigger disabled={updatingStatus}>
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="video">Video Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Rejection Reason (show when status is rejected) */}
                {statusUpdateData.applicationStatus === 'rejected' && (
                  <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-900">
                      Rejection Reason
                    </h4>
                    <Textarea
                      placeholder="Optional: Explain why the application was rejected..."
                      value={statusUpdateData.rejectionReason}
                      onChange={e =>
                        setStatusUpdateData(prev => ({
                          ...prev,
                          rejectionReason: e.target.value
                        }))
                      }
                      rows={3}
                      disabled={updatingStatus}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}>
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  {updatingStatus ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Status
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

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
    </div>
  );
}

export default function ApplicantRankingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600 font-medium">
                Loading ranking data...
              </p>
            </div>
          </div>
        </div>
      }>
      <ApplicantRankingPageContent />
    </Suspense>
  );
}
