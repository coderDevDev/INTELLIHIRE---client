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
  MapPin
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; color: string; icon: any }> =
    {
      applied: {
        label: 'Applied',
        color: 'bg-blue-100 text-blue-700',
        icon: <FileText className="h-4 w-4" />
      },
      screening: {
        label: 'Screening',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Search className="h-4 w-4" />
      },
      interview: {
        label: 'Interview',
        color: 'bg-purple-100 text-purple-700',
        icon: <Calendar className="h-4 w-4" />
      },
      offered: {
        label: 'Offered',
        color: 'bg-green-100 text-green-700',
        icon: <BadgeCheck className="h-4 w-4" />
      },
      hired: {
        label: 'Hired',
        color: 'bg-green-200 text-green-800',
        icon: <CheckCircle className="h-4 w-4" />
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle className="h-4 w-4" />
      },
      withdrawn: {
        label: 'Withdrawn',
        color: 'bg-gray-100 text-gray-500',
        icon: <ArrowRight className="h-4 w-4" />
      }
    };
  const s = statusMap[status] || statusMap['applied'];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${s.color}`}>
      {s.icon}
      {s.label}
    </span>
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
    <div className="flex flex-col gap-2 mt-4">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={`rounded-full p-1 ${
              i <= currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
            {step.icon}
          </div>
          <span
            className={`text-sm font-medium ${
              i <= currentStep ? 'text-green-700' : 'text-gray-400'
            }`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-200 mx-2" />
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
      // Status filter
      if (statusFilter && app.status !== statusFilter) return false;
      // Company filter
      if (companyFilter && app.jobId?.companyId?._id !== companyFilter)
        return false;
      // Date range filter
      if (dateFrom && new Date(app.createdAt) < new Date(dateFrom))
        return false;
      if (dateTo && new Date(app.createdAt) > new Date(dateTo)) return false;
      // Search filter
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

  if (loading)
    return <div className="flex justify-center py-12">Loading...</div>;

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="h-12 w-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Applications Yet</h2>
        <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        <Link href="/jobs" className="mt-4 text-blue-600 underline">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <div className="flex gap-2 items-center">
          <button
            className={`p-2 rounded ${
              view === 'card' ? 'bg-brand-blue text-white' : 'bg-gray-100'
            }`}
            onClick={() => setView('card')}
            title="Card View">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded ${
              view === 'table' ? 'bg-brand-blue text-white' : 'bg-gray-100'
            }`}
            onClick={() => setView('table')}
            title="Table View">
            <TableIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Filters and search */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="block text-xs font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border px-2 py-1 text-sm min-w-[120px]">
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Company</label>
          <select
            value={companyFilter}
            onChange={e => {
              setCompanyFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border px-2 py-1 text-sm min-w-[120px]">
            <option value="">All Companies</option>
            {companyOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="rounded border px-2 py-1 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search job title or company..."
            className="rounded border px-2 py-1 text-sm w-full"
          />
        </div>
      </div>
      {/* Sorting and page size controls */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="rounded border px-2 py-1 text-sm">
          <option value="date">Date Applied</option>
          <option value="status">Status</option>
          <option value="title">Job Title</option>
          <option value="company">Company</option>
        </select>
        <button
          className="text-sm underline"
          onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}>
          {sortDir === 'asc' ? 'Ascending' : 'Descending'}
        </button>
        <label className="ml-4 text-sm font-medium">Page size:</label>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="rounded border px-2 py-1 text-sm">
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
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
      {/* Pagination controls */}
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded border bg-white text-brand-blue disabled:opacity-50">
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded border ${
              p === page
                ? 'bg-brand-blue text-white'
                : 'bg-white text-brand-blue'
            }`}>
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded border bg-white text-brand-blue disabled:opacity-50">
          Next
        </button>
      </div>
      <div className="text-sm text-muted-foreground pb-8 mt-2">
        Showing {pagedApps.length} of {applications.length} applications
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: any }) {
  const job = application.jobId;
  const company = job?.companyId;
  return (
    <div className="p-6 rounded-xl bg-white border shadow-sm hover:shadow-lg transition flex flex-col md:flex-row gap-4 items-center">
      {/* Company Logo */}
      <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-gray-50 rounded-lg border">
        {company?.logo ? (
          <img
            src={company.logo}
            alt={company.name}
            className="object-contain h-16 w-16"
          />
        ) : (
          <Briefcase className="h-10 w-10 text-gray-300" />
        )}
      </div>
      {/* Job & Company Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Link
            href={`/jobs/${job?._id}`}
            className="font-semibold text-lg hover:underline truncate">
            {job?.title}
          </Link>
          <span className="ml-2">
            <StatusBadge status={application.status} />
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mb-1">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="font-medium truncate">{company?.name}</span>
          <span className="mx-2">•</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
            {job?.employmentType}
          </span>
          {job?.location && (
            <>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4 text-gray-400 inline" />
              <span>{job.location}</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
          {job?.salaryMin && (
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-green-700">
                ₱{job.salaryMin.toLocaleString()}
              </span>
              {job.salaryMax && (
                <span>- ₱{job.salaryMax.toLocaleString()}</span>
              )}
            </span>
          )}
          {job?.postedDate && (
            <span className="ml-4 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Posted: {new Date(job.postedDate).toLocaleDateString()}
            </span>
          )}
        </div>
        {job?.description && (
          <div className="text-xs text-gray-600 line-clamp-2 mt-1">
            {job.description}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
          <FileText className="h-4 w-4 text-blue-400" />
          <span>Resume:</span>
          {application.resumeId?.fileUrl && (
            <a
              href={`/${application.resumeId.fileUrl.replace(/\\/g, '/')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline ml-1">
              View
            </a>
          )}
          {application.pdsId?.fileUrl && (
            <>
              <span className="mx-2">|</span>
              <File className="h-4 w-4 text-blue-400" />
              <span>PDS:</span>
              <a
                href={`/${application.pdsId.fileUrl.replace(/\\/g, '/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline ml-1">
                View
              </a>
            </>
          )}
        </div>
        <div className="mt-3">
          <Stepper status={application.status} />
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/jobs/${job?._id}`}
            className="text-sm text-brand-blue underline">
            View Job
          </Link>
        </div>
      </div>
    </div>
  );
}

function ApplicationsTable({ applications }: { applications: any[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Logo</th>
            <th className="px-4 py-2 text-left">Job Title</th>
            <th className="px-4 py-2 text-left">Company</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Salary</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date Applied</th>
            <th className="px-4 py-2 text-left">Resume</th>
            <th className="px-4 py-2 text-left">PDS</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => {
            const job = app.jobId;
            const company = job?.companyId;
            return (
              <tr key={app._id} className="border-t">
                <td className="px-4 py-2">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="object-contain h-10 w-10 rounded"
                    />
                  ) : (
                    <Briefcase className="h-7 w-7 text-gray-300" />
                  )}
                </td>
                <td className="px-4 py-2 max-w-[180px] truncate">
                  <Link
                    href={`/jobs/${job?._id}`}
                    className="text-brand-blue underline">
                    {job?.title}
                  </Link>
                </td>
                <td className="px-4 py-2 max-w-[120px] truncate">
                  {company?.name}
                </td>
                <td className="px-4 py-2">{job?.location}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                    {job?.employmentType}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {job?.salaryMin ? (
                    <span className="font-semibold text-green-700">
                      ₱{job.salaryMin.toLocaleString()}
                    </span>
                  ) : (
                    '—'
                  )}
                  {job?.salaryMax && (
                    <span> - ₱{job.salaryMax.toLocaleString()}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-2">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {app.resumeId?.fileUrl ? (
                    <a
                      href={`/${app.resumeId.fileUrl.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {app.pdsId?.fileUrl ? (
                    <a
                      href={`/${app.pdsId.fileUrl.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/jobs/${job?._id}`}
                    className="text-brand-blue underline text-xs">
                    View Job
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
