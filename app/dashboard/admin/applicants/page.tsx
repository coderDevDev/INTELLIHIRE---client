'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { applicationAPI, authAPI } from '@/lib/api-service';

interface Applicant {
  _id: string;
  applicantId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  jobId: {
    _id: string;
    title: string;
    companyId?: {
      name: string;
    };
    location?: string;
  };
  status: string;
  createdAt: string;
  resumeId?: any;
  pdsId?: any;
  coverLetter?: string;
  notes?: string;
  interviewDate?: string;
  rejectionReason?: string;
}

export default function AdminApplicantsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [pageSize] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      if (!authAPI.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const user = authAPI.getCurrentUser();
      if (user && user.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive'
        });
        router.push('/dashboard');
        return;
      }
    };

    checkAuth();
  }, [router, toast]);

  // Load applicants
  const loadApplicants = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await applicationAPI.getAdminApplications(params);

      setApplicants(response.applications || []);
      setTotalPages(response.totalPages || 1);
      setTotalApplicants(response.total || 0);

      // Calculate stats
      calculateStats(response.applications || []);
    } catch (error) {
      console.error('Error loading applicants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applicants',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (apps: Applicant[]) => {
    const statusCounts = apps.reduce((acc: any, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    setStats({
      total: apps.length,
      pending: statusCounts['pending'] || 0,
      reviewed: statusCounts['reviewed'] || 0,
      shortlisted: statusCounts['shortlisted'] || 0,
      interview: statusCounts['interview_scheduled'] || 0,
      accepted: statusCounts['accepted'] || 0,
      rejected: statusCounts['rejected'] || 0
    });
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadApplicants();
  }, [currentPage, searchTerm, statusFilter]);

  // Export all applicants
  const handleExportApplicants = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;

      const blob = await applicationAPI.exportAllApplicants(params, 'csv');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `applicants-${
        new Date().toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Applicants exported successfully'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export applicants',
        variant: 'destructive'
      });
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'reviewed':
        return 'default';
      case 'shortlisted':
        return 'default';
      case 'interview_scheduled':
        return 'default';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'reviewed':
        return 'text-blue-600';
      case 'shortlisted':
        return 'text-purple-600';
      case 'interview_scheduled':
        return 'text-indigo-600';
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Applicants
              </h1>
              <p className="text-sm text-gray-600">
                Manage and oversee all job applicants
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            onClick={loadApplicants}
            disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Applicants
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {totalApplicants}
                </div>
                <p className="text-xs text-gray-600 mt-1">All applications</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Review
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Shortlisted
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.shortlisted}
                </div>
                <p className="text-xs text-gray-600 mt-1">Top candidates</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.accepted}
                </div>
                <p className="text-xs text-gray-600 mt-1">Successful hires</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Manage Applicants
              </CardTitle>
              <CardDescription>
                View and manage all job applicants.{' '}
                <span className="font-semibold text-blue-600">
                  Total: {totalApplicants} applicants
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 mb-8">
                {/* Search and Export */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search applicants..."
                      className="w-full pl-8 rounded-xl border border-white/50 bg-white/60 backdrop-blur-sm shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus:bg-white/80 transition-all duration-300"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportApplicants}
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                      <Download className="mr-2 h-4 w-4" />
                      Export Applicants
                    </Button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center rounded-xl bg-gray-50 p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Filters:
                    </span>
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-300 hover:bg-gray-50 transition-all duration-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interview_scheduled">
                        Interview Scheduled
                      </SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchTerm || statusFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      className="text-gray-600 hover:text-gray-900">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Applicants Table */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">
                      No applicants found
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'No applicants have applied yet'}
                    </p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">
                            Applicant
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Job Position
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Contact
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Applied Date
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applicants.map(applicant => (
                          <TableRow
                            key={applicant._id}
                            className="group hover:bg-blue-50/50 transition-colors duration-200">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold shadow-md">
                                  {applicant.applicantId.firstName[0]}
                                  {applicant.applicantId.lastName[0]}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {applicant.applicantId.firstName}{' '}
                                    {applicant.applicantId.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {applicant.applicantId.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium text-gray-900">
                                  {applicant.jobId.title}
                                </div>
                                {applicant.jobId.companyId && (
                                  <div className="text-sm text-gray-600 flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    {applicant.jobId.companyId.name}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 text-sm">
                                {applicant.applicantId.phone && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Phone className="h-3 w-3" />
                                    {applicant.applicantId.phone}
                                  </div>
                                )}
                                {applicant.jobId.location && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="h-3 w-3" />
                                    {applicant.jobId.location}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="h-3 w-3" />
                                {formatDate(applicant.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(
                                  applicant.status
                                )}
                                className={`${getStatusColor(
                                  applicant.status
                                )} capitalize`}>
                                {applicant.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                  asChild>
                                  <Link
                                    href={`/dashboard/admin/ranking?jobId=${applicant.jobId._id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                {applicant.resumeId && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                    asChild>
                                    <a
                                      href={applicant.resumeId.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer">
                                      <FileText className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-4">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(prev => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="bg-white hover:bg-gray-50">
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(prev =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="bg-white hover:bg-gray-50">
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
