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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  User,
  Loader2,
  Mail,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { userAPI, applicationAPI, jobAPI, companyAPI } from '@/lib/api-service';

export default function AdminApplicantsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(
    null
  );
  const [companyCache, setCompanyCache] = useState<{ [id: string]: any }>({});
  const [jobCache, setJobCache] = useState<{ [id: string]: any }>({});

  // Load applicants from API
  useEffect(() => {
    setLoading(true);
    async function fetchApplicants() {
      try {
        const params: any = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm || undefined
        };
        const res = await userAPI.getApplicants(params);
        let users = res.users || res;
        // Filter by status if needed
        if (statusFilter !== 'all') {
          users = users.filter((u: any) => u.status === statusFilter);
        }
        // For each applicant, fetch their applications
        const applicantsWithApps = await Promise.all(
          users.map(async (user: any) => {
            let applications = [];
            try {
              const appRes = await applicationAPI.getApplicationsByApplicant(
                user._id
              );
              applications = appRes.applications || appRes;
            } catch {}
            return { ...user, applications };
          })
        );
        setApplicants(applicantsWithApps);
        setTotalPages(res.totalPages || 1);
        setTotalApplicants(res.total || applicantsWithApps.length);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load applicants',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, [searchTerm, statusFilter, currentPage, pageSize, toast]);

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="secondary">Applied</Badge>;
      case 'interview':
        return (
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            Interview
          </Badge>
        );
      case 'hired':
        return (
          <Badge variant="default" className="bg-green-600 text-white">
            Hired
          </Badge>
        );
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  // Helper to fetch company name by ID and cache it
  const getCompanyName = async (companyId: string) => {
    if (!companyId) return '';
    if (companyCache[companyId]) return companyCache[companyId].name;
    try {
      const company = await companyAPI.getCompanyById(companyId);
      setCompanyCache(prev => ({ ...prev, [companyId]: company }));
      return company.name;
    } catch {
      return '';
    }
  };

  // Helper to fetch company details by ID and cache it
  const getCompany = async (companyId: string) => {
    if (!companyId) return null;
    if (companyCache[companyId]) return companyCache[companyId];
    try {
      const company = await companyAPI.getCompanyById(companyId);
      setCompanyCache(prev => ({ ...prev, [companyId]: company }));
      return company;
    } catch {
      return null;
    }
  };

  // Helper to fetch job details by ID and cache it
  const getJob = async (jobId: string) => {
    if (!jobId) return null;
    if (jobCache[jobId]) return jobCache[jobId];
    try {
      const job = await jobAPI.getJobById(jobId);
      setJobCache(prev => ({ ...prev, [jobId]: job }));
      return job;
    } catch {
      return null;
    }
  };

  // Helper to render application row with all details
  const ApplicationRow = ({ app }: { app: any }) => {
    const [company, setCompany] = useState<any>(null);
    const [job, setJob] = useState<any>(null);
    useEffect(() => {
      async function fetchDetails() {
        if (app.jobId?.companyId) {
          const c = await getCompany(app.jobId.companyId);
          setCompany(c);
        }
        if (app.jobId?._id) {
          const j = await getJob(app.jobId._id);
          setJob(j);
        }
      }
      fetchDetails();
      // eslint-disable-next-line
    }, [app.jobId]);
    return (
      <TableRow key={app._id}>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {app.jobId?.title || (job && job.title) || '-'}
            </span>
            {job?.isFeatured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {job?.isUrgent && (
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {company?.logo && (
              <img
                src={company.logo}
                alt={company.name}
                className="h-6 w-6 rounded-full object-contain"
              />
            )}
            <span>{company?.name || app.jobId?.companyId || '-'}</span>
          </div>
        </TableCell>
        <TableCell>{job?.employmentType || '-'}</TableCell>
        <TableCell>{job?.location || '-'}</TableCell>
        <TableCell>
          {job?.salaryMax
            ? `₱${job.salaryMin?.toLocaleString()} - ₱${job.salaryMax?.toLocaleString()}`
            : job?.salaryMin
            ? `₱${job.salaryMin?.toLocaleString()}`
            : '-'}
        </TableCell>
        <TableCell>{getStatusBadge(app.status)}</TableCell>
        <TableCell>{formatDate(app.createdAt)}</TableCell>
        <TableCell>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/jobs/${app.jobId?._id || (job && job._id)}`}>
              View Job
            </Link>
          </Button>
          {company && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/companies/${company._id}`}>View Company</Link>
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-8 space-y-8">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand-blue" />
                Manage Applicants
              </CardTitle>
              <CardDescription>
                View, filter, and manage all applicants in the system.
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
                      placeholder="Search applicants..."
                      className="w-full pl-8 rounded-lg border border-input bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-brand-blue"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center rounded-lg bg-gray-50 p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status:</span>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-[150px] rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              {/* Applicants Table */}
              <div className="rounded-xl border overflow-x-auto bg-white shadow-sm">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Jobs Applied</TableHead>
                      <TableHead>Resume</TableHead>
                      <TableHead>PDS</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                            <span className="text-muted-foreground">
                              Loading applicants...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : applicants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <User className="h-8 w-8 text-gray-300" />
                            <span className="text-muted-foreground">
                              No applicants found
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      applicants.map((applicant, idx) => (
                        <>
                          <TableRow
                            key={applicant._id}
                            className={idx % 2 === 0 ? 'bg-gray-50/50' : ''}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                  {applicant.name?.charAt(0) ||
                                    applicant.firstName?.charAt(0) ||
                                    applicant.lastName?.charAt(0) ||
                                    applicant.email?.charAt(0) ||
                                    '?'}
                                </div>
                                <span>
                                  {applicant.name ||
                                    `${applicant.firstName || ''} ${
                                      applicant.lastName || ''
                                    }`.trim() ||
                                    applicant.email ||
                                    'Applicant'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{applicant.email}</TableCell>
                            <TableCell>
                              {getStatusBadge(applicant.status)}
                            </TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>
                              {applicant.applications?.length || 0}
                            </TableCell>
                            <TableCell>
                              {applicant.resume ? (
                                <Badge
                                  variant="outline"
                                  className="text-green-700 border-green-300">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-400 border-gray-200">
                                  No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {applicant.pds ? (
                                <Badge
                                  variant="outline"
                                  className="text-blue-700 border-blue-300">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-400 border-gray-200">
                                  No
                                </Badge>
                              )}
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
                                      href={`/dashboard/admin/applicants/${applicant._id}`}>
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={`mailto:${applicant.email}`}
                                      target="_blank"
                                      rel="noopener noreferrer">
                                      <Mail className="h-4 w-4 mr-2" /> Send
                                      Email
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {applicant.status !== 'hired' && (
                                    <DropdownMenuItem className="text-green-600">
                                      <CheckCircle className="h-4 w-4 mr-2" />{' '}
                                      Mark as Hired
                                    </DropdownMenuItem>
                                  )}
                                  {applicant.status !== 'rejected' && (
                                    <DropdownMenuItem className="text-destructive">
                                      <XCircle className="h-4 w-4 mr-2" /> Mark
                                      as Rejected
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setExpandedApplicant(
                                        expandedApplicant === applicant._id
                                          ? null
                                          : applicant._id
                                      )
                                    }>
                                    {expandedApplicant === applicant._id
                                      ? 'Hide Applications'
                                      : 'Show Applications'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                          {/* Collapsible Applications Section */}
                          {expandedApplicant === applicant._id &&
                            applicant.applications?.length > 0 && (
                              <TableRow>
                                <TableCell colSpan={8} className="bg-blue-50">
                                  <div className="p-4">
                                    <div className="font-semibold mb-2">
                                      Applications:
                                    </div>
                                    <Table className="border">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Job Title</TableHead>
                                          <TableHead>Company</TableHead>
                                          <TableHead>Type</TableHead>
                                          <TableHead>Location</TableHead>
                                          <TableHead>Salary</TableHead>
                                          <TableHead>Status</TableHead>
                                          <TableHead>Date Applied</TableHead>
                                          <TableHead>Actions</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {applicant.applications.map(
                                          (app: any) => (
                                            <ApplicationRow
                                              key={app._id}
                                              app={app}
                                            />
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                        </>
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
                    {Math.min(currentPage * pageSize, totalApplicants)} of{' '}
                    {totalApplicants} results
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
                      {Array.from({ length: totalPages }, (_, i) => {
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
                      })}
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
