'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeViewer } from '@/components/resume-viewer';
import {
  FileText,
  Download,
  Share2,
  X,
  RefreshCw,
  Settings,
  Palette,
  Type,
  Layout,
  Printer,
  FileDown
} from 'lucide-react';
import { toast } from 'sonner';

// Helper function to generate resume content for print/PDF
const generateResumeContent = (resumeData: any) => {
  return `
    <div class="header">
      <div class="name">${
        resumeData.personalInfo?.fullName || 'Your Name'
      }</div>
      <div class="title">${
        resumeData.personalInfo?.professionalTitle || 'Professional Title'
      }</div>
      <div class="contact">
        ${
          resumeData.personalInfo?.email
            ? `<span>📧 ${resumeData.personalInfo.email}</span>`
            : ''
        }
        ${
          resumeData.personalInfo?.phone
            ? `<span>📞 ${resumeData.personalInfo.phone}</span>`
            : ''
        }
        ${
          resumeData.personalInfo?.address
            ? `<span>📍 ${resumeData.personalInfo.address}</span>`
            : ''
        }
      </div>
    </div>

    ${
      resumeData.professionalSummary
        ? `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <p>${resumeData.professionalSummary}</p>
      </div>
    `
        : ''
    }

    ${
      resumeData.coreCompetencies && resumeData.coreCompetencies.length > 0
        ? `
      <div class="section">
        <div class="section-title">Core Competencies</div>
        <div class="skills">
          ${resumeData.coreCompetencies
            .map((skill: string) => `<span class="skill">${skill}</span>`)
            .join('')}
        </div>
      </div>
    `
        : ''
    }

    ${
      resumeData.workExperience && resumeData.workExperience.length > 0
        ? `
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${resumeData.workExperience
          .map(
            (work: any) => `
          <div class="experience-item">
            <div class="job-title">${work.position || 'Position'}</div>
            <div class="company">${work.company || 'Company'}</div>
            <div class="date">${work.startDate || 'Start'} - ${
              work.endDate || 'Present'
            }</div>
            ${
              work.achievements && work.achievements.length > 0
                ? `
              <ul class="achievements">
                ${work.achievements
                  .map((achievement: string) => `<li>${achievement}</li>`)
                  .join('')}
              </ul>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }

    ${
      resumeData.education && resumeData.education.length > 0
        ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${resumeData.education
          .map(
            (edu: any) => `
          <div class="education-item">
            <div class="job-title">${edu.degree || 'Degree'}</div>
            <div class="company">${edu.institution || 'Institution'}</div>
            <div class="date">${edu.graduationYear || 'Year'}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }

    ${
      resumeData.certifications && resumeData.certifications.length > 0
        ? `
      <div class="section">
        <div class="section-title">Certifications</div>
        ${resumeData.certifications
          .map(
            (cert: any) => `
          <div class="education-item">
            <div class="job-title">${cert.name || 'Certification'}</div>
            <div class="company">${cert.issuer || 'Issuer'}</div>
            <div class="date">${cert.dateObtained || 'Date'}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }
  `;
};

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: any;
  metadata?: any;
  onRegenerate?: (industry: string, role: string) => void;
  onOptimizeForJob?: (jobData: any) => void;
}

export function ResumeModal({
  isOpen,
  onClose,
  resumeData,
  metadata,
  onRegenerate,
  onOptimizeForJob
}: ResumeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = async (industry: string, role: string) => {
    if (onRegenerate) {
      setIsGenerating(true);
      try {
        await onRegenerate(industry, role);
        toast.success('Resume regenerated successfully!');
      } catch (error) {
        toast.error('Failed to regenerate resume');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleOptimizeForJob = async (jobData: any) => {
    if (onOptimizeForJob) {
      setIsGenerating(true);
      try {
        await onOptimizeForJob(jobData);
        toast.success('Resume optimized for job!');
      } catch (error) {
        toast.error('Failed to optimize resume');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  console.log('ResumeModal render:', {
    isOpen,
    resumeData: !!resumeData,
    metadata: !!metadata
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col p-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 ">
        {/* Background Blobs */}

        <AlertDialogHeader className="p-4 sm:p-6 pb-0 relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ATS-Compliant Resume
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-gray-600">
                  AI-generated resume from your PDS data •{' '}
                  {metadata?.generatedAt
                    ? new Date(metadata.generatedAt).toLocaleDateString()
                    : 'Just now'}
                </AlertDialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {resumeData?.atsOptimization && (
                <Badge
                  variant="secondary"
                  className={`px-2 py-1 sm:px-3 sm:py-1 bg-white/60 backdrop-blur-sm border-white/50 text-xs sm:text-sm ${
                    resumeData.atsOptimization.atsScore >= 80
                      ? 'text-green-700'
                      : resumeData.atsOptimization.atsScore >= 60
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  }`}>
                  ATS: {resumeData.atsOptimization.atsScore}/100
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Print functionality - we'll pass this to ResumeViewer
                  const printWindow = window.open('', '_blank');
                  if (printWindow && resumeData) {
                    const resumeContent = generateResumeContent(resumeData);
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Resume - ${
                            resumeData.personalInfo?.fullName || 'Resume'
                          }</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                            .title { font-size: 18px; color: #2563eb; margin-bottom: 15px; }
                            .contact { font-size: 14px; color: #666; }
                            .section { margin-bottom: 25px; }
                            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
                            .experience-item, .education-item { margin-bottom: 15px; }
                            .job-title { font-weight: bold; font-size: 16px; }
                            .company { color: #2563eb; font-weight: bold; }
                            .date { color: #666; font-style: italic; }
                            .achievements { margin-top: 8px; }
                            .achievements li { margin-bottom: 3px; }
                            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
                            .skill { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          ${resumeContent}
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                    }, 500);
                  }
                }}
                className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Download PDF functionality
                  const printWindow = window.open('', '_blank');
                  if (printWindow && resumeData) {
                    const resumeContent = generateResumeContent(resumeData);
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Resume - ${
                            resumeData.personalInfo?.fullName || 'Resume'
                          }</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                            .title { font-size: 18px; color: #2563eb; margin-bottom: 15px; }
                            .contact { font-size: 14px; color: #666; }
                            .section { margin-bottom: 25px; }
                            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
                            .experience-item, .education-item { margin-bottom: 15px; }
                            .job-title { font-weight: bold; font-size: 16px; }
                            .company { color: #2563eb; font-weight: bold; }
                            .date { color: #666; font-style: italic; }
                            .achievements { margin-top: 8px; }
                            .achievements li { margin-bottom: 3px; }
                            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
                            .skill { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          ${resumeContent}
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                    }, 500);
                  }
                }}
                className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <FileDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="flex-1 overflow-y-auto relative z-10">
          {resumeData ? (
            <ResumeViewer
              resumeData={resumeData}
              metadata={metadata}
              onClose={onClose}
            />
          ) : (
            <div className="p-4 sm:p-6 text-center">
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No Resume Data
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Resume data is not available or is loading...
              </p>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
