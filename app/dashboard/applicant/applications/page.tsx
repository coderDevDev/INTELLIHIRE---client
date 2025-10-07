'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { applicationAPI } from '@/lib/api-service';
import {
  Briefcase,
  Building,
  FileText,
  File,
  Calendar,
  Search,
  BadgeCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Table as TableIcon,
  LayoutGrid,
  MapPin,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<
    string,
    { label: string; color: string; icon: any; bgColor: string }
  > = {
    applied: {
      label: 'Applied',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: <FileText className="h-4 w-4" />
    },
    screening: {
      label: 'Screening',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-200',
      icon: <Search className="h-4 w-4" />
    },
    interview: {
      label: 'Interview',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 border-purple-200',
      icon: <Calendar className="h-4 w-4" />
    },
    offered: {
      label: 'Offered',
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
      icon: <BadgeCheck className="h-4 w-4" />
    },
    hired: {
      label: 'Hired',
      color: 'text-green-800',
      bgColor: 'bg-green-100 border-green-300',
      icon: <CheckCircle className="h-4 w-4" />
    },
    rejected: {
      label: 'Rejected',
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      icon: <XCircle className="h-4 w-4" />
    },
    withdrawn: {
      label: 'Withdrawn',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 border-gray-200',
      icon: <ArrowRight className="h-4 w-4" />
    }
  };
  const s = statusMap[status] || statusMap['applied'];
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1 px-3 py-1 ${s.bgColor} ${s.color} border`}>
      {s.icon}
      {s.label}
    </Badge>
  );
}

function Stepper({ status }: { status: string }) {
  const steps = [
    {
      key: 'applied',
      label: 'Applied',
      icon: <FileText className="h-4 w-4" />
    },
    {
      key: 'screening',
      label: 'Screening',
      icon: <Search className="h-4 w-4" />
    },
    {
      key: 'interview',
      label: 'Interview',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      key: 'offered',
      label: 'Offered',
      icon: <BadgeCheck className="h-4 w-4" />
    },
    { key: 'hired', label: 'Hired', icon: <CheckCircle className="h-4 w-4" /> },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: <XCircle className="h-4 w-4" />
    },
    {
      key: 'withdrawn',
      label: 'Withdrawn',
      icon: <ArrowRight className="h-4 w-4" />
    }
  ];

  const currentStep = steps.findIndex(s => s.key === status);

  return (
    <div className="flex flex-col gap-3 mt-4">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-3">
          <div
            className={`rounded-full p-2 transition-all duration-300 ${
              i <= currentStep
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}>
            {step.icon}
          </div>
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              i <= currentStep ? 'text-green-700' : 'text-gray-400'
            }`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 transition-colors duration-300 ${
                i < currentStep ? 'bg-green-300' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ApplicantApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'title' | 'company'>(
    'date'
  );
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate stats from applications
  const calculateStats = (apps: any[]) => {
    return {
      total: apps.length,
      applied: apps.filter(a => a.status === 'applied').length,
      screening: apps.filter(a => a.status === 'screening').length,
      interview: apps.filter(a => a.status === 'interview').length,
      offered: apps.filter(a => a.status === 'offered').length,
      hired: apps.filter(a => a.status === 'hired').length,
      rejected: apps.filter(a => a.status === 'rejected').length
    };
  };

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0
  });

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const data = await applicationAPI.getMyApplications();
        const apps = data.applications || [];
        setApplications(apps);
        setStats(calculateStats(apps));
      } catch {
        setApplications([]);
      }
      setLoading(false);
    }
    fetchApplications();
  }, []);

  // Get unique companies from applications
  const companyOptions = useMemo(() => {
    const companies = new Map();
    applications.forEach(app => {
      const company = app.jobId?.companyId;
      if (company && company._id && company.name) {
        companies.set(company._id, company.name);
      }
    });
    return Array.from(companies.entries()).map(([id, name]) => ({ id, name }));
  }, [applications]);

  // Filtered, searched, and sorted applications
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      if (statusFilter && app.status !== statusFilter) return false;
      if (companyFilter && app.jobId?.companyId?._id !== companyFilter)
        return false;
      if (dateFrom && new Date(app.createdAt) < new Date(dateFrom))
        return false;
      if (dateTo && new Date(app.createdAt) > new Date(dateTo)) return false;
      if (search) {
        const jobTitle = app.jobId?.title?.toLowerCase() || '';
        const companyName = app.jobId?.companyId?.name?.toLowerCase() || '';
        if (
          !jobTitle.includes(search.toLowerCase()) &&
          !companyName.includes(search.toLowerCase())
        ) {
          return false;
        }
      }
      return true;
    });
  }, [applications, statusFilter, companyFilter, dateFrom, dateTo, search]);

  // Sorting (client-side for now)
  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      if (sortBy === 'date') {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortDir === 'asc' ? da - db : db - da;
      }
      if (sortBy === 'status') {
        return sortDir === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortBy === 'title') {
        return sortDir === 'asc'
          ? (a.jobId?.title || '').localeCompare(b.jobId?.title || '')
          : (b.jobId?.title || '').localeCompare(a.jobId?.title || '');
      }
      if (sortBy === 'company') {
        return sortDir === 'asc'
          ? (a.jobId?.companyId?.name || '').localeCompare(
              b.jobId?.companyId?.name || ''
            )
          : (b.jobId?.companyId?.name || '').localeCompare(
              a.jobId?.companyId?.name || ''
            );
      }
      return 0;
    });
  }, [filteredApps, sortBy, sortDir]);

  // Pagination (client-side for now)
  const totalPages = Math.ceil(sortedApps.length / pageSize);
  const pagedApps = sortedApps.slice((page - 1) * pageSize, page * pageSize);

  // Status options
  const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offered', label: 'Offered' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

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
            <p className="text-gray-600 font-medium">
              Loading your applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
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
        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <div className="text-center space-y-4 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              No Applications Yet
            </h2>
            <p className="text-gray-600 max-w-md">
              You haven't applied to any jobs yet. Start your job search journey
              today!
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Link href="/jobs" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                <Link
                  href="/dashboard/applicant/profile"
                  className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Complete Profile
                </Link>
              </Button>
            </div>
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
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Applications
              </h1>
              <p className="text-sm text-gray-600">
                Track and manage your job applications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-1 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-all ${
                  view === 'card'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                onClick={() => setView('card')}
                title="Card View">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded-md transition-all ${
                  view === 'table'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                onClick={() => setView('table')}
                title="Table View">
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Applications
                </CardTitle>
                <Briefcase className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <p className="text-xs text-blue-600">All time applications</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  In Progress
                </CardTitle>
                <Clock className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.applied + stats.screening}
                </div>
                <p className="text-xs text-yellow-600">Under review</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Interviews
                </CardTitle>
                <Calendar className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.interview + stats.offered}
                </div>
                <p className="text-xs text-purple-600">Active opportunities</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.total > 0
                    ? Math.round(
                        ((stats.hired + stats.offered) / stats.total) * 100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-green-600">
                  {stats.hired} hired, {stats.offered} offered
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="animate-in slide-in-from-top-2 duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      type="text"
                      value={search}
                      onChange={e => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search job title or company..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={statusFilter}
                      onValueChange={value => {
                        setStatusFilter(value);
                        setPage(1);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Select
                      value={companyFilter}
                      onValueChange={value => {
                        setCompanyFilter(value);
                        setPage(1);
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Companies</SelectItem>
                        {companyOptions.map(opt => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={e => {
                          setDateFrom(e.target.value);
                          setPage(1);
                        }}
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={e => {
                          setDateTo(e.target.value);
                          setPage(1);
                        }}
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <Select
                  value={sortBy}
                  onValueChange={value => setSortBy(value as any)}>
                  <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Applied</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="title">Job Title</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
                  }
                  className="bg-white/50 hover:bg-white/80">
                  {sortDir === 'asc' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Show:
                </label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={value => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}>
                  <SelectTrigger className="w-20 bg-white/80 backdrop-blur-sm border-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Showing {pagedApps.length} of {applications.length} applications
            </div>
          </div>

          {/* View rendering */}
          {pagedApps.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">
                  No applications match your filters
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter('');
                    setCompanyFilter('');
                    setDateFrom('');
                    setDateTo('');
                    setSearch('');
                    setPage(1);
                  }}
                  className="bg-white/80 backdrop-blur-sm border-white/50">
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : view === 'card' ? (
            <div className="grid gap-6">
              {pagedApps.map(app => (
                <ApplicationCard key={app._id} application={app} />
              ))}
            </div>
          ) : (
            <ApplicationsTable applications={pagedApps} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/80 backdrop-blur-sm border-white/50">
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={`w-10 ${
                      p === page
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-white/80 backdrop-blur-sm border-white/50'
                    }`}>
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-white/80 backdrop-blur-sm border-white/50">
                Next
              </Button>
            </div>
          )}
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

function ApplicationCard({ application }: { application: any }) {
  const job = application.jobId;
  const company = job?.companyId;
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (
      !confirm(
        'Are you sure you want to withdraw this application? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsWithdrawing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${application._id}/withdraw`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        toast.success('Application withdrawn successfully');
        window.location.reload(); // Reload to show updated status
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleDownload = () => {
    // Generate application summary as text
    const applicationSummary = `
APPLICATION SUMMARY
==================

Job Title: ${job?.title || 'N/A'}
Company: ${company?.name || 'N/A'}
Location: ${job?.location || 'N/A'}
Employment Type: ${job?.employmentType || 'N/A'}
Salary Range: ${
      job?.salaryMin ? `₱${job.salaryMin.toLocaleString()}` : 'N/A'
    } - ${job?.salaryMax ? `₱${job.salaryMax.toLocaleString()}` : 'N/A'}

Application Status: ${application.status}
Applied Date: ${new Date(application.createdAt).toLocaleString()}
Last Updated: ${new Date(application.updatedAt).toLocaleString()}

${application.notes ? `\nAdmin Notes:\n${application.notes}\n` : ''}
${
  application.interviewDate
    ? `\nInterview Date: ${new Date(
        application.interviewDate
      ).toLocaleString()}`
    : ''
}
${
  application.interviewLocation
    ? `Interview Location: ${application.interviewLocation}`
    : ''
}
${
  application.interviewType
    ? `Interview Type: ${application.interviewType}`
    : ''
}
${
  application.rejectionReason
    ? `\nRejection Reason:\n${application.rejectionReason}`
    : ''
}

Documents Submitted:
- Resume: ${application.resumeId?.title || 'N/A'}
- PDS: ${application.pdsId?.title || 'N/A'}
${
  application.additionalDocuments?.length > 0
    ? `- Additional Documents: ${application.additionalDocuments.length}`
    : ''
}

==================
Generated on: ${new Date().toLocaleString()}
    `.trim();

    // Create and download file
    const blob = new Blob([applicationSummary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `application-${job?.title?.replace(
      /\s+/g,
      '-'
    )}-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Application summary downloaded');
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-50 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="object-contain h-16 w-16 rounded-lg"
                />
              ) : (
                <Building className="h-10 w-10 text-gray-300" />
              )}
            </div>
          </div>

          {/* Job & Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/jobs/${job?._id}`}
                  className="font-semibold text-xl hover:text-brand-blue transition-colors truncate block">
                  {job?.title}
                </Link>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">{company?.name}</span>
                  {job?.location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </>
                  )}
                </div>
              </div>
              <StatusBadge status={application.status} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {job?.employmentType}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Salary:</span>{' '}
                {job?.salaryMin ? `₱${job.salaryMin.toLocaleString()}` : '—'}
                {job?.salaryMax && ` - ₱${job.salaryMax.toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Applied:</span>{' '}
                {new Date(application.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Documents:</span>
                <div className="flex gap-1">
                  {application.resumeId?.fileUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`/${application.resumeId.fileUrl.replace(
                          /\\/g,
                          '/'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FileText className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {application.pdsId?.fileUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`/${application.pdsId.fileUrl.replace(
                          /\\/g,
                          '/'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <File className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Status Stepper */}
            <Stepper status={application.status} />

            {/* Status Details & Updates */}
            {application.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Admin Notes
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {application.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Interview Details */}
            {application.status === 'interview' &&
              application.interviewDate && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-purple-900">
                        Interview Scheduled
                      </p>
                      <p className="text-sm text-purple-700">
                        <strong>Date:</strong>{' '}
                        {new Date(application.interviewDate).toLocaleString()}
                      </p>
                      {application.interviewLocation && (
                        <p className="text-sm text-purple-700">
                          <strong>Location:</strong>{' '}
                          {application.interviewLocation}
                        </p>
                      )}
                      {application.interviewType && (
                        <p className="text-sm text-purple-700">
                          <strong>Type:</strong> {application.interviewType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Rejection Reason */}
            {application.status === 'rejected' &&
              application.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {application.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/jobs/${job?._id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Job
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Application
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleWithdraw}
                      disabled={
                        isWithdrawing ||
                        application.status === 'withdrawn' ||
                        application.status === 'hired'
                      }
                      className={`${
                        application.status === 'withdrawn' ||
                        application.status === 'hired'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'text-red-600'
                      }`}>
                      <XCircle className="h-4 w-4 mr-2" />
                      {isWithdrawing
                        ? 'Withdrawing...'
                        : application.status === 'withdrawn'
                        ? 'Already Withdrawn'
                        : application.status === 'hired'
                        ? 'Cannot Withdraw'
                        : 'Withdraw Application'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationsTable({ applications }: { applications: any[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-white/50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Company
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Location
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Salary
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Applied
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map(app => {
                const job = app.jobId;
                const company = job?.companyId;
                return (
                  <tr
                    key={app._id}
                    className="hover:bg-blue-50/30 transition-all duration-200 border-b border-white/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {company?.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="object-contain h-8 w-8 rounded"
                            />
                          ) : (
                            <Building className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium">{company?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/jobs/${job?._id}`}
                        className="text-brand-blue hover:underline font-medium">
                        {job?.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{job?.location}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs">
                        {job?.employmentType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {job?.salaryMin ? (
                        <span className="font-medium text-green-700">
                          ₱{job.salaryMin.toLocaleString()}
                        </span>
                      ) : (
                        '—'
                      )}
                      {job?.salaryMax && (
                        <span className="text-gray-600">
                          {' '}
                          - ₱{job.salaryMax.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/jobs/${job?._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Withdraw
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
