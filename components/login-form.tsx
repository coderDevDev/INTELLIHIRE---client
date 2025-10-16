'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authAPI } from '@/lib/api-service';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  loginSchema,
  type LoginFormData
} from '@/lib/validations/authValidation';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange' // Real-time validation
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      console.log('📝 Logging in:', { email: data.email, password: '***' });
      const response = await authAPI.login({
        email: data.email,
        password: data.password
      });

      toast.success('Login successful');

      console.log('Login response:', response);
      console.log('User role:', response.user?.role);

      // Redirect based on user role
      if (response.user?.role === 'applicant') {
        console.log('Redirecting to applicant dashboard');
        router.push('/dashboard/applicant');
      } else if (response.user?.role === 'employer') {
        console.log('Redirecting to employer dashboard');
        router.push('/dashboard/employer');
      } else if (response.user?.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        router.push('/dashboard/admin');
      } else {
        console.error('Unknown role or missing role:', response.user?.role);
        toast.error('Unable to determine user role. Please contact support.');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Check if error is due to unverified email
      if (error.response?.data?.requiresVerification) {
        toast.error(error.response.data.message, {
          description:
            'Please check your email inbox for the verification link.',
          duration: 8000,
          action: {
            label: 'Resend Email',
            onClick: async () => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: error.response.data.email })
                  }
                );

                if (response.ok) {
                  toast.success(
                    'Verification email sent! Please check your inbox.'
                  );
                } else {
                  toast.error('Failed to resend verification email');
                }
              } catch (err) {
                toast.error('Failed to resend verification email');
              }
            }
          }
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            'Login failed. Please check your credentials and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Card Glow Effect */}
        <div className="absolute inset-0  rounded-3xl"></div>

        <div className="relative z-10">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="text-center pb-4 px-4 sm:pb-6 sm:px-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border border-blue-200 mb-3 sm:mb-4">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                Secure Login Portal
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Access Your Account
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <form
                    onSubmit={handleFormSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          {...register('email')}
                          className={`h-10 sm:h-12 text-sm sm:text-base bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : ''
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                          Password
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline cursor-pointer relative z-30">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...register('password')}
                          className={`pr-10 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                            errors.password
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl group"
                      disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Logging in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Sign In
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </Button>
                  </form>
            </CardContent>

            <CardFooter className="flex justify-center pt-6 border-t border-gray-200/50 relative z-20">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 cursor-pointer relative z-30"
                    onClick={() => console.log('Register link clicked')}>
                    Create Account
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
