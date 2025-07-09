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
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { jobAPI, applicationAPI, userAPI, companyAPI } from '@/lib/api-service';
import { format } from 'date-fns';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

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
        setJobs(res.jobs || res);
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-20 items-center gap-3 px-6">
          <Briefcase className="h-8 w-8 text-brand-blue" />
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-8 space-y-8">
          <Card className="shadow-md border-0">
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
              {/* Search */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div className="flex flex-wrap gap-4 items-center rounded-lg bg-gray-50 p-4 border border-gray-100 shadow-sm">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
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
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                    placeholder="To"
                  />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-[180px] rounded-md border border-input bg-background px-4 py-2 text-sm">
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-applicationCount">Most Applications</option>
                    <option value="title">Title A-Z</option>
                    <option value="-title">Title Z-A</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={exportCSV}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                  </Button>
                </div>
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
              </div>
              {/* Jobs Table */}
              <div className="rounded-xl border overflow-x-auto bg-white shadow-sm">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                            <span className="text-muted-foreground">
                              Loading jobs...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : jobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Briefcase className="h-8 w-8 text-gray-300" />
                            <span className="text-muted-foreground">
                              No jobs found
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs.map(job => (
                        <>
                          <TableRow key={job._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {job.title}
                                {job.isFeatured && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs">
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
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {companyCache[job.companyId?._id]?.logo && (
                                  <img
                                    src={companyCache[job.companyId._id].logo}
                                    alt={companyCache[job.companyId._id].name}
                                    className="h-6 w-6 rounded-full object-contain"
                                  />
                                )}
                                <span>
                                  {companyCache[job.companyId?._id]?.name ||
                                    job.companyId?.name ||
                                    '-'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{job.employmentType || '-'}</TableCell>
                            <TableCell>{job.location || '-'}</TableCell>
                            <TableCell>{job.applicationCount || 0}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  setExpandedJob(
                                    expandedJob === job._id ? null : job._id
                                  );
                                  if (!applicationsByJob[job._id])
                                    await fetchApplicationsForJob(job._id);
                                }}>
                                {expandedJob === job._id
                                  ? 'Hide Applicants'
                                  : 'Show Applicants'}
                              </Button>
                            </TableCell>
                          </TableRow>
                          {/* Expandable Applicants Section */}
                          {expandedJob === job._id && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-blue-50">
                                <div className="p-4">
                                  <div className="font-semibold mb-2">
                                    Applicants:
                                  </div>
                                  <Table className="border">
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date Applied</TableHead>
                                        <TableHead>Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {applicationsByJob[job._id]?.length ===
                                      0 ? (
                                        <TableRow>
                                          <TableCell
                                            colSpan={5}
                                            className="text-center py-6 text-muted-foreground">
                                            No applicants for this job
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        applicationsByJob[job._id]?.map(app => {
                                          const applicant =
                                            userCache[app.applicantId?._id] ||
                                            app.applicantId;
                                          return (
                                            <TableRow key={app._id}>
                                              <TableCell>
                                                <div className="flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-semibold text-base">
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
                                                  <span>
                                                    {applicant.name ||
                                                      `${
                                                        applicant.firstName ||
                                                        ''
                                                      } ${
                                                        applicant.lastName || ''
                                                      }`.trim() ||
                                                      applicant.email ||
                                                      'Applicant'}
                                                  </span>
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                {applicant.email}
                                              </TableCell>
                                              <TableCell>
                                                {getStatusBadge(app.status)}
                                              </TableCell>
                                              <TableCell>
                                                {formatDate(app.createdAt)}
                                              </TableCell>
                                              <TableCell>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  asChild>
                                                  <Link
                                                    href={`/dashboard/admin/applicants/${applicant._id}`}>
                                                    View
                                                  </Link>
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  asChild>
                                                  <a
                                                    href={`mailto:${applicant.email}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    <Mail className="h-4 w-4" />
                                                  </a>
                                                </Button>
                                                {app.status !== 'hired' && (
                                                  <Button
                                                    variant="ghost"
                                                    size="icon">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                  </Button>
                                                )}
                                                {app.status !== 'rejected' && (
                                                  <Button
                                                    variant="ghost"
                                                    size="icon">
                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                  </Button>
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
