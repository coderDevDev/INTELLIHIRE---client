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
  registerSchema,
  type RegisterFormData
} from '@/lib/validations/authValidation';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'applicant' | 'admin'>('applicant');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
      dob: '',
      password: '',
      confirmPassword: '',
      role: 'applicant'
    },
    mode: 'onChange' // Real-time validation
  });

  // Update role when tab changes
  const handleTabChange = (value: string) => {
    const role = value as 'applicant' | 'admin';
    setUserType(role);
    setValue('role', role);
  };

  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const registrationData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phone.trim(),
        address: data.address?.trim() || '',
        gender: data.gender || '',
        dob: data.dob || '',
        role: data.role
      };

      console.log('📝 Submitting registration:', {
        ...registrationData,
        password: '***'
      });

      const response = await authAPI.register(registrationData);

      if (response.requiresVerification) {
        toast.success('Account created successfully!', {
          description: `📧 Please check your email (${data.email}) to verify your account before logging in.`,
          duration: 8000
        });

        // Redirect to login page with email parameter
        setTimeout(() => {
          router.push(
            `/login?email=${encodeURIComponent(data.email)}&verified=pending`
          );
        }, 3000);
      } else {
        // Fallback: if verification not required (shouldn't happen with new flow)
        toast.success('Account created successfully!');

        if (response.user.role === 'applicant') {
          router.push('/dashboard/applicant');
        } else if (response.user.role === 'employer') {
          router.push('/dashboard/employer');
        } else if (response.user.role === 'admin') {
          router.push('/dashboard/admin');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
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
        <div className="absolute inset-0 rounded-3xl"></div>

        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="text-center pb-4 px-4 sm:pb-6 sm:px-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border border-blue-200 mb-3 sm:mb-4">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              Create New Account
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Join InteliHire
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              Choose your account type and create your profile
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <Tabs defaultValue="applicant" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 mb-4 sm:mb-6">
                <TabsTrigger
                  value="applicant"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-medium transition-all duration-300">
                  <User className="h-4 w-4 mr-2" />
                  Job Seeker
                </TabsTrigger>
                {/* <TabsTrigger
                  value="admin"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-medium transition-all duration-300">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger> */}
              </TabsList>

              {/* APPLICANT TAB */}
              <TabsContent value="applicant">
                <form
                  onSubmit={handleFormSubmit(onSubmit)}
                  className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...register('firstName')}
                        onKeyPress={(e) => {
                          // Only allow letters, spaces, hyphens, and apostrophes
                          if (!/^[a-zA-Z\s'\-]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...register('lastName')}
                        onKeyPress={(e) => {
                          // Only allow letters, spaces, hyphens, and apostrophes
                          if (!/^[a-zA-Z\s'\-]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register('email')}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
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

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09123456789"
                      {...register('phone')}
                      onKeyPress={(e) => {
                        // Only allow numbers, +, -, spaces, and parentheses
                        if (!/^[0-9+\-\s()]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Gender
                      </Label>
                      <select
                        id="gender"
                        {...register('gender')}
                        className={`h-12 w-full bg-white/80 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm px-4 ${
                          errors.gender
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                      {errors.gender && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="dob"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        {...register('dob')}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.dob
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      {errors.dob && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.dob.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main St, City, Province"
                      {...register('address')}
                      className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                        errors.address
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('password')}
                        className={`pr-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
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
                    <div className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters with uppercase,
                      lowercase, number, and special character
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        className={`pr-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword.message}
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
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* ADMIN TAB */}
              <TabsContent value="admin">
                <form
                  onSubmit={handleFormSubmit(onSubmit)}
                  className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-600" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Jane"
                        {...register('firstName')}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-600" />
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Smith"
                        {...register('lastName')}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-600" />
                      Admin Email
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register('email')}
                        className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
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

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09"
                      {...register('phone')}
                      className={`h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-sm font-semibold text-gray-700">
                        Gender{' '}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </Label>
                      <select
                        id="gender"
                        {...register('gender')}
                        className="h-12 w-full bg-white/80 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm px-4">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="dob"
                        className="text-sm font-semibold text-gray-700">
                        Date of Birth{' '}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        {...register('dob')}
                        className="h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-700">
                      Address{' '}
                      <span className="text-gray-400 font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main St, City, Province"
                      {...register('address')}
                      className="h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-600" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('password')}
                        className={`pr-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
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
                    <div className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters with uppercase,
                      lowercase, number, and special character
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-600" />
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        className={`pr-12 h-12 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl group"
                    disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Admin Account
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-center pt-6 border-t border-gray-200/50 relative z-20">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 cursor-pointer relative z-30">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
