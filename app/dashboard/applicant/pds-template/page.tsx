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
import {
  FileText,
  FileSpreadsheet,
  Download,
  ExternalLink,
  CheckCircle,
  Info,
  Shield,
  Calendar,
  Globe,
  BookOpen,
  ArrowLeft,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function PdsTemplatePage() {
  const [downloadedPdf, setDownloadedPdf] = useState(false);
  const [downloadedExcel, setDownloadedExcel] = useState(false);

  const handleDownload = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      setDownloadedPdf(true);
    } else {
      setDownloadedExcel(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
        <div
          className="absolute bottom-40 right-1/3 w-64 h-64 bg-green-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                PDS Templates
              </h1>
              <p className="text-sm text-gray-600">
                Download official Personal Data Sheet templates
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
            <Link href="/dashboard/applicant/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8 max-w-5xl mx-auto">
          {/* Info Banner */}
          <Card className="bg-blue-50/80 backdrop-blur-xl border border-blue-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Info className="h-6 w-6 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    About Personal Data Sheet (PDS)
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed mb-3">
                    The Personal Data Sheet (CS Form No. 212) is an official
                    document required for government employment applications in
                    the Philippines. Choose between PDF (fillable) or Excel
                    (editable) format based on your preference.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-600 text-white border-0">
                      Official CSC Form
                    </Badge>
                    <Badge className="bg-green-600 text-white border-0">
                      Government Required
                    </Badge>
                    <Badge className="bg-purple-600 text-white border-0">
                      2 Formats Available
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Templates */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* PDF Version */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  {downloadedPdf && (
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Downloaded
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-semibold">
                  PDF Version
                </CardTitle>
                <CardDescription>
                  Fillable PDF format - CS Form No. 212 Revised 2017
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Fillable PDF form</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Can be filled digitally</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Print-ready format</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Official CSC template</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    <strong>File Type:</strong> PDF (.pdf)
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Version:</strong> Revised 2017
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Source:</strong> Civil Service Commission
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                  asChild
                  onClick={() => handleDownload('pdf')}>
                  <a
                    href="https://lto.gov.ph/wp-content/uploads/2023/11/CS_Form_No._212_Revised-2017_Personal-Data-Sheet.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Template
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Excel Version */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <FileSpreadsheet className="h-7 w-7 text-white" />
                  </div>
                  {downloadedExcel && (
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Downloaded
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-semibold">
                  Excel Version
                </CardTitle>
                <CardDescription>
                  Editable Excel format - CS Form No. 212 Revised 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Fully editable spreadsheet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Latest 2025 revision</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Easy to edit and save</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Convert to PDF after filling</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    <strong>File Type:</strong> Excel (.xlsx)
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Version:</strong> Revised 2025
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Source:</strong> Civil Service Commission
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                  asChild
                  onClick={() => handleDownload('excel')}>
                  <a
                    href="https://csc.gov.ph/downloads/category/540-csc-form-212-revised-2025-personal-data-sheet?download=3404:cs-form-no-212-revised-2025-personal-data-sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    download>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel Template
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Instructions Card */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                How to Fill Out Your PDS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Download Template
                      </h4>
                      <p className="text-sm text-gray-600">
                        Choose between PDF (for quick digital filling) or Excel
                        (for detailed editing).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Fill in All Required Fields
                      </h4>
                      <p className="text-sm text-gray-600">
                        Complete all sections including personal information,
                        family background, education, work experience, and civil
                        service eligibility.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Review and Verify
                      </h4>
                      <p className="text-sm text-gray-600">
                        Double-check all information for accuracy. Ensure dates,
                        addresses, and other details are correct.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Save as PDF
                      </h4>
                      <p className="text-sm text-gray-600">
                        If using Excel, save or export your completed form as a
                        PDF file before uploading.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Upload to InteliHire
                      </h4>
                      <p className="text-sm text-gray-600">
                        Go to Documents page and upload your completed PDS PDF
                        to apply for government jobs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
                      6
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Apply for Jobs
                      </h4>
                      <p className="text-sm text-gray-600">
                        Once uploaded, you can apply for government job
                        positions that require PDS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1 text-sm">
                      Accuracy is Critical
                    </h4>
                    <p className="text-xs text-yellow-800">
                      All information must be accurate and truthful. False
                      information may result in disqualification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileCheck className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                      Supporting Documents
                    </h4>
                    <p className="text-xs text-blue-800">
                      Keep copies of supporting documents (diplomas,
                      certificates, IDs) ready for verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1 text-sm">
                      Update Regularly
                    </h4>
                    <p className="text-xs text-purple-800">
                      Keep your PDS updated with recent work experience,
                      trainings, and certifications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1 text-sm">
                      Digital Signature
                    </h4>
                    <p className="text-xs text-green-800">
                      You may use digital signatures for online applications.
                      Physical signature required for final submission.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Which format should I use - PDF or Excel?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use <strong>Excel</strong> if you want full editing
                    capabilities and plan to make multiple revisions. Use{' '}
                    <strong>PDF</strong> if you prefer quick digital filling
                    with form fields. Both are official and acceptable.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Can I upload the Excel file directly?
                  </h4>
                  <p className="text-sm text-gray-600">
                    No. After completing the Excel form, you must{' '}
                    <strong>save or export it as a PDF</strong>
                    before uploading to InteliHire. This ensures compatibility
                    with the application system.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Is PDS required for all jobs?
                  </h4>
                  <p className="text-sm text-gray-600">
                    PDS is <strong>required for government jobs</strong> only.
                    For private sector positions, you can use your Resume/CV
                    instead. However, having both documents uploaded gives you
                    more job application options.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What if I make a mistake after uploading?
                  </h4>
                  <p className="text-sm text-gray-600">
                    You can delete your uploaded PDS from the Documents page and
                    upload a corrected version. It's recommended to review
                    thoroughly before uploading.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Ready to Upload?
              </CardTitle>
              <CardDescription className="text-blue-100">
                Once you've downloaded and completed your PDS, upload it to
                start applying for government jobs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                  asChild>
                  <Link href="/dashboard/applicant/documents">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your PDS
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  asChild>
                  <Link href="/jobs">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
