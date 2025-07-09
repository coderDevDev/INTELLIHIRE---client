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
  XCircle,
  Users,
  Activity,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  X,
  RefreshCw,
  Eye,
  Calendar as CalendarIcon,
  Building2,
  MapPin,
  Briefcase,
  Star,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { userAPI, applicationAPI, jobAPI, companyAPI } from '@/lib/api-service';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function AdminApplicantsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(
    null
  );
  const [companyCache, setCompanyCache] = useState<{ [id: string]: any }>({});
  const [jobCache, setJobCache] = useState<{ [id: string]: any }>({});
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState('-createdAt');
  const [stats, setStats] = useState({
    totalApplicants: 0,
    activeApplicants: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

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
        if (statusFilter.length > 0) {
          users = users.filter((u: any) => statusFilter.includes(u.status));
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

        // Calculate stats
        const totalApplications = applicantsWithApps.reduce(
          (acc: number, applicant: any) =>
            acc + (applicant.applications?.length || 0),
          0
        );
        const activeApplicants = applicantsWithApps.filter(
          (applicant: any) => applicant.status === 'active'
        ).length;
        const pendingApplications = applicantsWithApps.reduce(
          (acc: number, applicant: any) =>
            acc + (applicant.applications?.length || 0),
          0
        );

        setStats({
          totalApplicants: applicantsWithApps.length,
          activeApplicants,
          totalApplications,
          pendingApplications
        });
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

  // Bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedApplicants.length === 0) return;

    // Here you would implement the bulk action logic
    console.log(
      `Performing ${bulkAction} on ${selectedApplicants.length} applicants`
    );
    setSelectedApplicants([]);
    setBulkAction('');
  };

  // Toggle applicant selection
  const toggleApplicantSelection = (applicantId: string) => {
    setSelectedApplicants(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  // Toggle all applicants selection
  const toggleAllApplicants = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map(applicant => applicant._id));
    }
  };

  // Filter applicants based on applied filters
  const filteredApplicants = applicants.filter(applicant => {
    if (dateFrom && new Date(applicant.createdAt) < dateFrom) return false;
    if (dateTo && new Date(applicant.createdAt) > dateTo) return false;
    return true;
  });

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
      <TableRow
        key={app._id}
        className="group hover:bg-blue-50/60 transition-all duration-200">
        <TableCell>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="font-semibold group-hover:text-brand-blue transition-colors">
              {app.jobId?.title || (job && job.title) || '-'}
            </span>
            {job?.isFeatured && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {job?.isUrgent && (
              <Badge
                variant="destructive"
                className="text-xs flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
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
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="group-hover:text-brand-blue transition-colors">
              {company?.name || app.jobId?.companyId || '-'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="group-hover:text-brand-blue transition-colors">
              {job?.employmentType || '-'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="group-hover:text-brand-blue transition-colors">
              {job?.location || '-'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          {job?.salaryMax
            ? `₱${job.salaryMin?.toLocaleString()} - ₱${job.salaryMax?.toLocaleString()}`
            : job?.salaryMin
            ? `₱${job.salaryMin?.toLocaleString()}`
            : '-'}
        </TableCell>
        <TableCell>{getStatusBadge(app.status)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="group-hover:text-brand-blue transition-colors">
              {formatDate(app.createdAt)}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-brand-blue hover:text-white transition-colors">
                    <Link href={`/jobs/${app.jobId?._id || (job && job._id)}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Job</TooltipContent>
              </Tooltip>
              {company && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="hover:bg-brand-blue hover:text-white transition-colors">
                      <Link href={`/companies/${company._id}`}>
                        <Building2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Company</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
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
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        Total Applicants
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.totalApplicants}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        Active Applicants
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.activeApplicants}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">
                        Total Applications
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.totalApplications}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">
                        Pending Applications
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.pendingApplications}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="shadow-md border-0 rounded-2xl">
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
              {/* Enhanced Filters */}
              <div className="space-y-6 mb-8">
                {/* Main Search and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search applicants by name, email, or keyword..."
                        className="w-full pl-10 rounded-lg border border-input bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-brand-blue"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {showFilters ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-xl border bg-gray-50/50 p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-brand-blue" />
                        <span className="font-medium text-gray-700">
                          Advanced Filters
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <Select
                            value={statusFilter.join(',')}
                            onValueChange={value =>
                              setStatusFilter(value ? value.split(',') : [])
                            }>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Status</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="applied">Applied</SelectItem>
                              <SelectItem value="interview">
                                Interview
                              </SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Sort By */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Sort By
                          </label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="-createdAt">
                                Newest First
                              </SelectItem>
                              <SelectItem value="createdAt">
                                Oldest First
                              </SelectItem>
                              <SelectItem value="name">Name A-Z</SelectItem>
                              <SelectItem value="-name">Name Z-A</SelectItem>
                              <SelectItem value="-applications">
                                Most Applications
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Date From
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !dateFrom && 'text-muted-foreground'
                                )}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFrom ? (
                                  format(dateFrom, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={dateFrom}
                                onSelect={setDateFrom}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Date To
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !dateTo && 'text-muted-foreground'
                                )}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateTo ? (
                                  format(dateTo, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={dateTo}
                                onSelect={setDateTo}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStatusFilter([]);
                            setDateFrom(undefined);
                            setDateTo(undefined);
                          }}
                          className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          Clear All Filters
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bulk Actions */}
                {selectedApplicants.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">
                      {selectedApplicants.length} applicant(s) selected
                    </span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activate">
                          Activate Applicants
                        </SelectItem>
                        <SelectItem value="deactivate">
                          Deactivate Applicants
                        </SelectItem>
                        <SelectItem value="delete">
                          Delete Applicants
                        </SelectItem>
                        <SelectItem value="export">Export Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                      Apply Action
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApplicants([])}>
                      Clear Selection
                    </Button>
                  </motion.div>
                )}
              </div>
              {/* Applicants Table */}
              <div className="rounded-xl border overflow-x-auto bg-white shadow-sm">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedApplicants.length === applicants.length &&
                            applicants.length > 0
                          }
                          onChange={toggleAllApplicants}
                          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-brand-blue" />
                          Applicant
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-brand-blue" />
                          Email
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-brand-blue" />
                          Status
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-brand-blue" />
                          Applied
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-blue" />
                          Jobs Applied
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-blue" />
                          Resume
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-blue" />
                          PDS
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px]">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-brand-blue" />
                          Actions
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                            <span className="text-muted-foreground">
                              Loading applicants...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredApplicants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <User className="h-8 w-8 text-gray-300" />
                            <span className="text-muted-foreground">
                              No applicants found
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplicants.map((applicant, idx) => (
                        <>
                          <TableRow
                            key={applicant._id}
                            className={
                              'transition-all duration-200 group ' +
                              (idx % 2 === 0 ? 'bg-gray-50/50' : '') +
                              ' hover:bg-blue-50/60 hover:shadow-sm cursor-pointer ' +
                              (selectedApplicants.includes(applicant._id)
                                ? 'bg-blue-100/80'
                                : '')
                            }>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedApplicants.includes(
                                  applicant._id
                                )}
                                onChange={() =>
                                  toggleApplicantSelection(applicant._id)
                                }
                                className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                  {applicant.name?.charAt(0) ||
                                    applicant.firstName?.charAt(0) ||
                                    applicant.lastName?.charAt(0) ||
                                    applicant.email?.charAt(0) ||
                                    '?'}
                                </div>
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="group-hover:text-brand-blue transition-colors">
                                  {applicant.name ||
                                    `${applicant.firstName || ''} ${
                                      applicant.lastName || ''
                                    }`.trim() ||
                                    applicant.email ||
                                    'Applicant'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="group-hover:text-brand-blue transition-colors">
                                  {applicant.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(applicant.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                <span className="group-hover:text-brand-blue transition-colors">
                                  {applicant.createdAt
                                    ? formatDate(applicant.createdAt)
                                    : '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-1 group-hover:border-brand-blue group-hover:text-brand-blue transition-colors">
                                  {applicant.applications?.length || 0} Jobs
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {applicant.resume ? (
                                <Badge
                                  variant="outline"
                                  className="text-green-700 border-green-300 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Yes
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-400 border-gray-200 flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {applicant.pds ? (
                                <Badge
                                  variant="outline"
                                  className="text-blue-700 border-blue-300 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Yes
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-400 border-gray-200 flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-brand-blue hover:text-white transition-colors">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/dashboard/admin/applicants/${applicant._id}`}
                                      className="flex items-center gap-2">
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={`mailto:${applicant.email}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      Send Email
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {applicant.status !== 'hired' && (
                                    <DropdownMenuItem className="text-green-600 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4" />
                                      Mark as Hired
                                    </DropdownMenuItem>
                                  )}
                                  {applicant.status !== 'rejected' && (
                                    <DropdownMenuItem className="text-destructive flex items-center gap-2">
                                      <XCircle className="h-4 w-4" />
                                      Mark as Rejected
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
                                    }
                                    className="flex items-center gap-2">
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
                                <TableCell colSpan={9} className="bg-blue-50">
                                  <div className="p-4">
                                    <div className="font-semibold mb-2 text-brand-blue flex items-center gap-2">
                                      <FileText className="h-5 w-5" />
                                      Applications:
                                    </div>
                                    <Table className="border rounded-xl">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-4 w-4 text-brand-blue" />
                                              Job Title
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <Building2 className="h-4 w-4 text-brand-blue" />
                                              Company
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <Briefcase className="h-4 w-4 text-brand-blue" />
                                              Type
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <MapPin className="h-4 w-4 text-brand-blue" />
                                              Location
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <Target className="h-4 w-4 text-brand-blue" />
                                              Salary
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <CheckCircle className="h-4 w-4 text-brand-blue" />
                                              Status
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <CalendarIcon className="h-4 w-4 text-brand-blue" />
                                              Date Applied
                                            </div>
                                          </TableHead>
                                          <TableHead>
                                            <div className="flex items-center gap-2">
                                              <Eye className="h-4 w-4 text-brand-blue" />
                                              Actions
                                            </div>
                                          </TableHead>
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
                      disabled={currentPage === 1}
                      className="hover:bg-brand-blue hover:text-white transition-colors">
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
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? 'bg-brand-blue text-white'
                                : 'hover:bg-brand-blue hover:text-white transition-colors'
                            }>
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="hover:bg-brand-blue hover:text-white transition-colors">
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
