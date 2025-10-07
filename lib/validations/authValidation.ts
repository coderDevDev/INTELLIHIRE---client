import { z } from 'zod';

/**
 * Registration Form Validation Schema
 */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'First name can only contain letters, spaces, hyphens, and apostrophes'
      ),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'Last name can only contain letters, spaces, hyphens, and apostrophes'
      ),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .toLowerCase(),

    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
        'Please enter a valid phone number'
      ),

    address: z.string().optional().or(z.literal('')),

    gender: z
      .enum(['male', 'female', 'other', 'prefer_not_to_say', ''], {
        errorMap: () => ({ message: 'Please select a valid gender' })
      })
      .optional(),

    dob: z.string().optional().or(z.literal('')),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /(?=.*[a-z])/,
        'Password must contain at least one lowercase letter'
      )
      .regex(
        /(?=.*[A-Z])/,
        'Password must contain at least one uppercase letter'
      )
      .regex(/(?=.*\d)/, 'Password must contain at least one number')
      .regex(
        /(?=.*[@$!%*?&#])/,
        'Password must contain at least one special character (@$!%*?&#)'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    role: z.enum(['applicant', 'admin'], {
      errorMap: () => ({ message: 'Please select a valid role' })
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login Form Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),

  password: z.string().min(1, 'Password is required')
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Forgot Password Validation Schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Validation Schema
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /(?=.*[a-z])/,
        'Password must contain at least one lowercase letter'
      )
      .regex(
        /(?=.*[A-Z])/,
        'Password must contain at least one uppercase letter'
      )
      .regex(/(?=.*\d)/, 'Password must contain at least one number')
      .regex(
        /(?=.*[@$!%*?&#])/,
        'Password must contain at least one special character'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
