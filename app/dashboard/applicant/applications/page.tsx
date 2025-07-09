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
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const data = await applicationAPI.getMyApplications();
        setApplications(data.applications || []);
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
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              No Applications Yet
            </h2>
            <p className="text-gray-600 max-w-md">
              You haven't applied to any jobs yet. Start your job search journey
              today!
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/jobs" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
              <Button variant="outline" asChild>
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Applications
            </h1>
            <p className="text-sm text-gray-600">
              Track and manage your job applications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-all ${
                  view === 'card'
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setView('card')}
                title="Card View">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded-md transition-all ${
                  view === 'table'
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setView('table')}
                title="Table View">
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container px-6 py-8 space-y-6">
          {/* Filters */}
          {showFilters && (
            <Card className="animate-in slide-in-from-top-2 duration-300">
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select
                  value={sortBy}
                  onValueChange={value => setSortBy(value as any)}>
                  <SelectTrigger className="w-40">
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
                  }>
                  {sortDir === 'asc' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Show:</label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={value => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}>
                  <SelectTrigger className="w-20">
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
            <div className="text-sm text-gray-600">
              Showing {pagedApps.length} of {applications.length} applications
            </div>
          </div>

          {/* View rendering */}
          {view === 'card' ? (
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
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}>
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="w-10">
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}>
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ApplicationCard({ application }: { application: any }) {
  const job = application.jobId;
  const company = job?.companyId;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
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
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download Application
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      Withdraw Application
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
    <Card className="border-0 shadow-md">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
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
                    className="hover:bg-gray-50 transition-colors">
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
