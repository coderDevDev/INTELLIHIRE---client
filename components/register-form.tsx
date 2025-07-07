'use client';

import type React from 'react';
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
import { authAPI } from '@/lib/api-service';
import { toast } from 'sonner';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikProps
} from 'formik';
import * as Yup from 'yup';

const GENDERS = ['Male', 'Female', 'Other'];

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'applicant' | 'employer';
  phone: string;
  address: string;
  gender: string;
  dob: string;
}

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required.'),
  lastName: Yup.string().required('Last name is required.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords do not match.')
    .required('Please confirm your password.'),
  phone: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Invalid phone number.')
    .required('Phone number is required.'),
  address: Yup.string().required('Address is required.'),
  gender: Yup.string()
    .oneOf(GENDERS, 'Gender is required.')
    .required('Gender is required.'),
  dob: Yup.string()
    .required('Date of birth is required.')
    .test('age', 'You must be at least 18 years old.', (value?: string) => {
      if (!value) return false;
      const today = new Date();
      const dob = new Date(value);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= 18;
    }),
  role: Yup.string()
    .oneOf(['applicant', 'employer'])
    .required('Role is required.')
});

export function RegisterForm() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create an account to start applying for jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik<RegisterFormValues>
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'applicant',
            phone: '',
            address: '',
            gender: '',
            dob: ''
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (
            values,
            { setSubmitting }: FormikHelpers<RegisterFormValues>
          ) => {
            try {
              const { confirmPassword, ...registerData } = values;
              const response = await authAPI.register(registerData);
              toast.success('Registration successful! Welcome to InteliHire!');
              // if (response.user.role === 'applicant') {
              //   router.push('/dashboard/applicant');
              // } else if (response.user.role === 'employer') {
              //   router.push('/dashboard/employer');
              // }
            } catch (error: any) {
              toast.error(
                error.response?.data?.message ||
                  'Registration failed. Please check your information and try again.'
              );
            } finally {
              setSubmitting(false);
            }
          }}>
          {({
            isSubmitting,
            touched,
            errors
          }: FormikProps<RegisterFormValues>) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Field
                    as={Input}
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    className={
                      errors.firstName && touched.firstName
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Field
                    as={Input}
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    className={
                      errors.lastName && touched.lastName
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={
                      errors.email && touched.email ? 'border-red-500' : ''
                    }
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    placeholder="e.g. +639171234567"
                    className={
                      errors.phone && touched.phone ? 'border-red-500' : ''
                    }
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Field
                  as={Input}
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  className={
                    errors.address && touched.address ? 'border-red-500' : ''
                  }
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Field
                    as="select"
                    id="gender"
                    name="gender"
                    className={`w-full p-2 border rounded-md ${
                      errors.gender && touched.gender ? 'border-red-500' : ''
                    }`}>
                    <option value="">Select gender</option>
                    {GENDERS.map(g => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Field
                    as={Input}
                    id="dob"
                    name="dob"
                    type="date"
                    className={
                      errors.dob && touched.dob ? 'border-red-500' : ''
                    }
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={
                      errors.password && touched.password
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={
                      errors.confirmPassword && touched.confirmPassword
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-xs text-red-600 mt-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Register as</Label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className={`w-full p-2 border rounded-md ${
                    errors.role && touched.role ? 'border-red-500' : ''
                  }`}>
                  <option value="applicant">Job Seeker</option>
                  <option value="employer">Employer</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-xs text-red-600 mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
