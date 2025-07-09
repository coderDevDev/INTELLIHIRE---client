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
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { jobAPI, categoryAPI, authAPI } from '@/lib/api-service';
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

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-postedDate');

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

      setJobs(response.jobs || []);
      setTotalJobs(response.total || 0);
      setTotalPages(response.totalPages || 1);
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

  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await jobAPI.deleteJob(jobId);
      toast({
        title: 'Success',
        description: 'Job posting deleted successfully'
      });
      loadJobs(); // Reload jobs to reflect changes
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job posting',
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/jobs/create">
              <Plus className="mr-2 h-4 w-4" /> Create Job Posting
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-8 space-y-8">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-brand-blue" />
                Manage Job Postings
              </CardTitle>
              <CardDescription>
                Create, edit, and manage job postings for the PESO job portal.{' '}
                <span className="font-semibold text-brand-blue">
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
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search jobs..."
                      className="w-full pl-8 rounded-lg border border-input bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-brand-blue"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center rounded-lg bg-gray-50 p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
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
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
              <div className="rounded-xl border overflow-x-auto bg-white shadow-sm">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                            <span className="text-muted-foreground">
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
                            <span className="text-muted-foreground">
                              No job postings found
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs.map((job, idx) => (
                        <TableRow
                          key={job._id}
                          className={idx % 2 === 0 ? 'bg-gray-50/50' : ''}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {job.title}
                              {job.isFeatured && (
                                <Badge variant="secondary" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                              {job.isUrgent && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{job.companyId?.name || 'N/A'}</TableCell>
                          <TableCell>{job.categoryId?.name || 'N/A'}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{job.employmentType}</TableCell>
                          <TableCell>{formatDate(job.postedDate)}</TableCell>
                          <TableCell>
                            <span
                              className={
                                isExpired(job.expiryDate)
                                  ? 'text-red-500 font-semibold'
                                  : ''
                              }>
                              {formatDate(job.expiryDate)}
                            </span>
                          </TableCell>
                          <TableCell>{job.applicationCount || 0}</TableCell>
                          <TableCell>{job.viewCount || 0}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(job.status)}>
                              {job.status.charAt(0).toUpperCase() +
                                job.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/admin/jobs/${job._id}`}>
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/admin/jobs/${job._id}/edit`}>
                                    Edit Job
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/admin/jobs/${job._id}/applications`}>
                                    View Applicants ({job.applicationCount || 0}
                                    )
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {job.status === 'active' ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(job._id, 'paused')
                                    }>
                                    Pause Job
                                  </DropdownMenuItem>
                                ) : job.status === 'paused' ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(job._id, 'active')
                                    }>
                                    Activate Job
                                  </DropdownMenuItem>
                                ) : null}
                                {job.status !== 'closed' && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(job._id, 'closed')
                                    }
                                    className="text-orange-600">
                                    Close Job
                                  </DropdownMenuItem>
                                )}
                                {job.status === 'closed' && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(job._id, 'active')
                                    }
                                    className="text-green-600">
                                    Reopen Job
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="text-destructive">
                                  Delete Job
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalJobs)} of {totalJobs}{' '}
                    results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
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
    </div>
  );
}
