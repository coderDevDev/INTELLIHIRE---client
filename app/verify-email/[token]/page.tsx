'use client';

// Force dynamic rendering - skip static generation
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired'
  >('loading');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const token = params.token as string;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/${token}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message);
        setUserInfo(data.user);

        // Auto-redirect to login after 5 seconds
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      } else {
        if (data.expired || data.message?.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userInfo?.email })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
        setStatus('loading');
      } else {
        setMessage(data.message || 'Failed to resend email');
      }
    } catch (error) {
      setMessage('Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
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

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            {status === 'loading' && (
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {(status === 'error' || status === 'expired') && (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}

            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {status === 'loading' && 'Verifying Your Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
              {status === 'expired' && 'Link Expired'}
            </CardTitle>

            <CardDescription className="text-gray-600">
              {message}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'success' && userInfo && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-green-900">
                  Welcome, {userInfo.firstName} {userInfo.lastName}!
                </p>
                <p className="text-sm text-green-700">
                  Your account ({userInfo.email}) has been successfully
                  verified.
                </p>
                <p className="text-sm text-green-700">
                  Redirecting to login in 5 seconds...
                </p>
              </div>
            )}

            {status === 'expired' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
                <p className="text-sm text-yellow-800">
                  Your verification link has expired. Click below to receive a
                  new one.
                </p>
                <Button
                  onClick={handleResendVerification}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">
                  The verification link is invalid or has already been used.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {status === 'success' && (
              <Link href="/login" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  Go to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
