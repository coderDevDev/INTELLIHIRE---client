'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { authAPI, userAPI, documentAPI } from '@/lib/api-service';
import { ResumeModal } from '@/components/resume-modal';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  FileUp,
  FileCheck,
  FileX,
  RefreshCw,
  Plus,
  Info,
  Calendar,
  User,
  Building,
  Shield,
  ArrowUpRight,
  ExternalLink,
  Briefcase,
  Users,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Heart,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getFileDownloadUrl = (filePath: string) => {
  if (!filePath) return '#';
  const cleanPath = filePath.replace(/^\/+/, '');
  const baseUrl = API_URL.replace(/\/api$/, '');
  return `${baseUrl}/${cleanPath.replace(/\\/g, '/')}`;
};

const getFileIcon = (fileName: string) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="h-8 w-8 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-8 w-8 text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <FileText className="h-8 w-8 text-green-500" />;
    default:
      return <FileText className="h-8 w-8 text-gray-500" />;
  }
};

const getFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function DocumentsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    document: any | null;
  }>({
    open: false,
    document: null
  });
  const [pdsDataModal, setPdsDataModal] = useState<{
    open: boolean;
    data: any | null;
  }>({
    open: false,
    data: null
  });
  const [resumeModal, setResumeModal] = useState<{
    open: boolean;
    data: any | null;
    metadata: any | null;
  }>({
    open: false,
    data: null,
    metadata: null
  });

  // Debug resume modal state changes
  useEffect(() => {
    console.log('Resume modal state changed:', resumeModal);
  }, [resumeModal]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdsInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      fetchDocumentsData(currentUser);
    }
  }, []);

  const fetchDocumentsData = async (currentUser: any) => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      // Fetch user profile and documents in parallel
      const [profileData, documentsData] = await Promise.all([
        userAPI.getUserById(currentUser.id),
        documentAPI.getMyDocuments()
      ]);

      setProfile(profileData);

      // Create documents array from profile data and uploaded documents
      const docs: any[] = [];

      // Add resume from profile if exists (keeping this for backward compatibility)
      if (profileData.resumeFile) {
        docs.push({
          id: 'resume',
          name: 'Resume/CV',
          type: 'resume',
          fileUrl: profileData.resumeFile,
          uploadedAt: profileData.updatedAt,
          status: 'uploaded',
          required: true,
          source: 'profile'
        });
      }

      // Add documents from documents API (including PDS and other documents)
      if (documentsData && Array.isArray(documentsData)) {
        documentsData.forEach((doc: any) => {
          // Don't duplicate resume if it's already from profile
          if (!(doc.type === 'resume' && docs.find(d => d.type === 'resume'))) {
            docs.push({
              id: doc._id,
              name: doc.title,
              type: doc.type,
              fileUrl: doc.fileUrl,
              uploadedAt: doc.createdAt,
              status: 'uploaded',
              required: ['pds', 'resume'].includes(doc.type),
              source: 'documents'
            });
          }
        });
      }

      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return;

    setUploading(true);
    try {
      if (type === 'pds') {
        await documentAPI.uploadDocument(file, 'pds');
        toast.success('PDS uploaded successfully!');
      } else if (type === 'resume') {
        await documentAPI.uploadDocument(file, 'resume');
        toast.success('Resume uploaded successfully!');
      } else {
        await documentAPI.uploadDocument(file, type);
        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } uploaded successfully!`
        );
      }

      // Refresh documents
      if (user) {
        await fetchDocumentsData(user);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === 'pds' && file.type !== 'application/pdf') {
        toast.error('PDS must be a PDF file');
        return;
      }
      handleFileUpload(file, type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], type);
    }
  };

  const handleDeleteDocument = async () => {
    if (!deleteDialog.document) return;

    try {
      if (deleteDialog.document.source === 'documents') {
        // Delete from documents API
        await documentAPI.deleteDocument(deleteDialog.document.id);
        toast.success('Document deleted successfully');
      } else {
        // For profile documents, we'll just remove from state for now
        // In a real implementation, you'd update the profile to remove the file
        setDocuments(docs =>
          docs.filter(doc => doc.id !== deleteDialog.document.id)
        );
        toast.success('Document removed successfully');
      }

      // Refresh documents
      if (user) {
        await fetchDocumentsData(user);
      }
    } catch (error) {
      toast.error('Failed to remove document');
    } finally {
      setDeleteDialog({ open: false, document: null });
    }
  };

  const getDocumentStatus = (doc: any) => {
    if (doc.status === 'uploaded') {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        label: 'Uploaded',
        color: 'bg-green-100 text-green-700'
      };
    }
    return {
      icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
      label: 'Required',
      color: 'bg-yellow-100 text-yellow-700'
    };
  };

  const calculateCompletion = () => {
    const requiredDocs = ['pds', 'resume'];
    const uploadedDocs = documents.filter(
      doc => doc.status === 'uploaded' && requiredDocs.includes(doc.type)
    ).length;
    return Math.round((uploadedDocs / requiredDocs.length) * 100);
  };

  const handleRegenerateResume = async (industry: string, role: string) => {
    try {
      const pdsDoc = documents.find(
        doc => doc.type === 'pds' && doc.source === 'documents'
      );
      if (pdsDoc) {
        // Generate new resume variant
        const result = await documentAPI.generateResume(
          pdsDoc.id,
          industry,
          role
        );
        setResumeModal({
          open: true,
          data: result.resume,
          metadata: result.metadata
        });
        toast.success(`Resume variant for ${industry} generated successfully!`);
      }
    } catch (error: any) {
      console.error('Error regenerating resume:', error);
      toast.error(
        `Failed to generate resume variant: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  };

  const handleOptimizeForJob = async (jobData: any) => {
    try {
      if (resumeModal.data) {
        const result = await documentAPI.optimizeResumeForJob(
          resumeModal.data,
          jobData.jobDescription || '',
          jobData.jobTitle || '',
          jobData.companyName || ''
        );
        setResumeModal({
          open: true,
          data: result.optimizedResume,
          metadata: result.metadata
        });
        toast.success('Resume optimized for job successfully!');
      }
    } catch (error: any) {
      console.error('Error optimizing resume:', error);
      toast.error(
        `Failed to optimize resume: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
              Loading your documents...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletion();

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
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Documents
              </h1>
              <p className="text-sm text-gray-600">
                Manage your professional documents and certificates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={e => handleFileInputChange(e, 'other')}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
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
                  Total Documents
                </CardTitle>
                <FileText className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {documents.length}
                </div>
                <p className="text-xs text-blue-600">Uploaded files</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Required Documents
                </CardTitle>
                <FileCheck className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">2</div>
                <p className="text-xs text-green-600">PDS & Resume</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Completion
                </CardTitle>
                <FileUp className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {completionPercentage}%
                </div>
                <p className="text-xs text-purple-600">Documents ready</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Last Updated
                </CardTitle>
                <Calendar className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-gray-900">
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : 'Never'}
                </div>
                <p className="text-xs text-orange-600">Profile documents</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Required Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* PDS Upload */}
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Data Sheet (PDS)
                      </CardTitle>
                      <CardDescription>
                        Upload your completed Personal Data Sheet in PDF format
                      </CardDescription>
                    </div>
                    {/* <Badge
                      variant="secondary"
                      className="bg-yellow-100/80 text-yellow-700 border-yellow-200/50">
                      Required
                    </Badge> */}
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.find(doc => doc.type === 'pds') ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">
                              PDS Uploaded
                            </p>
                            <p className="text-sm text-green-700">
                              Uploaded on{' '}
                              {new Date(
                                documents.find(
                                  doc => doc.type === 'pds'
                                )?.uploadedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" asChild>
                                  <a
                                    href={getFileDownloadUrl(
                                      documents.find(doc => doc.type === 'pds')
                                        ?.fileUrl
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download PDS</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                document: documents.find(
                                  doc => doc.type === 'pds'
                                )
                              })
                            }
                            className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const pdsDoc = documents.find(
                                  doc => doc.type === 'pds'
                                );
                                if (pdsDoc) {
                                  console.log('PDS Document found:', pdsDoc);
                                  console.log('Document ID:', pdsDoc.id);
                                  console.log(
                                    'Document source:',
                                    pdsDoc.source
                                  );

                                  // Check if this is a documents API document or profile document
                                  if (pdsDoc.source === 'documents') {
                                    toast.info('Loading resume...');

                                    try {
                                      // First try to get existing saved resume
                                      const savedResume =
                                        await documentAPI.getSavedResume(
                                          pdsDoc.id
                                        );
                                      console.log(
                                        'Found saved resume:',
                                        savedResume
                                      );
                                      console.log('Resume data structure:', {
                                        hasResume: !!savedResume.resume,
                                        hasMetadata: !!savedResume.metadata,
                                        resumeKeys: savedResume.resume
                                          ? Object.keys(savedResume.resume)
                                          : [],
                                        metadataKeys: savedResume.metadata
                                          ? Object.keys(savedResume.metadata)
                                          : []
                                      });

                                      // Open resume modal with saved data
                                      console.log(
                                        'Setting resume modal state...'
                                      );
                                      setResumeModal({
                                        open: true,
                                        data: savedResume.resume,
                                        metadata: savedResume.metadata
                                      });
                                      console.log('Resume modal state set:', {
                                        open: true,
                                        data: !!savedResume.resume,
                                        metadata: !!savedResume.metadata
                                      });

                                      toast.success(
                                        'Resume loaded successfully!'
                                      );
                                    } catch (savedResumeError: any) {
                                      // If no saved resume found, generate a new one
                                      if (
                                        savedResumeError.response?.status ===
                                        404
                                      ) {
                                        console.log(
                                          'No saved resume found, generating new one...'
                                        );
                                        toast.info(
                                          'Generating resume from PDS data...'
                                        );

                                        const result =
                                          await documentAPI.generateResume(
                                            pdsDoc.id,
                                            'General',
                                            'Professional'
                                          );
                                        console.log(
                                          'Generated resume:',
                                          result
                                        );

                                        // Open resume modal with generated data
                                        console.log(
                                          'Setting resume modal state for generated resume...'
                                        );
                                        setResumeModal({
                                          open: true,
                                          data: result.resume,
                                          metadata: result.metadata
                                        });
                                        console.log(
                                          'Generated resume modal state set:',
                                          {
                                            open: true,
                                            data: !!result.resume,
                                            metadata: !!result.metadata
                                          }
                                        );

                                        toast.success(
                                          'Resume generated successfully!'
                                        );
                                      } else {
                                        throw savedResumeError;
                                      }
                                    }
                                  } else {
                                    toast.error(
                                      'Please upload PDS through the documents system first'
                                    );
                                  }
                                } else {
                                  toast.error('No PDS document found');
                                }
                              } catch (error: any) {
                                console.error(
                                  'Error loading/generating resume:',
                                  error
                                );
                                console.error(
                                  'Error details:',
                                  error.response?.data
                                );
                                toast.error(
                                  `Failed to load resume: ${
                                    error.response?.data?.message ||
                                    error.message
                                  }`
                                );
                              }
                            }}
                            className="text-blue-500 hover:text-blue-700">
                            <FileUp className="h-4 w-4 mr-2" />
                            View 
                          </Button>
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const debugInfo =
                                  await documentAPI.getPdsDataDebug();
                                console.log('PDS Debug Info:', debugInfo);

                                if (debugInfo.totalEntries > 1) {
                                  // Offer cleanup options
                                  const cleanupOption = confirm(
                                    `Found ${debugInfo.totalEntries} PDS data entries.\n\n` +
                                      `Choose cleanup option:\n` +
                                      `- Click OK: Keep one entry per document (current behavior)\n` +
                                      `- Click Cancel: Keep only the single most recent entry`
                                  );

                                  if (cleanupOption !== null) {
                                    // User made a choice
                                    const keepOnePerDocument = cleanupOption; // true for OK, false for Cancel
                                    const cleanupResult =
                                      await documentAPI.cleanupPdsData(
                                        keepOnePerDocument
                                      );

                                    console.log(
                                      'Cleanup result:',
                                      cleanupResult
                                    );

                                    const mode = keepOnePerDocument
                                      ? 'one per document'
                                      : 'single most recent';
                                    toast.success(
                                      `Cleanup completed! Mode: ${mode}. Removed ${cleanupResult.removedEntries} entries.`
                                    );

                                    // Refresh documents to get updated state
                                    if (user) {
                                      await fetchDocumentsData(user);
                                    }
                                  }
                                } else {
                                  toast.info(
                                    `Found ${debugInfo.totalEntries} PDS data entry(ies)`
                                  );
                                }
                              } catch (error: any) {
                                console.error(
                                  'Error getting debug info:',
                                  error
                                );
                                toast.error('Failed to get debug info');
                              }
                            }}
                            className="text-orange-500 hover:text-orange-700">
                            <Info className="h-4 w-4 mr-2" />
                            Debug
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                        isDragging
                          ? 'border-blue-400 bg-blue-50/80 shadow-lg scale-105'
                          : 'border-white/50 bg-white/40 hover:border-blue-300 hover:bg-white/60 hover:shadow-md'
                      }`}
                      onDrop={e => handleDrop(e, 'pds')}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => pdsInputRef.current?.click()}>
                      <div className="relative">
                        <FileText
                          className={`h-16 w-16 mx-auto mb-4 transition-all duration-300 ${
                            isDragging
                              ? 'text-blue-600 scale-110'
                              : 'text-gray-400'
                          }`}
                        />
                        {isDragging && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {isDragging
                          ? 'Drop your PDS here!'
                          : 'Upload Personal Data Sheet'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {isDragging
                          ? 'Release to upload your PDF file'
                          : 'Drag and drop your PDS PDF here, or click to browse'}
                      </p>
                      <Button
                        variant="outline"
                        disabled={uploading}
                        className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                        {uploading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </Button>
                      <input
                        type="file"
                        ref={pdsInputRef}
                        className="hidden"
                        onChange={e => handleFileInputChange(e, 'pds')}
                        accept=".pdf"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-brand-blue" />
                        Resume/CV
                      </CardTitle>
                      <CardDescription>
                        Upload your professional resume or curriculum vitae
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-700">
                      Required
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.find(doc => doc.type === 'resume') ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">
                              Resume Uploaded
                            </p>
                            <p className="text-sm text-green-700">
                              Uploaded on{' '}
                              {new Date(
                                documents.find(
                                  doc => doc.type === 'resume'
                                )?.uploadedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" asChild>
                                  <a
                                    href={getFileDownloadUrl(
                                      documents.find(
                                        doc => doc.type === 'resume'
                                      )?.fileUrl
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download Resume</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                document: documents.find(
                                  doc => doc.type === 'resume'
                                )
                              })
                            }
                            className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const resumeDoc = documents.find(
                                  doc => doc.type === 'resume'
                                );
                                if (resumeDoc) {
                                  console.log(
                                    'Resume Document found:',
                                    resumeDoc
                                  );
                                  console.log('Document ID:', resumeDoc.id);
                                  console.log(
                                    'Document source:',
                                    resumeDoc.source
                                  );

                                  // Check if this is a documents API document
                                  if (resumeDoc.source === 'documents') {
                                    toast.info(
                                      'Loading ATS-compliant resume...'
                                    );

                                    try {
                                      // Try to get existing saved resume
                                      const savedResume =
                                        await documentAPI.getSavedResume(
                                          resumeDoc.id
                                        );
                                      console.log(
                                        'Found saved resume:',
                                        savedResume
                                      );
                                      console.log('Resume data structure:', {
                                        hasResume: !!savedResume.resume,
                                        hasMetadata: !!savedResume.metadata,
                                        resumeKeys: savedResume.resume
                                          ? Object.keys(savedResume.resume)
                                          : [],
                                        metadataKeys: savedResume.metadata
                                          ? Object.keys(savedResume.metadata)
                                          : []
                                      });

                                      // Open resume modal with saved data
                                      console.log(
                                        'Setting resume modal state...'
                                      );
                                      setResumeModal({
                                        open: true,
                                        data: savedResume.resume,
                                        metadata: savedResume.metadata
                                      });
                                      console.log('Resume modal state set:', {
                                        open: true,
                                        data: !!savedResume.resume,
                                        metadata: !!savedResume.metadata
                                      });

                                      toast.success(
                                        'PDS loaded successfully!'
                                      );
                                    } catch (savedResumeError: any) {
                                      // If no saved resume found, it might still be processing
                                      if (
                                        savedResumeError.response?.status ===
                                        404
                                      ) {
                                        console.log(
                                          'No saved resume found yet. Resume might still be processing...'
                                        );
                                        toast.info(
                                          'Resume is still being processed by AI. Please wait a moment and try again.',
                                          { duration: 5000 }
                                        );
                                      } else {
                                        throw savedResumeError;
                                      }
                                    }
                                  } else {
                                    toast.error(
                                      'Please upload resume through the documents system first'
                                    );
                                  }
                                } else {
                                  toast.error('No resume document found');
                                }
                              } catch (error: any) {
                                console.error(
                                  'Error loading/viewing resume:',
                                  error
                                );
                                console.error(
                                  'Error details:',
                                  error.response?.data
                                );
                                toast.error(
                                  `Failed to load ATS-compliant resume: ${
                                    error.response?.data?.message ||
                                    error.message
                                  }`
                                );
                              }
                            }}
                            className="text-blue-500 hover:text-blue-700">
                            <FileUp className="h-4 w-4 mr-2" />
                            View ATS Resume
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-brand-blue bg-blue-50'
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                      }`}
                      onDrop={e => handleDrop(e, 'resume')}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => resumeInputRef.current?.click()}>
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Upload Resume/CV
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Drag and drop your resume here, or click to browse
                      </p>
                      <Button variant="outline" disabled={uploading}>
                        {uploading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </Button>
                      <input
                        type="file"
                        ref={resumeInputRef}
                        className="hidden"
                        onChange={e => handleFileInputChange(e, 'resume')}
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other Documents */}
              {documents.filter(doc => !['pds', 'resume'].includes(doc.type))
                .length > 0 && (
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-brand-blue" />
                      Other Documents
                    </CardTitle>
                    <CardDescription>
                      Additional documents you've uploaded
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documents
                        .filter(doc => !['pds', 'resume'].includes(doc.type))
                        .map(doc => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.name)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Uploaded{' '}
                                  {new Date(
                                    doc.uploadedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" asChild>
                                      <a
                                        href={getFileDownloadUrl(doc.fileUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download>
                                        <Download className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Download Document
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    document: doc
                                  })
                                }
                                className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Document Progress */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Document Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {completionPercentage}% Complete
                      </span>
                      <span className="text-sm text-gray-500">
                        {
                          documents.filter(
                            doc =>
                              doc.status === 'uploaded' &&
                              ['resume'].includes(doc.type)
                          ).length
                        }
                        /1 required
                      </span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {['resume'].map(type => {
                      const doc = documents.find(d => d.type === type);
                      const status = getDocumentStatus(
                        doc || { type, status: 'required' }
                      );
                      return (
                        <div
                          key={type}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                          {status.icon}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {type === 'pds'
                                ? 'Personal Data Sheet'
                                : 'Resume/CV'}
                            </p>
                            <p
                              className={`text-xs ${
                                doc ? 'text-green-700' : 'text-yellow-700'
                              }`}>
                              {status.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Document Guidelines */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-brand-blue" />
                    Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          PDS Requirements
                        </p>
                        <p className="text-xs text-gray-600">
                          Must be in PDF format, completed and signed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Resume Format
                        </p>
                        <p className="text-xs text-gray-600">
                          PDF, DOC, or DOCX format preferred
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          File Size
                        </p>
                        <p className="text-xs text-gray-600">
                          Maximum 5MB per document
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PDS Templates */}
              <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      PDS Templates
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/applicant/pds-template">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Download official CSC Form 212
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* PDF Template */}
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-red-50 border-red-200 hover:bg-red-100 text-gray-900"
                    asChild>
                    <a
                      href="https://lto.gov.ph/wp-content/uploads/2023/11/CS_Form_No._212_Revised-2017_Personal-Data-Sheet.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      download>
                      <FileText className="h-4 w-4 mr-2 text-red-600" />
                      PDF Template (2017)
                      <Download className="h-4 w-4 ml-auto" />
                    </a>
                  </Button>

                  {/* Excel Template */}
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-green-50 border-green-200 hover:bg-green-100 text-gray-900"
                    asChild>
                    <a
                      href="https://csc.gov.ph/downloads/category/540-csc-form-212-revised-2025-personal-data-sheet?download=3404:cs-form-no-212-revised-2025-personal-data-sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      download>
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                      Excel Template (2025)
                      <Download className="h-4 w-4 ml-auto" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild>
                    <Link href="/dashboard/applicant/profile">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild>
                    <Link href="/jobs">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild>
                    <Link href="/dashboard/applicant/pds-template">
                      <FileText className="h-4 w-4 mr-2" />
                      View PDS Templates
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={open =>
          setDeleteDialog({ open, document: deleteDialog.document })
        }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{deleteDialog.document?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDS Data Modal */}
      <AlertDialog
        open={pdsDataModal.open}
        onOpenChange={open =>
          setPdsDataModal({ open, data: pdsDataModal.data })
        }>
        <AlertDialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>Personal Data Sheet (PDS)</AlertDialogTitle>
            <AlertDialogDescription>
              Extracted data from your uploaded PDS document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {pdsDataModal.data ? (
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                {pdsDataModal.data.personalInformation && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-brand-blue" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Name:</span>{' '}
                          {pdsDataModal.data.personalInformation.firstName ||
                            ''}{' '}
                          {pdsDataModal.data.personalInformation.middleName ||
                            ''}{' '}
                          {/* Handle both surname and lastName */}
                          {pdsDataModal.data.personalInformation.surname ||
                            pdsDataModal.data.personalInformation.lastName ||
                            ''}
                        </p>
                        <p>
                          <span className="font-medium">Birth Date:</span>{' '}
                          {pdsDataModal.data.personalInformation.dateOfBirth ||
                            ''}
                        </p>
                        <p>
                          <span className="font-medium">Place of Birth:</span>{' '}
                          {pdsDataModal.data.personalInformation.placeOfBirth ||
                            ''}
                        </p>
                        <p>
                          <span className="font-medium">Gender:</span>{' '}
                          {pdsDataModal.data.personalInformation.sex || ''}
                        </p>
                        <p>
                          <span className="font-medium">Civil Status:</span>{' '}
                          {pdsDataModal.data.personalInformation.civilStatus ||
                            ''}
                        </p>
                        <p>
                          <span className="font-medium">Citizenship:</span>{' '}
                          {pdsDataModal.data.personalInformation.citizenship
                            ?.type ||
                            pdsDataModal.data.personalInformation.citizenship ||
                            ''}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Height:</span>{' '}
                          {pdsDataModal.data.personalInformation.heightCm || ''}
                        </p>
                        <p>
                          <span className="font-medium">Weight:</span>{' '}
                          {pdsDataModal.data.personalInformation.weightKg || ''}
                        </p>
                        <p>
                          <span className="font-medium">Blood Type:</span>{' '}
                          {pdsDataModal.data.personalInformation.bloodType ||
                            'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{' '}
                          {/* Handle both direct field and nested contactInformation */}
                          {pdsDataModal.data.personalInformation.emailAddress ||
                            pdsDataModal.data.personalInformation
                              .contactInformation?.emailAddress ||
                            'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Mobile:</span>{' '}
                          {pdsDataModal.data.personalInformation.mobileNo ||
                            pdsDataModal.data.personalInformation
                              .contactInformation?.mobileNo ||
                            'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Telephone:</span>{' '}
                          {pdsDataModal.data.personalInformation.telephoneNo ||
                            pdsDataModal.data.personalInformation
                              .contactInformation?.telephoneNo ||
                            'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Address Information */}
                    {pdsDataModal.data.personalInformation
                      .residentialAddress && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Address Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Residential Address:
                            </p>
                            <p className="text-sm">
                              {/* Handle both houseBlockLotNo and houseLotBlockNo */}
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.houseBlockLotNo ||
                                pdsDataModal.data.personalInformation
                                  .residentialAddress?.houseLotBlockNo ||
                                ''}{' '}
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.street || ''}
                            </p>
                            <p className="text-sm">
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.subdivisionVillage ||
                                ''}{' '}
                              {/* Handle both barangay and barangayDistrict */}
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.barangay ||
                                pdsDataModal.data.personalInformation
                                  .residentialAddress?.barangayDistrict ||
                                ''}
                            </p>
                            <p className="text-sm">
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.cityMunicipality || ''}
                              ,{' '}
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.province || ''}{' '}
                              {pdsDataModal.data.personalInformation
                                .residentialAddress?.zipCode || ''}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Permanent Address:
                            </p>
                            <p className="text-sm">
                              {/* Handle both houseBlockLotNo and houseLotBlockNo */}
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.houseBlockLotNo ||
                                pdsDataModal.data.personalInformation
                                  .permanentAddress?.houseLotBlockNo ||
                                ''}{' '}
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.street || ''}
                            </p>
                            <p className="text-sm">
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.subdivisionVillage ||
                                ''}{' '}
                              {/* Handle both barangay and barangayDistrict */}
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.barangay ||
                                pdsDataModal.data.personalInformation
                                  .permanentAddress?.barangayDistrict ||
                                ''}
                            </p>
                            <p className="text-sm">
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.cityMunicipality || ''}
                              ,{' '}
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.province || ''}{' '}
                              {pdsDataModal.data.personalInformation
                                .permanentAddress?.zipCode || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Personal Information */}
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">GSIS ID:</span>{' '}
                            {/* Handle both direct field and nested identificationNumbers */}
                            {pdsDataModal.data.personalInformation.gsisIdNo ||
                              pdsDataModal.data.personalInformation
                                .identificationNumbers?.gsisIdNo ||
                              'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">PAG-IBIG ID:</span>{' '}
                            {pdsDataModal.data.personalInformation
                              .pagIbigIdNo ||
                              pdsDataModal.data.personalInformation
                                .identificationNumbers?.pagIbigIdNo ||
                              'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">PhilHealth No:</span>{' '}
                            {/* Handle both philhealthNo and philHealthNo */}
                            {pdsDataModal.data.personalInformation
                              .philhealthNo ||
                              pdsDataModal.data.personalInformation
                                .philHealthNo ||
                              pdsDataModal.data.personalInformation
                                .identificationNumbers?.philHealthNo ||
                              'N/A'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">SSS No:</span>{' '}
                            {pdsDataModal.data.personalInformation.sssNo ||
                              pdsDataModal.data.personalInformation
                                .identificationNumbers?.sssNo ||
                              'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">TIN:</span>{' '}
                            {pdsDataModal.data.personalInformation.tin ||
                              pdsDataModal.data.personalInformation
                                .identificationNumbers?.tinNo ||
                              'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">
                              Agency Employee No:
                            </span>{' '}
                            {pdsDataModal.data.personalInformation
                              .agencyEmployeeNo ||
                              pdsDataModal.data.personalInformation
                                .identificationNumbers?.agencyEmployeeNo ||
                              'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Family Background */}
                {pdsDataModal.data.familyBackground && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-brand-blue" />
                      Family Background
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Father:</span>{' '}
                          {pdsDataModal.data.familyBackground.father
                            ?.firstName || ''}{' '}
                          {pdsDataModal.data.familyBackground.father
                            ?.middleName || ''}{' '}
                          {pdsDataModal.data.familyBackground.father?.surname ||
                            ''}
                        </p>
                        <p>
                          <span className="font-medium">Mother:</span>{' '}
                          {pdsDataModal.data.familyBackground.motherMaidenName
                            ?.firstName || ''}{' '}
                          {pdsDataModal.data.familyBackground.motherMaidenName
                            ?.middleName || ''}{' '}
                          {pdsDataModal.data.familyBackground.motherMaidenName
                            ?.surname || ''}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Spouse:</span>{' '}
                          {pdsDataModal.data.familyBackground.spouse
                            ?.firstName || ''}{' '}
                          {pdsDataModal.data.familyBackground.spouse
                            ?.middleName || ''}{' '}
                          {/* Handle both surname and lastName */}
                          {pdsDataModal.data.familyBackground.spouse?.surname ||
                            pdsDataModal.data.familyBackground.spouse
                              ?.lastName ||
                            ''}
                        </p>
                        <p>
                          <span className="font-medium">Occupation:</span>{' '}
                          {pdsDataModal.data.familyBackground.spouse
                            ?.occupation || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Children:</span>{' '}
                          {pdsDataModal.data.familyBackground.children
                            ?.length || 0}{' '}
                          child(ren)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Education */}
                {pdsDataModal.data.educationalBackground &&
                  pdsDataModal.data.educationalBackground.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-brand-blue" />
                        Educational Background
                      </h3>
                      <div className="space-y-3">
                        {pdsDataModal.data.educationalBackground.map(
                          (edu: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {edu.level || ''}
                                  </p>
                                  <p className="text-gray-700">
                                    {edu.nameOfSchool || ''}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {edu.basicEducationDegreeCourse || ''}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">Period:</span>{' '}
                                    {edu.periodOfAttendance?.from || ''} -{' '}
                                    {edu.periodOfAttendance?.to || ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Year Graduated:
                                    </span>{' '}
                                    {edu.yearGraduated || ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Honors:</span>{' '}
                                    {edu.scholarshipAcademicHonorsReceived ||
                                      'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* Civil Service */}
                {pdsDataModal.data.civilServiceEligibility &&
                  pdsDataModal.data.civilServiceEligibility.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-blue" />
                        Civil Service Eligibility
                      </h3>
                      <div className="space-y-3">
                        {pdsDataModal.data.civilServiceEligibility.map(
                          (cs: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {/* Handle both eligibility and careerServiceOrEligibility */}
                                    {cs.eligibility ||
                                      cs.careerServiceOrEligibility ||
                                      ''}
                                  </p>
                                  <p className="text-gray-700">
                                    Rating: {cs.rating || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">Date:</span>{' '}
                                    {/* Handle both field names */}
                                    {cs.dateOfExaminationConferment ||
                                      cs.dateOfExaminationOrConferment ||
                                      ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Place:</span>{' '}
                                    {cs.placeOfExaminationConferment ||
                                      cs.placeOfExaminationOrConferment ||
                                      ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      License:
                                    </span>{' '}
                                    {/* Handle both license structures */}
                                    {cs.license?.number ||
                                      cs.licenseNumber ||
                                      'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* Work Experience */}
                {pdsDataModal.data.workExperience &&
                  pdsDataModal.data.workExperience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-brand-blue" />
                        Work Experience
                      </h3>
                      <div className="space-y-3">
                        {pdsDataModal.data.workExperience.map(
                          (work: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {work.positionTitle || ''}
                                  </p>
                                  <p className="text-gray-700">
                                    {work.departmentAgencyOfficeCompany || ''}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {work.statusOfAppointment || ''}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">Period:</span>{' '}
                                    {work.from || ''} - {work.to || ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Salary:</span>{' '}
                                    ₱
                                    {/* Handle both direct salary and nested salary.amount */}
                                    {work.monthlySalary
                                      ? (typeof work.monthlySalary === 'object'
                                          ? work.monthlySalary.amount
                                          : work.monthlySalary
                                        ).toLocaleString()
                                      : 'N/A'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Salary Grade:
                                    </span>{' '}
                                    {/* Handle both field names */}
                                    {work.salaryGradeStep ||
                                      work.salaryJobPayGradeStep ||
                                      ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Government Service:
                                    </span>{' '}
                                    {work.governmentService ? 'Yes' : 'No'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* Voluntary Work */}
                {pdsDataModal.data.voluntaryWork &&
                  pdsDataModal.data.voluntaryWork.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-brand-blue" />
                        Voluntary Work
                      </h3>
                      <div className="space-y-3">
                        {pdsDataModal.data.voluntaryWork.map(
                          (vol: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {/* Handle both nameAndAddress and organization */}
                                    {vol.nameAndAddress ||
                                      vol.organization ||
                                      ''}
                                  </p>
                                  <p className="text-gray-700">
                                    {vol.positionNatureOfWork || ''}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">Period:</span>{' '}
                                    {/* Handle both inclusiveDates and from/to */}
                                    {vol.inclusiveDates?.from || vol.from || ''}{' '}
                                    -{' '}
                                    {vol.inclusiveDates?.to ||
                                      vol.inclusiveDates?.toStatus ||
                                      vol.to ||
                                      ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Hours:</span>{' '}
                                    {vol.numberOfHours ||
                                      vol.numberOfHoursPerYear ||
                                      ''}{' '}
                                    {vol.hoursUnit ||
                                      vol.numberOfHoursDetail ||
                                      ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* Training */}
                {pdsDataModal.data.trainings &&
                  pdsDataModal.data.trainings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-brand-blue" />
                        Learning and Development
                      </h3>
                      <div className="space-y-3">
                        {pdsDataModal.data.trainings.map(
                          (train: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {train.title || ''}
                                  </p>
                                  <p className="text-gray-700">
                                    Type: {train.typeOfLd || ''}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {train.conductedSponsoredBy || ''}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">Period:</span>{' '}
                                    {/* Handle both inclusiveDates and from/to */}
                                    {train.inclusiveDates?.from ||
                                      train.from ||
                                      ''}{' '}
                                    -{' '}
                                    {train.inclusiveDates?.to || train.to || ''}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Hours:</span>{' '}
                                    {train.numberOfHours || ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* References */}
                {pdsDataModal.data.references &&
                  pdsDataModal.data.references.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                        <Users className="h-5 w-5 text-brand-blue" />
                        References
                      </h3>
                      <div className="space-y-3">
                        {pdsDataModal.data.references.map(
                          (ref: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {ref.name || 'N/A'}
                                  </p>
                                  <p className="text-gray-700">
                                    {ref.address || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Contact:
                                    </span>{' '}
                                    {ref.contactNumber || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* Skills, Recognitions, Memberships */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <Target className="h-5 w-5 text-brand-blue" />
                      Skills & Hobbies
                    </h3>
                    <div className="space-y-2">
                      {/* Handle both direct skills array and nested otherInformation */}
                      {(pdsDataModal.data.skills &&
                        pdsDataModal.data.skills.length > 0) ||
                      (pdsDataModal.data.otherInformation
                        ?.specialSkillsAndHobbies &&
                        pdsDataModal.data.otherInformation
                          .specialSkillsAndHobbies.length > 0) ? (
                        (
                          pdsDataModal.data.skills ||
                          pdsDataModal.data.otherInformation
                            ?.specialSkillsAndHobbies ||
                          []
                        ).map((skill: string, index: number) => (
                          <p
                            key={index}
                            className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No skills listed
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <Award className="h-5 w-5 text-brand-blue" />
                      Recognitions
                    </h3>
                    <div className="space-y-2">
                      {/* Handle both direct recognitions array and nested otherInformation */}
                      {(pdsDataModal.data.recognitions &&
                        pdsDataModal.data.recognitions.length > 0) ||
                      (pdsDataModal.data.otherInformation
                        ?.nonAcademicDistinctionsRecognition &&
                        pdsDataModal.data.otherInformation
                          .nonAcademicDistinctionsRecognition.length > 0) ? (
                        (
                          pdsDataModal.data.recognitions ||
                          pdsDataModal.data.otherInformation
                            ?.nonAcademicDistinctionsRecognition ||
                          []
                        ).map((rec: string, index: number) => (
                          <p
                            key={index}
                            className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {rec}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No recognitions listed
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <Building className="h-5 w-5 text-brand-blue" />
                      Memberships
                    </h3>
                    <div className="space-y-2">
                      {/* Handle both direct memberships array and nested otherInformation */}
                      {(pdsDataModal.data.memberships &&
                        pdsDataModal.data.memberships.length > 0) ||
                      (pdsDataModal.data.otherInformation?.memberships &&
                        pdsDataModal.data.otherInformation.memberships.length >
                          0) ? (
                        (
                          pdsDataModal.data.memberships ||
                          pdsDataModal.data.otherInformation?.memberships ||
                          []
                        ).map((mem: string, index: number) => (
                          <p
                            key={index}
                            className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {mem}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No memberships listed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600">No PDS data available.</p>
              </div>
            )}
          </CardContent>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPdsDataModal({ open: false, data: null })}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Modal */}
      <div className="relative z-[9999]">
        <ResumeModal
          isOpen={resumeModal.open}
          onClose={() =>
            setResumeModal({ open: false, data: null, metadata: null })
          }
          resumeData={resumeModal.data}
          metadata={resumeModal.metadata}
          onRegenerate={handleRegenerateResume}
          onOptimizeForJob={handleOptimizeForJob}
        />
      </div>
    </div>
  );
}
