'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
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
import { authAPI } from '@/lib/api-service';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset email sent successfully!');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative">
        {/* Glassmorphism Card */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 rounded-3xl"></div>

          <div className="relative z-10">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full px-4 py-2 text-sm font-medium border border-green-200 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Email Sent Successfully
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  We've sent password reset instructions to{' '}
                  <strong>{email}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-6 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-700">
                      Please check your email inbox and follow the instructions
                      to reset your password.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Didn't receive the email?</strong> Check your spam
                      folder or try again in a few minutes.
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center pt-6 border-t border-gray-200/50 relative z-20">
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    onClick={() => {
                      console.log('Send another email clicked');
                      setIsSubmitted(false);
                    }}
                    variant="outline"
                    className="w-full cursor-pointer relative z-30">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Another Email
                  </Button>
                  <Link href="/login" className="w-full relative z-30">
                    <Button
                      variant="ghost"
                      className="w-full cursor-pointer"
                      onClick={() => console.log('Back to login clicked')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Card Glow Effect */}
        <div className="absolute inset-0 rounded-3xl"></div>

        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 text-sm font-medium border border-blue-200 mb-4">
              <Mail className="h-4 w-4 text-blue-600" />
              Password Recovery
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Forgot Your Password?
            </CardTitle>
            <CardDescription className="text-gray-600">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`pl-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl group"
                disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Reset Email...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Send Reset Email
                    <Mail className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-6 border-t border-gray-200/50 relative z-20">
            <div className="flex flex-col gap-3 w-full">
              <p className="text-sm text-gray-600 text-center">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 cursor-pointer relative z-30"
                  onClick={() => console.log('Sign In link clicked')}>
                  Sign In
                </Link>
              </p>
              <Link href="/register" className="w-full relative z-30">
                <Button variant="ghost" className="w-full cursor-pointer">
                  Don't have an account? Create one
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
