'use client';

import { useState, useEffect } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
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
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Briefcase,
  Eye,
  Users,
  Calendar,
  MapPin,
  Building,
  Target,
  Edit3,
  Trash2,
  FileText,
  Star,
  Clock,
  TrendingUp,
  Archive
} from 'lucide-react';
import Link from 'next/link';
import {
  jobAPI,
  categoryAPI,
  authAPI,
  applicationAPI
} from '@/lib/api-service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  companyId: {
    _id: string;
    name: string;
    logo?: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  location: string;
  employmentType: string;
  status: string;
  postedDate: string;
  expiryDate: string;
  applicationCount: number;
  viewCount: number;
  isFeatured: boolean;
  isUrgent: boolean;
  department?: string;
}

export default function JobPostingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [applicationCounts, setApplicationCounts] = useState<
    Record<string, number>
  >({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-postedDate');

  // Archive confirmation modal state
  const [archiveJobId, setArchiveJobId] = useState<string | null>(null);
  const [archiveJobTitle, setArchiveJobTitle] = useState<string>('');
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Categories for filter
  const [categories, setCategories] = useState<
    Array<{ _id: string; name: string }>
  >([]);

  // Check authentication on component mount
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

  // Load real application counts for all jobs
  const loadApplicationCounts = async (jobIds: string[]) => {
    try {
      // Fetch applications and count them by jobId
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${authAPI.getToken()}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const applications = data.applications || [];

        // Count applications per job
        const counts: Record<string, number> = {};
        applications.forEach((app: any) => {
          const jobId = app.jobId?._id || app.jobId;
          if (jobId) {
            counts[jobId] = (counts[jobId] || 0) + 1;
          }
        });

        setApplicationCounts(counts);
      }
    } catch (error) {
      console.error('Error loading application counts:', error);
    }
  };

  // Load jobs data
  const loadJobs = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter || undefined,
        category:
          categoryFilter === 'all' ? undefined : categoryFilter || undefined,
        type:
          employmentTypeFilter === 'all'
            ? undefined
            : employmentTypeFilter || undefined
      };

      const response = await jobAPI.getAdminJobs(params);

      const jobsData = response.jobs || [];
      setJobs(jobsData);
      setTotalJobs(response.total || 0);
      setTotalPages(response.totalPages || 1);

      // Load real application counts
      const jobIds = jobsData.map((job: Job) => job._id);
      if (jobIds.length > 0) {
        await loadApplicationCounts(jobIds);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job postings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load categories for filter
  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    categoryFilter,
    employmentTypeFilter,
    sortBy
  ]);

  // Handle job status change
  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await jobAPI.updateJob(jobId, { status: newStatus });
      toast({
        title: 'Success',
        description: `Job status updated to ${newStatus}`
      });
      loadJobs(); // Reload jobs to reflect changes
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive'
      });
    }
  };

  // Open archive confirmation modal
  const openArchiveModal = (jobId: string, jobTitle: string) => {
    setArchiveJobId(jobId);
    setArchiveJobTitle(jobTitle);
    setShowArchiveModal(true);
  };

  // Handle job archiving
  const handleArchiveJob = async () => {
    if (!archiveJobId) return;

    try {
      await jobAPI.updateJobStatus(archiveJobId, 'archived');
      toast({
        title: 'Success',
        description: 'Job posting archived successfully'
      });
      loadJobs(); // Reload jobs to reflect changes
      setShowArchiveModal(false);
      setArchiveJobId(null);
      setArchiveJobTitle('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive job posting',
        variant: 'destructive'
      });
    }
  };

  // Handle export all applicants
  const handleExportAllApplicants = async () => {
    try {
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateFrom: undefined, // Can be enhanced with date filters
        dateTo: undefined
      };

      const blob = await applicationAPI.exportAllApplicants(params, 'csv');

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all-applicants-${
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
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'closed':
        return 'destructive';
      default:
        return 'outline';
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

  // Check if job is expired
  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Job Postings
              </h1>
              <p className="text-sm text-gray-600">
                Manage and oversee all job postings
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            asChild>
            <Link href="/dashboard/admin/jobs/create">
              <Plus className="mr-2 h-4 w-4" /> Create Job Posting
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8 space-y-8">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Manage Job Postings
              </CardTitle>
              <CardDescription>
                Create, edit, and manage job postings for the PESO job portal.{' '}
                <span className="font-semibold text-blue-600">
                  Total: {totalJobs} job postings
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
                      placeholder="Search jobs..."
                      className="w-full pl-8 rounded-xl border border-white/50 bg-white/60 backdrop-blur-sm shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus:bg-white/80 transition-all duration-300"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportAllApplicants}
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                      <Download className="mr-2 h-4 w-4" />
                      Export All Applicants
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
                    <SelectTrigger className="w-[150px] bg-white border-gray-300 hover:bg-gray-50 transition-all duration-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-300 hover:bg-gray-50 transition-all duration-300">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={employmentTypeFilter}
                    onValueChange={setEmploymentTypeFilter}>
                    <SelectTrigger className="w-[180px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                      <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-postedDate">Newest First</SelectItem>
                      <SelectItem value="postedDate">Oldest First</SelectItem>
                      <SelectItem value="-applicationCount">
                        Most Applications
                      </SelectItem>
                      <SelectItem value="-viewCount">Most Views</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="-title">Title Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Jobs Table */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            <span className="text-gray-600">
                              Loading job postings...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : jobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Briefcase className="h-8 w-8 text-gray-300" />
                            <span className="text-gray-600">
                              No job postings found
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs.map((job, idx) => (
                        <TableRow key={job._id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">
                                  {job.title}
                                </p>
                                {job.isFeatured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                )}
                                {job.isUrgent && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-1.5 py-0">
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              {job.categoryId?.name && (
                                <p className="text-xs text-gray-500">
                                  {job.categoryId.name}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">
                                {job.companyId?.name || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{job.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs bg-white/60">
                              {job.employmentType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {formatDate(job.postedDate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="hover:bg-blue-50"
                              title="View Ranked Applicants">
                              <Link
                                href={`/dashboard/admin/ranking?jobId=${job._id}`}>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-semibold text-blue-600">
                                    {applicationCounts[job._id] || 0}
                                  </span>
                                </div>
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                job.status === 'active'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : job.status === 'draft'
                                  ? 'bg-gray-100 text-gray-800 border-gray-200'
                                  : job.status === 'paused'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }>
                              <div className="flex items-center gap-1">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    job.status === 'active'
                                      ? 'bg-green-500'
                                      : job.status === 'draft'
                                      ? 'bg-gray-500'
                                      : job.status === 'paused'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}></div>
                                {job.status.charAt(0).toUpperCase() +
                                  job.status.slice(1)}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                title="View Details">
                                <Link href={`/dashboard/admin/jobs/${job._id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                title="Edit Job"
                                className="bg-blue-50 hover:bg-blue-100 border-blue-200">
                                <Link
                                  href={`/dashboard/admin/jobs/${job._id}/edit`}>
                                  <Edit3 className="h-4 w-4 text-blue-600" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                title={`View ${
                                  applicationCounts[job._id] || 0
                                } Ranked Applicants`}
                                className="bg-green-50 hover:bg-green-100 border-green-200">
                                <Link
                                  href={`/dashboard/admin/ranking?jobId=${job._id}`}>
                                  <FileText className="h-4 w-4 text-green-600" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openArchiveModal(job._id, job.title)
                                }
                                title="Archive Job"
                                className="bg-orange-50 hover:bg-orange-100 border-orange-200">
                                <Archive className="h-4 w-4 text-orange-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalJobs)} of {totalJobs}{' '}
                    results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}>
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? 'default' : 'outline'
                              }
                              size="sm"
                              className={
                                currentPage === page
                                  ? 'bg-blue-600 hover:bg-blue-700'
                                  : 'bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300'
                              }
                              onClick={() => setCurrentPage(page)}>
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Archive Confirmation Modal */}
      <AlertDialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <Archive className="h-5 w-5" />
              Archive Job Posting
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to archive the job posting{' '}
              <span className="font-semibold text-gray-900">
                "{archiveJobTitle}"
              </span>
              ? The job will be moved to archived status and will no longer be visible to applicants. You can reactivate it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowArchiveModal(false);
                setArchiveJobId(null);
                setArchiveJobTitle('');
              }}
              className="bg-gray-100 hover:bg-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveJob}
              className="bg-orange-600 hover:bg-orange-700 text-white">
              <Archive className="h-4 w-4 mr-2" />
              Archive Job Posting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
