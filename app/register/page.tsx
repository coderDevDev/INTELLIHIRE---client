import { RegisterForm } from '@/components/register-form';
import { MainHeader } from '@/components/main-header';
import { ModernFooter } from '@/components/modern-footer';
import { User, Shield, CheckCircle, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
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

        <div className="container relative mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 z-10">
          <div className="max-w-lg mx-auto relative z-20">
            {/* Header Section */}

            {/* Features Preview */}

            <RegisterForm />
          </div>
        </div>
      </main>
      <ModernFooter />
    </div>
  );
}
