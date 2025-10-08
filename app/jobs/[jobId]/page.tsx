'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobAPI, authAPI } from '@/lib/api-service';
import { MainHeader } from '@/components/main-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  MapPin,
  Building,
  Clock,
  Briefcase,
  GraduationCap,
  Globe,
  Users,
  Star,
  Flame,
  CheckCircle,
  UserCheck,
  Link as LinkIcon,
  Eye,
  UserPlus,
  Home,
  Calendar,
  Globe2,
  FileText
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      if (!jobId || typeof jobId !== 'string') return;
      const res = await jobAPI.getJobById(jobId);
      setJob(res);
      setLoading(false);
    }
    fetchJob();
    checkApplicationStatus();
  }, [jobId]);

  const checkApplicationStatus = async () => {
    if (!authAPI.isAuthenticated()) return;
    
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser?.id || !jobId) return;

      const response = await fetch(
        `${API_URL}/applications?jobId=${jobId}&applicantId=${currentUser.id}`,
        {
          headers: { Authorization: `Bearer ${authAPI.getToken()}` }
        }
      );

      const data = await response.json();
      if (data.applications && data.applications.length > 0) {
        setHasApplied(true);
        setApplicationStatus(data.applications[0].status);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Job not found.
      </div>
    );
  }

  const isFeatured = job.isFeatured;
  const isUrgent = job.isUrgent;
  const allowsRemote = job.allowsRemote;
  const salary = job.salaryMax
    ? `₱${job.salaryMin?.toLocaleString()} - ₱${job.salaryMax?.toLocaleString()} ${
        job.salaryPeriod ? `/${job.salaryPeriod}` : ''
      }`
    : job.salaryMin
    ? `₱${job.salaryMin?.toLocaleString()} ${
        job.salaryPeriod ? `/${job.salaryPeriod}` : ''
      }`
    : '—';
  const postedDate = job.postedDate
    ? new Date(job.postedDate).toLocaleDateString()
    : '';
  const expiryDate = job.expiryDate
    ? new Date(job.expiryDate).toLocaleDateString()
    : '';

  const handleApply = () => {
    if (!authAPI.isAuthenticated()) {
      router.push(`/login?redirect=/jobs/${job._id}/apply`);
      return;
    }
    router.push(`/jobs/${job._id}/apply`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="container max-w-3xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-gray-100 border">
                <img
                  src={job.companyId?.logo || '/placeholder.svg'}
                  alt={job.companyId?.name}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  {isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                      <Star className="h-4 w-4" /> Featured
                    </span>
                  )}
                  {isUrgent && (
                    <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      <Flame className="h-4 w-4" /> Urgent
                    </span>
                  )}
                  {allowsRemote && (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      <Home className="h-4 w-4" /> Remote
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {job.companyId?.name}
                  </span>
                  {job.department && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.department}
                    </span>
                  )}
                  {job.categoryId?.name && (
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.categoryId.name}
                    </span>
                  )}
                  {job.companyId?.industry && (
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-4 w-4" />
                      {job.companyId.industry}
                    </span>
                  )}
                  {job.companyId?.website && (
                    <a
                      href={job.companyId.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-blue hover:underline">
                      <LinkIcon className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />{' '}
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />{' '}
                <span>Posted {postedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />{' '}
                <span>Expires {expiryDate}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-brand-blue">
                <Briefcase className="h-4 w-4" /> <span>{salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />{' '}
                <span>
                  {job.experienceLevel}
                  {job.experienceYearsMin
                    ? ` (${job.experienceYearsMin}${
                        job.experienceYearsMax
                          ? `-${job.experienceYearsMax}`
                          : ''
                      } yrs)`
                    : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />{' '}
                <span>{job.educationLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />{' '}
                <span>
                  {job.positionCount || 1} position
                  {job.positionCount > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />{' '}
                <span>{job.viewCount || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />{' '}
                <span>{job.applicationCount || 0} applied</span>
              </div>
            </div>
            {hasApplied ? (
              <div className="w-full mb-8">
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-bold text-green-900">
                      Already Applied
                    </h3>
                  </div>
                  <p className="text-green-700 mb-3">
                    You have already submitted an application for this position.
                  </p>
                  {applicationStatus && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-green-600">Current Status:</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        applicationStatus === 'applied' ? 'bg-blue-100 text-blue-700' :
                        applicationStatus === 'screening' ? 'bg-yellow-100 text-yellow-700' :
                        applicationStatus === 'interview' ? 'bg-purple-100 text-purple-700' :
                        applicationStatus === 'offered' ? 'bg-green-100 text-green-700' :
                        applicationStatus === 'hired' ? 'bg-green-200 text-green-800' :
                        applicationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                      </span>
                    </div>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 bg-white border-green-500 text-green-700 hover:bg-green-50">
                    <Link href="/dashboard/applicant/applications">
                      View Application Details
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full mb-8 text-lg py-4"
                size="lg"
                onClick={handleApply}>
                Apply Now
              </Button>
            )}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-blue" /> Job
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.description}
                </p>
              </div>
              {job.responsibilities && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-blue" />{' '}
                    Responsibilities
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.responsibilities}
                  </p>
                </div>
              )}
              {job.requirements && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-brand-blue" />{' '}
                    Requirements
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              )}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-brand-blue" /> Skills
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string) => (
                      <li
                        key={skill}
                        className="inline-block rounded bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium border border-blue-100">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {job.eligibility && job.eligibility.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-blue" />{' '}
                    Eligibility
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {job.eligibility.map((item: string) => (
                      <li
                        key={item}
                        className="inline-block rounded bg-green-50 text-green-700 px-3 py-1 text-xs font-medium border border-green-100">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {job.benefits && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5 text-brand-blue" /> Benefits
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.benefits}
                  </p>
                </div>
              )}
            </div>
            {job.companyId && (
              <div className="mt-10 border-t pt-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Building className="h-5 w-5 text-brand-blue" /> About the
                  Company
                </h2>
                <div className="text-gray-700 mb-2">
                  {job.companyId.description}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {job.companyId.industry && (
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-4 w-4" />
                      {job.companyId.industry}
                    </span>
                  )}
                  {job.companyId.website && (
                    <a
                      href={job.companyId.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-blue hover:underline">
                      <LinkIcon className="h-4 w-4" />
                      {job.companyId.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/jobs" className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
