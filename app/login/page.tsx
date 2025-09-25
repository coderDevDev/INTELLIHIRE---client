import { LoginForm } from '@/components/login-form';
import { MainHeader } from '@/components/main-header';
import { ModernFooter } from '@/components/modern-footer';
import { Briefcase, Sparkles, Shield, User } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <MainHeader /> */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
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

        <div className="container relative mx-auto px-4 py-16 md:py-24 z-10">
          <div className="max-w-md mx-auto relative z-20">
            {/* Header Section */}
            <div className="text-center mb-8">
              {/* <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-blue-200 mb-6">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Welcome Back to InteliHire
              </div> */}

              {/* <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Sign In to Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Account
                </span>
              </h1> */}

              {/* <p className="text-gray-600 text-lg">
                Access your personalized dashboard and continue your job search
                journey
              </p> */}
            </div>

            {/* Features Preview */}
            {/* <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                <Briefcase className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">
                  Job Matching
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">
                  Secure Access
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                <User className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">
                  Personal Dashboard
                </p>
              </div>
            </div> */}

            <LoginForm />

            {/* Test Links Component */}
          </div>
        </div>
      </main>
      <ModernFooter />
    </div>
  );
}
