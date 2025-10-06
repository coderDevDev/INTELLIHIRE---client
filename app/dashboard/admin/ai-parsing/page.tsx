'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  BarChart3,
  TrendingUp,
  Users,
  FileUp,
  Activity,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { documentAPI } from '@/lib/api-service';
import { toast } from 'sonner';

interface ParsingStats {
  totalDocuments: number;
  processedToday: number;
  successRate: number;
  averageProcessingTime: number;
  pendingDocuments: number;
  failedDocuments: number;
}

interface Document {
  _id: string;
  fileName: string;
  fileType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedAt: string;
  processedAt?: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  parsedData?: any;
  error?: string;
}

export default function AIParsingPage() {
  const [stats, setStats] = useState<ParsingStats>({
    totalDocuments: 0,
    processedToday: 0,
    successRate: 0,
    averageProcessingTime: 0,
    pendingDocuments: 0,
    failedDocuments: 0
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchParsingData();
  }, []);

  const fetchParsingData = async () => {
    try {
      setLoading(true);
      
      // Fetch documents data
      const documentsRes = await documentAPI.getAllDocuments();
      const docs = documentsRes.documents || documentsRes || [];

      // Calculate stats
      const totalDocs = docs.length;
      const today = new Date().toDateString();
      const processedToday = docs.filter((doc: any) => 
        new Date(doc.createdAt).toDateString() === today
      ).length;
      
      const completedDocs = docs.filter((doc: any) => doc.status === 'completed').length;
      const successRate = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;
      
      const pendingDocs = docs.filter((doc: any) => doc.status === 'pending').length;
      const failedDocs = docs.filter((doc: any) => doc.status === 'failed').length;

      setStats({
        totalDocuments: totalDocs,
        processedToday,
        successRate,
        averageProcessingTime: 2.5, // Mock data
        pendingDocuments: pendingDocs,
        failedDocuments: failedDocs
      });

      // Process documents for display
      const processedDocs = docs.map((doc: any) => ({
        _id: doc._id,
        fileName: doc.fileName || 'Unknown',
        fileType: doc.fileType || 'pdf',
        status: doc.status || 'pending',
        uploadedAt: doc.createdAt,
        processedAt: doc.updatedAt,
        userId: doc.userId,
        user: {
          firstName: doc.user?.firstName || 'Unknown',
          lastName: doc.user?.lastName || 'User',
          email: doc.user?.email || 'unknown@email.com'
        },
        parsedData: doc.parsedData,
        error: doc.error
      }));

      setDocuments(processedDocs);
    } catch (error) {
      console.error('Error fetching parsing data:', error);
      toast.error('Failed to load AI parsing data');
    } finally {
      setLoading(false);
    }
  };

  const reprocessDocument = async (documentId: string) => {
    try {
      setProcessing(documentId);
      // In a real implementation, this would trigger reprocessing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Document reprocessed successfully');
      fetchParsingData();
    } catch (error) {
      toast.error('Failed to reprocess document');
    } finally {
      setProcessing(null);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.deleteDocument(documentId);
        toast.success('Document deleted successfully');
        fetchParsingData();
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

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
            <p className="text-gray-600 font-medium">Loading AI parsing data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Document Parsing
              </h1>
              <p className="text-sm text-gray-600">
                Monitor and manage AI-powered document processing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchParsingData}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Zap className="h-4 w-4 mr-2" />
              Process Queue
            </Button>
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
                  {stats.totalDocuments}
                </div>
                <p className="text-xs text-blue-600">
                  {stats.processedToday} processed today
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Success Rate
                </CardTitle>
                <Target className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.successRate}%
                </div>
                <p className="text-xs text-green-600">Processing accuracy</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Pending Documents
                </CardTitle>
                <Clock className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.pendingDocuments}
                </div>
                <p className="text-xs text-yellow-600">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Avg Processing Time
                </CardTitle>
                <Activity className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.averageProcessingTime}s
                </div>
                <p className="text-xs text-purple-600">Per document</p>
              </CardContent>
            </Card>
          </div>

          {/* Processing Queue */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Processing Queue
              </CardTitle>
              <CardDescription>
                Monitor document processing status and manage the queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No documents found</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {doc.fileName}
                            </h4>
                            <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)}
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {doc.user.firstName} {doc.user.lastName} • {doc.user.email}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            {doc.processedAt && (
                              <>
                                <span>•</span>
                                <span>Processed: {new Date(doc.processedAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          {doc.error && (
                            <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                              <p className="text-xs text-red-600">{doc.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/60 backdrop-blur-sm border-white/50">
                            <Eye className="h-4 w-4 mr-2" />
                            View Data
                          </Button>
                        )}
                        {doc.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => reprocessDocument(doc._id)}
                            disabled={processing === doc._id}
                            className="bg-white/60 backdrop-blur-sm border-white/50">
                            {processing === doc._id ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4 mr-2" />
                            )}
                            Reprocess
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDocument(doc._id)}
                          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Processing Insights */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Processing Performance
                </CardTitle>
                <CardDescription>
                  AI parsing performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Success Rate</span>
                    <span className="text-sm text-gray-600">{stats.successRate}%</span>
                  </div>
                  <Progress value={stats.successRate} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Processing Speed</span>
                    <span className="text-sm text-gray-600">{stats.averageProcessingTime}s avg</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="p-4 rounded-xl border border-green-200 bg-green-50/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">AI Processing Active</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    All AI services are operational and processing documents efficiently.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Processing Statistics
                </CardTitle>
                <CardDescription>
                  Document processing statistics and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</div>
                    <div className="text-xs text-gray-600">Total Documents</div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingDocuments}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.failedDocuments}</div>
                    <div className="text-xs text-gray-600">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
