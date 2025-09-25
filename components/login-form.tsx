'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowRight
} from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('applicant');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log({ formData });
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
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
      toast.error(
        error.response?.data?.message ||
          'Login failed. Please check your credentials and try again.'
      );
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
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 text-sm font-medium border border-blue-200 mb-4">
                <Shield className="h-4 w-4 text-blue-600" />
                Secure Login Portal
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Access Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose your account type and enter your credentials
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Tabs defaultValue="applicant" onValueChange={setUserType}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 mb-6">
                  <TabsTrigger
                    value="applicant"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-medium transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    Applicant
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-medium transition-all duration-300">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="applicant">
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
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-blue-600" />
                          Password
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline cursor-pointer relative z-30"
                          onClick={() =>
                            console.log('Forgot password link clicked')
                          }>
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-12 pr-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
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
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl group"
                      disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                </TabsContent>

                <TabsContent value="admin">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-purple-600" />
                        Admin Email
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-purple-600" />
                          Admin Password
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-12 pr-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
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
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl group"
                      disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Logging in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Admin Sign In
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
