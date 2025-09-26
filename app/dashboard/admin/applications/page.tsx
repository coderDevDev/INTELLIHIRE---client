'use client';

import { useEffect, useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Search,
  Briefcase,
  User,
  Loader2,
  Mail,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Building2,
  MapPin,
  Users,
  Eye,
  Star,
  AlertTriangle,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  ChevronDown,
  X,
  RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';
import { jobAPI, applicationAPI, userAPI, companyAPI } from '@/lib/api-service';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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

export default function AdminApplicationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applicationsByJob, setApplicationsByJob] = useState<{
    [jobId: string]: any[];
  }>({});
  const [userCache, setUserCache] = useState<{ [id: string]: any }>({});
  const [companyCache, setCompanyCache] = useState<{ [id: string]: any }>({});
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState('-createdAt');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0
  });

  // Employment types for filter
  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship'
  ];

  // Load companies for filter
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await companyAPI.getCompanies();
        setCompanies(res.companies || res);
      } catch {}
    }
    fetchCompanies();
  }, []);

  // Load jobs
  useEffect(() => {
    setLoading(true);
    async function fetchJobs() {
      try {
        const params: any = {
          search: searchTerm || undefined,
          limit: 50,
          sort: sortBy
        };
        const res = await jobAPI.getAdminJobs(params);
        const jobsData = res.jobs || res;
        setJobs(jobsData);

        // Calculate stats
        const totalApplications = jobsData.reduce(
          (acc: number, job: any) => acc + (job.applicationCount || 0),
          0
        );
        const activeJobs = jobsData.filter(
          (job: any) => job.status === 'active'
        ).length;
        const pendingApplications = jobsData.reduce(
          (acc: number, job: any) => acc + (job.applicationCount || 0),
          0
        );

        setStats({
          totalJobs: jobsData.length,
          totalApplications,
          activeJobs,
          pendingApplications
        });
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [searchTerm, sortBy]);

  // Helper to fetch applicants for a job
  const fetchApplicationsForJob = async (jobId: string) => {
    if (applicationsByJob[jobId]) return;
    try {
      const res = await applicationAPI.getAdminApplications({ jobId });
      const apps = res.applications || res;
      // For each application, cache applicant and company
      for (const app of apps) {
        if (app.applicantId && !userCache[app.applicantId._id]) {
          try {
            const user = await userAPI.getUserById(app.applicantId._id);
            setUserCache(prev => ({ ...prev, [app.applicantId._id]: user }));
          } catch {}
        }
        if (app.jobId?.companyId && !companyCache[app.jobId.companyId]) {
          try {
            const company = await companyAPI.getCompanyById(
              app.jobId.companyId
            );
            setCompanyCache(prev => ({
              ...prev,
              [app.jobId.companyId]: company
            }));
          } catch {}
        }
      }
      setApplicationsByJob(prev => ({ ...prev, [jobId]: apps }));
    } catch {
      setApplicationsByJob(prev => ({ ...prev, [jobId]: [] }));
    }
  };

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

  // Export CSV helper
  const exportCSV = () => {
    let csv = 'Job Title,Company,Applicant,Email,Status,Date Applied\n';
    jobs.forEach(job => {
      (applicationsByJob[job._id] || []).forEach(app => {
        const applicant = userCache[app.applicantId?._id] || app.applicantId;
        csv += `"${job.title}","${
          companyCache[job.companyId?._id]?.name || job.companyId?.name || ''
        }","${
          applicant.name ||
          `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim()
        }","${applicant.email}","${app.status}","${formatDate(
          app.createdAt
        )}"\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedJobs.length === 0) return;

    // Here you would implement the bulk action logic
    console.log(`Performing ${bulkAction} on ${selectedJobs.length} jobs`);
    setSelectedJobs([]);
    setBulkAction('');
  };

  // Toggle job selection
  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  // Toggle all jobs selection
  const toggleAllJobs = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job._id));
    }
  };

  // Filter jobs based on applied filters
  const filteredJobs = jobs.filter(job => {
    if (statusFilter.length > 0 && !statusFilter.includes(job.status))
      return false;
    if (companyFilter.length > 0 && !companyFilter.includes(job.companyId?._id))
      return false;
    if (typeFilter.length > 0 && !typeFilter.includes(job.employmentType))
      return false;
    if (dateFrom && new Date(job.postedDate) < dateFrom) return false;
    if (dateTo && new Date(job.postedDate) > dateTo) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-20 items-center gap-3 px-6">
          <Briefcase className="h-8 w-8 text-brand-blue" />
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
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
                        Total Jobs
                      </p>
                      <p className="text-3xl font-bold">{stats.totalJobs}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-200" />
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
                        Total Applications
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.totalApplications}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
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
                        Active Jobs
                      </p>
                      <p className="text-3xl font-bold">{stats.activeJobs}</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-200" />
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

          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-brand-blue" />
                Applications by Job
              </CardTitle>
              <CardDescription>
                View all job postings and see the list of applicants for each
                job.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Enhanced Filter/Search Bar */}
              <div className="space-y-6 mb-8">
                {/* Main Search and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search jobs by title, company, or keyword..."
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
                    <Button variant="outline" size="sm" onClick={exportCSV}>
                      <Download className="mr-2 h-4 w-4" /> Export CSV
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
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Company Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Company
                          </label>
                          <Select
                            value={companyFilter.join(',')}
                            onValueChange={value =>
                              setCompanyFilter(value ? value.split(',') : [])
                            }>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All Companies" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Companies</SelectItem>
                              {companies.map(company => (
                                <SelectItem
                                  key={company._id}
                                  value={company._id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Employment Type Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Employment Type
                          </label>
                          <Select
                            value={typeFilter.join(',')}
                            onValueChange={value =>
                              setTypeFilter(value ? value.split(',') : [])
                            }>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Types</SelectItem>
                              {employmentTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
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
                              <SelectItem value="-applicationCount">
                                Most Applications
                              </SelectItem>
                              <SelectItem value="title">Title A-Z</SelectItem>
                              <SelectItem value="-title">Title Z-A</SelectItem>
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
                            setCompanyFilter([]);
                            setTypeFilter([]);
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
                {selectedJobs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">
                      {selectedJobs.length} job(s) selected
                    </span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activate">Activate Jobs</SelectItem>
                        <SelectItem value="deactivate">
                          Deactivate Jobs
                        </SelectItem>
                        <SelectItem value="delete">Delete Jobs</SelectItem>
                        <SelectItem value="export">Export Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                      Apply Action
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedJobs([])}>
                      Clear Selection
                    </Button>
                  </motion.div>
                )}
              </div>
              {/* Jobs Table */}
              <div className="rounded-2xl border overflow-x-auto bg-white shadow-sm">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b shadow-sm">
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedJobs.length === jobs.length &&
                            jobs.length > 0
                          }
                          onChange={toggleAllJobs}
                          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                      </TableHead>
                      <TableHead className="py-4">
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
                          <Users className="h-4 w-4 text-brand-blue" />
                          Applications
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                            <span className="text-muted-foreground">
                              Loading jobs...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredJobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Briefcase className="h-8 w-8 text-gray-300" />
                            <span className="text-muted-foreground">
                              No jobs found
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredJobs.map((job, idx) => (
                        <TooltipProvider key={job._id}>
                          <>
                            <TableRow
                              className={
                                'transition-all duration-200 group ' +
                                (idx % 2 === 0 ? 'bg-gray-50/50' : '') +
                                ' hover:bg-blue-50/60 hover:shadow-sm cursor-pointer ' +
                                (selectedJobs.includes(job._id)
                                  ? 'bg-blue-100/80'
                                  : '')
                              }>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedJobs.includes(job._id)}
                                  onChange={() => toggleJobSelection(job._id)}
                                  className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                                />
                              </TableCell>
                              <TableCell className="font-medium py-4">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="truncate max-w-[180px] group-hover:text-brand-blue transition-colors">
                                    {job.title}
                                  </span>
                                  {job.isFeatured && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs flex items-center gap-1">
                                      <Star className="h-3 w-3" />
                                      Featured
                                    </Badge>
                                  )}
                                  {job.isUrgent && (
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
                                  {companyCache[job.companyId?._id]?.logo && (
                                    <img
                                      src={companyCache[job.companyId._id].logo}
                                      alt={companyCache[job.companyId._id].name}
                                      className="h-7 w-7 rounded-full object-contain border"
                                    />
                                  )}
                                  <Building2 className="h-4 w-4 text-gray-500" />
                                  <span className="truncate max-w-[120px] group-hover:text-brand-blue transition-colors">
                                    {companyCache[job.companyId?._id]?.name ||
                                      job.companyId?.name ||
                                      '-'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-gray-500" />
                                  <span className="group-hover:text-brand-blue transition-colors">
                                    {job.employmentType || '-'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="group-hover:text-brand-blue transition-colors">
                                    {job.location || '-'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-1 group-hover:border-brand-blue group-hover:text-brand-blue transition-colors">
                                    {job.applicationCount || 0} Applicants
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-lg flex items-center gap-2 group-hover:bg-brand-blue group-hover:text-white transition-all duration-200"
                                      onClick={async () => {
                                        setExpandedJob(
                                          expandedJob === job._id
                                            ? null
                                            : job._id
                                        );
                                        if (!applicationsByJob[job._id])
                                          await fetchApplicationsForJob(
                                            job._id
                                          );
                                      }}>
                                      <Eye className="h-4 w-4" />
                                      {expandedJob === job._id
                                        ? 'Hide'
                                        : 'Show'}{' '}
                                      Applicants
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {expandedJob === job._id ? 'Hide' : 'View'}{' '}
                                    applicants for this job
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                            {/* Expandable Applicants Section with animation */}
                            <AnimatePresence>
                              {expandedJob === job._id && (
                                <motion.tr
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}>
                                  <td
                                    colSpan={7}
                                    className="bg-blue-50 rounded-b-2xl shadow-inner">
                                    <div className="p-4">
                                      <div className="font-semibold mb-2 text-brand-blue flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Applicants:
                                      </div>
                                      <Table className="border rounded-xl">
                                        <TableHeader>
                                          <TableRow>
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
                                          {applicationsByJob[job._id]
                                            ?.length === 0 ? (
                                            <TableRow>
                                              <TableCell
                                                colSpan={5}
                                                className="text-center py-6 text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                  <Users className="h-6 w-6 text-gray-300" />
                                                  No applicants for this job
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          ) : (
                                            applicationsByJob[job._id]?.map(
                                              (app, aidx) => {
                                                const applicant =
                                                  userCache[
                                                    app.applicantId?._id
                                                  ] || app.applicantId;
                                                return (
                                                  <TableRow
                                                    key={app._id}
                                                    className={
                                                      'transition-all duration-200 group ' +
                                                      (aidx % 2 === 0
                                                        ? 'bg-white'
                                                        : 'bg-blue-50/60') +
                                                      ' hover:bg-blue-100/80 hover:shadow-sm'
                                                    }>
                                                    <TableCell>
                                                      <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-semibold text-base border shadow">
                                                          {applicant.name?.charAt(
                                                            0
                                                          ) ||
                                                            applicant.firstName?.charAt(
                                                              0
                                                            ) ||
                                                            applicant.lastName?.charAt(
                                                              0
                                                            ) ||
                                                            applicant.email?.charAt(
                                                              0
                                                            ) ||
                                                            '?'}
                                                        </div>
                                                        <User className="h-4 w-4 text-gray-500" />
                                                        <span className="truncate max-w-[120px] group-hover:text-brand-blue transition-colors">
                                                          {applicant.name ||
                                                            `${
                                                              applicant.firstName ||
                                                              ''
                                                            } ${
                                                              applicant.lastName ||
                                                              ''
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
                                                      {getStatusBadge(
                                                        app.status
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                                                        <span className="group-hover:text-brand-blue transition-colors">
                                                          {formatDate(
                                                            app.createdAt
                                                          )}
                                                        </span>
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>
                                                      <TooltipProvider>
                                                        <div className="flex items-center gap-1">
                                                          <Tooltip>
                                                            <TooltipTrigger
                                                              asChild>
                                                              <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:bg-brand-blue hover:text-white transition-colors"
                                                                asChild>
                                                                <Link
                                                                  href={`/dashboard/admin/applicants/${applicant._id}`}>
                                                                  <Eye className="h-4 w-4" />
                                                                </Link>
                                                              </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                              View applicant
                                                              details
                                                            </TooltipContent>
                                                          </Tooltip>
                                                          <Tooltip>
                                                            <TooltipTrigger
                                                              asChild>
                                                              <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:bg-brand-blue hover:text-white transition-colors"
                                                                asChild>
                                                                <a
                                                                  href={`mailto:${applicant.email}`}
                                                                  target="_blank"
                                                                  rel="noopener noreferrer">
                                                                  <Mail className="h-4 w-4" />
                                                                </a>
                                                              </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                              Email applicant
                                                            </TooltipContent>
                                                          </Tooltip>
                                                          {app.status !==
                                                            'hired' && (
                                                            <Tooltip>
                                                              <TooltipTrigger
                                                                asChild>
                                                                <Button
                                                                  variant="ghost"
                                                                  size="icon"
                                                                  className="hover:bg-green-100 hover:text-green-700 transition-colors">
                                                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                                                </Button>
                                                              </TooltipTrigger>
                                                              <TooltipContent>
                                                                Mark as Hired
                                                              </TooltipContent>
                                                            </Tooltip>
                                                          )}
                                                          {app.status !==
                                                            'rejected' && (
                                                            <Tooltip>
                                                              <TooltipTrigger
                                                                asChild>
                                                                <Button
                                                                  variant="ghost"
                                                                  size="icon"
                                                                  className="hover:bg-red-100 hover:text-red-700 transition-colors">
                                                                  <XCircle className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                              </TooltipTrigger>
                                                              <TooltipContent>
                                                                Mark as Rejected
                                                              </TooltipContent>
                                                            </Tooltip>
                                                          )}
                                                        </div>
                                                      </TooltipProvider>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              }
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </>
                        </TooltipProvider>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
