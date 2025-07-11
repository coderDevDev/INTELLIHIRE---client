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
  Briefcase
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

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-gray-600">Loading your documents...</p>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletion();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-sm text-gray-600">
              Manage your professional documents and certificates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
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

      <main className="flex-1 overflow-auto">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">
                  Total Documents
                </CardTitle>
                <FileText className="h-5 w-5 text-blue-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{documents.length}</div>
                <p className="text-xs text-blue-200">Uploaded files</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">
                  Required Documents
                </CardTitle>
                <FileCheck className="h-5 w-5 text-green-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-xs text-green-200">PDS & Resume</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">
                  Completion
                </CardTitle>
                <FileUp className="h-5 w-5 text-purple-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {completionPercentage}%
                </div>
                <p className="text-xs text-purple-200">Documents ready</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">
                  Last Updated
                </CardTitle>
                <Calendar className="h-5 w-5 text-orange-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : 'Never'}
                </div>
                <p className="text-xs text-orange-200">Profile documents</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Required Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* PDS Upload */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-brand-blue" />
                        Personal Data Sheet (PDS)
                      </CardTitle>
                      <CardDescription>
                        Upload your completed Personal Data Sheet in PDF format
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
                      onDrop={e => handleDrop(e, 'pds')}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => pdsInputRef.current?.click()}>
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Upload Personal Data Sheet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Drag and drop your PDS PDF here, or click to browse
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
                              ['pds', 'resume'].includes(doc.type)
                          ).length
                        }
                        /2 required
                      </span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {['pds', 'resume'].map(type => {
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
                    <a
                      href="https://lto.gov.ph/wp-content/uploads/2023/11/CS_Form_No._212_Revised-2017_Personal-Data-Sheet.pdf"
                      target="_blank"
                      rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDS Template
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  </Button>
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
    </div>
  );
}
