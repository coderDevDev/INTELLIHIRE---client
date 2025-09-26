'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Eye,
  FileText,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  GraduationCap,
  Briefcase,
  Users,
  Target,
  Star,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Copy,
  Share2,
  Settings,
  Palette,
  Type,
  Layout,
  FileImage,
  FileCode,
  FileType,
  FileDown
} from 'lucide-react';
import { toast } from 'sonner';

interface ResumeViewerProps {
  resumeData: any;
  metadata?: any;
  onClose?: () => void;
}

export function ResumeViewer({
  resumeData,
  metadata,
  onClose
}: ResumeViewerProps) {
  console.log('ResumeViewer render:', {
    hasResumeData: !!resumeData,
    hasMetadata: !!metadata,
    resumeDataKeys: resumeData ? Object.keys(resumeData) : [],
    metadataKeys: metadata ? Object.keys(metadata) : []
  });
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [fontSize, setFontSize] = useState('medium');

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No resume data available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getATSColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateResumeContent = () => {
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
              .map(skill => `<span class="skill">${skill}</span>`)
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
              work => `
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
                    .map(achievement => `<li>${achievement}</li>`)
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
              edu => `
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
              cert => `
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

  const generateTextResume = () => {
    let text = '';

    // Header
    text += `${resumeData.personalInfo?.fullName || 'Your Name'}\n`;
    text += `${
      resumeData.personalInfo?.professionalTitle || 'Professional Title'
    }\n`;
    text += `${'='.repeat(50)}\n\n`;

    // Contact Info
    if (resumeData.personalInfo?.email)
      text += `Email: ${resumeData.personalInfo.email}\n`;
    if (resumeData.personalInfo?.phone)
      text += `Phone: ${resumeData.personalInfo.phone}\n`;
    if (resumeData.personalInfo?.address)
      text += `Address: ${resumeData.personalInfo.address}\n`;
    text += '\n';

    // Professional Summary
    if (resumeData.professionalSummary) {
      text += `PROFESSIONAL SUMMARY\n`;
      text += `${'-'.repeat(20)}\n`;
      text += `${resumeData.professionalSummary}\n\n`;
    }

    // Core Competencies
    if (resumeData.coreCompetencies && resumeData.coreCompetencies.length > 0) {
      text += `CORE COMPETENCIES\n`;
      text += `${'-'.repeat(20)}\n`;
      text += `${resumeData.coreCompetencies.join(' • ')}\n\n`;
    }

    // Work Experience
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      text += `WORK EXPERIENCE\n`;
      text += `${'-'.repeat(20)}\n`;
      resumeData.workExperience.forEach(work => {
        text += `${work.position || 'Position'}\n`;
        text += `${work.company || 'Company'} | ${
          work.startDate || 'Start'
        } - ${work.endDate || 'Present'}\n`;
        if (work.achievements && work.achievements.length > 0) {
          work.achievements.forEach(achievement => {
            text += `• ${achievement}\n`;
          });
        }
        text += '\n';
      });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      text += `EDUCATION\n`;
      text += `${'-'.repeat(20)}\n`;
      resumeData.education.forEach(edu => {
        text += `${edu.degree || 'Degree'}\n`;
        text += `${edu.institution || 'Institution'} | ${
          edu.graduationYear || 'Year'
        }\n`;
        if (edu.honors) text += `Honors: ${edu.honors}\n`;
        text += '\n';
      });
    }

    // Certifications
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      text += `CERTIFICATIONS\n`;
      text += `${'-'.repeat(20)}\n`;
      resumeData.certifications.forEach(cert => {
        text += `${cert.name || 'Certification'}\n`;
        text += `${cert.issuer || 'Issuer'} | ${cert.dateObtained || 'Date'}\n`;
        if (cert.expiryDate) text += `Expires: ${cert.expiryDate}\n`;
        text += '\n';
      });
    }

    return text;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* ATS Score Card */}
      {resumeData.atsOptimization && (
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-900">ATS Score</span>
                </div>
                <Badge
                  className={`text-lg px-4 py-2 ${getATSColor(
                    resumeData.atsOptimization.atsScore
                  )}`}>
                  {resumeData.atsOptimization.atsScore}/100
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Industry: {resumeData.metadata?.targetIndustry || 'General'}
                </p>
                <p className="text-sm text-gray-600">
                  Keywords: {resumeData.metadata?.keywordCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg">
          <TabsTrigger
            value="preview"
            className="flex items-center gap-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-md transition-all duration-300">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="formatted"
            className="flex items-center gap-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-md transition-all duration-300">
            <FileText className="h-4 w-4" />
            Formatted
          </TabsTrigger>
          {/* <TabsTrigger
            value="raw"
            className="flex items-center gap-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-md transition-all duration-300">
            <FileCode className="h-4 w-4" />
            Raw Data
          </TabsTrigger> */}
          <TabsTrigger
            value="optimization"
            className="flex items-center gap-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-md transition-all duration-300">
            <Settings className="h-4 w-4" />
            ATS Analysis
          </TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <div className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1 rounded-3xl p-8">
            {/* Personal Information */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resumeData.personalInfo?.fullName || 'Your Name'}
              </h1>
              <p className="text-xl text-blue-600 font-medium mb-4">
                {resumeData.personalInfo?.professionalTitle ||
                  'Professional Title'}
              </p>
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                {resumeData.personalInfo?.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {resumeData.personalInfo.email}
                  </div>
                )}
                {resumeData.personalInfo?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {resumeData.personalInfo.phone}
                  </div>
                )}
                {resumeData.personalInfo?.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {resumeData.personalInfo.address}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Professional Summary */}
            {resumeData.professionalSummary && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resumeData.professionalSummary}
                </p>
              </div>
            )}

            {/* Core Competencies */}
            {resumeData.coreCompetencies &&
              resumeData.coreCompetencies.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    Core Competencies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.coreCompetencies.map(
                      (skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1">
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Technical Skills */}
            {resumeData.technicalSkills && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Technical Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(resumeData.technicalSkills).map(
                    ([category, skills]: [string, any]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="font-medium text-gray-800 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(skills) &&
                            skills.map((skill: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {resumeData.workExperience &&
              resumeData.workExperience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.workExperience.map(
                      (work: any, index: number) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-200 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {work.position}
                              </h3>
                              <p className="text-gray-700">{work.company}</p>
                              <p className="text-sm text-gray-600">
                                {work.location}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>
                                {work.startDate} - {work.endDate}
                              </p>
                              {work.isCurrentRole && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                          </div>
                          {work.achievements &&
                            work.achievements.length > 0 && (
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {work.achievements.map(
                                  (achievement: string, idx: number) => (
                                    <li key={idx}>{achievement}</li>
                                  )
                                )}
                              </ul>
                            )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-3">
                  {resumeData.education.map((edu: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        <p className="text-sm text-gray-600">{edu.location}</p>
                        {edu.honors && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {edu.honors}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {edu.graduationYear}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications &&
              resumeData.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Certifications
                  </h2>
                  <div className="space-y-2">
                    {resumeData.certifications.map(
                      (cert: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {cert.issuer}
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p>{cert.dateObtained}</p>
                            {cert.expiryDate && (
                              <p>Expires: {cert.expiryDate}</p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </TabsContent>

        {/* Formatted Tab */}
        <TabsContent value="formatted" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                <FileType className="h-5 w-5 text-blue-600" />
                Formatted View
              </CardTitle>
              <CardDescription>
                Clean, ATS-friendly format ready for applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white/60 backdrop-blur-sm border border-white/50 p-6 rounded-xl font-mono text-sm shadow-lg">
                <pre className="whitespace-pre-wrap">
                  {`${resumeData.personalInfo?.fullName || 'Your Name'}
${resumeData.personalInfo?.professionalTitle || 'Professional Title'}
${resumeData.personalInfo?.email || ''} | ${
                    resumeData.personalInfo?.phone || ''
                  } | ${resumeData.personalInfo?.address || ''}

PROFESSIONAL SUMMARY
${resumeData.professionalSummary || ''}

CORE COMPETENCIES
${resumeData.coreCompetencies?.join(' • ') || ''}

TECHNICAL SKILLS
${Object.entries(resumeData.technicalSkills || {})
  .map(
    ([category, skills]: [string, any]) =>
      `${category.toUpperCase()}: ${
        Array.isArray(skills) ? skills.join(', ') : ''
      }`
  )
  .join('\n')}

WORK EXPERIENCE
${
  resumeData.workExperience
    ?.map(
      (work: any) =>
        `${work.position} | ${work.company} | ${work.startDate} - ${
          work.endDate
        }
${work.location}
${
  work.achievements
    ?.map((achievement: string) => `• ${achievement}`)
    .join('\n') || ''
}`
    )
    .join('\n\n') || ''
}

EDUCATION
${
  resumeData.education
    ?.map(
      (edu: any) =>
        `${edu.degree} | ${edu.institution} | ${edu.graduationYear}
${edu.location}${edu.honors ? ` | ${edu.honors}` : ''}`
    )
    .join('\n') || ''
}

CERTIFICATIONS
${
  resumeData.certifications
    ?.map(
      (cert: any) =>
        `${cert.name} | ${cert.issuer} | ${cert.dateObtained}${
          cert.expiryDate ? ` | Expires: ${cert.expiryDate}` : ''
        }`
    )
    .join('\n') || ''
}`}
                </pre>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('formatted')}
                  className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResume('TXT')}
                  className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download TXT
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                <FileCode className="h-5 w-5 text-blue-600" />
                Raw JSON Data
              </CardTitle>
              <CardDescription>
                Complete resume data structure for developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900/90 backdrop-blur-sm text-green-400 p-6 rounded-xl overflow-auto max-h-96 shadow-lg border border-gray-700/50">
                <pre className="text-sm">
                  {JSON.stringify(resumeData, null, 2)}
                </pre>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(JSON.stringify(resumeData, null, 2))
                  }
                  className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResume('JSON')}
                  className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ATS Analysis Tab */}
        <TabsContent value="optimization" className="space-y-6">
          {resumeData.atsOptimization && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    ATS Optimization Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your resume's ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* ATS Score */}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-2xl font-bold ${getATSColor(
                        resumeData.atsOptimization.atsScore
                      )}`}>
                      <CheckCircle className="h-8 w-8" />
                      {resumeData.atsOptimization.atsScore}/100
                    </div>
                    <p className="text-gray-600 mt-2">
                      Overall ATS Compatibility Score
                    </p>
                  </div>

                  {/* Industry Keywords */}
                  {resumeData.atsOptimization.industryKeywords && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Industry Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.atsOptimization.industryKeywords.map(
                          (keyword: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1">
                              {keyword}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Keyword Density */}
                  {resumeData.atsOptimization.keywordDensity && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Keyword Density
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            Primary Keywords
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.atsOptimization.keywordDensity.primary?.map(
                              (keyword: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="default"
                                  className="text-xs">
                                  {keyword}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            Secondary Keywords
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.atsOptimization.keywordDensity.secondary?.map(
                              (keyword: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs">
                                  {keyword}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {resumeData.atsOptimization.suggestions &&
                    resumeData.atsOptimization.suggestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Optimization Suggestions
                        </h3>
                        <div className="space-y-2">
                          {resumeData.atsOptimization.suggestions.map(
                            (suggestion: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">
                                  {suggestion}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
