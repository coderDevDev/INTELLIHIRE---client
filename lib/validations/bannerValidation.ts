import { z } from 'zod';

export const bannerFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Banner title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),

  description: z
    .string()
    .min(1, 'Banner description is required')
    .max(500, 'Description cannot exceed 500 characters')
    .trim(),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Please upload a banner image')
    .refine(
      val => val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')),
      'Invalid image URL'
    ),

  linkUrl: z
    .string()
    .optional()
    .refine(
      val => !val || /^https?:\/\/.+/.test(val),
      'Link URL must be a valid HTTP/HTTPS URL'
    )
    .transform(val => val || ''),

  position: z.enum(['top', 'middle', 'bottom', 'sidebar'], {
    errorMap: () => ({ message: 'Please select a valid position' })
  }),

  priority: z
    .number()
    .int('Priority must be a whole number')
    .min(1, 'Priority must be at least 1 (highest priority)')
    .max(10, 'Priority cannot exceed 10 (lowest priority)'),

  targetAudience: z.enum(['all', 'applicants', 'employers', 'admin'], {
    errorMap: () => ({ message: 'Please select a valid target audience' })
  }),

  category: z
    .string()
    .optional()
    .transform(val => val || ''),

  tags: z.array(z.string().trim()).default([]),

  startDate: z
    .string()
    .optional()
    .transform(val => val || ''),

  endDate: z
    .string()
    .optional()
    .transform(val => val || ''),

  startDateTime: z
    .string()
    .optional()
    .transform(val => val || ''),

  endDateTime: z
    .string()
    .optional()
    .transform(val => val || ''),

  timezone: z
    .string()
    .optional()
    .transform(val => val || 'UTC'),

  recurring: z.boolean().default(false),

  recurringPattern: z
    .enum(['none', 'daily', 'weekly', 'monthly'])
    .default('none'),

  status: z.enum(['active', 'inactive', 'scheduled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  })
});

export type BannerFormData = z.infer<typeof bannerFormSchema>;

// Schema optimized for react-hook-form with better error messages
export const bannerFormSchemaRH = z.object({
  title: z
    .string()
    .min(1, 'Banner title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),

  description: z
    .string()
    .min(1, 'Banner description is required')
    .max(500, 'Description cannot exceed 500 characters')
    .trim(),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Please upload a banner image')
    .refine(
      val => val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')),
      'Invalid image URL'
    ),

  linkUrl: z
    .string()
    .optional()
    .refine(
      val => !val || /^https?:\/\/.+/.test(val),
      'Link URL must be a valid HTTP/HTTPS URL'
    )
    .transform(val => val || ''),

  position: z.enum(['top', 'middle', 'bottom', 'sidebar'], {
    errorMap: () => ({ message: 'Please select a valid position' })
  }),

  priority: z
    .number()
    .int('Priority must be a whole number')
    .min(1, 'Priority must be at least 1 (highest priority)')
    .max(10, 'Priority cannot exceed 10 (lowest priority)'),

  targetAudience: z.enum(['all', 'applicants', 'employers', 'admin'], {
    errorMap: () => ({ message: 'Please select a valid target audience' })
  }),

  category: z
    .string()
    .optional()
    .transform(val => val || ''),

  tags: z.array(z.string().trim()).default([]),

  startDate: z
    .string()
    .optional()
    .transform(val => val || ''),

  endDate: z
    .string()
    .optional()
    .transform(val => val || ''),

  startDateTime: z
    .string()
    .optional()
    .transform(val => val || ''),

  endDateTime: z
    .string()
    .optional()
    .transform(val => val || ''),

  timezone: z
    .string()
    .optional()
    .transform(val => val || 'UTC'),

  recurring: z.boolean().default(false),

  recurringPattern: z
    .enum(['none', 'daily', 'weekly', 'monthly'])
    .default('none'),

  status: z.enum(['active', 'inactive', 'scheduled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  })
});

export type BannerFormDataRH = z.infer<typeof bannerFormSchemaRH>;

// Validation helper function
export const validateBannerForm = (data: unknown) => {
  try {
    const validatedData = bannerFormSchema.parse(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path.join('.');
        fieldErrors[field] = err.message;
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return {
      success: false,
      data: null,
      errors: { general: 'An unexpected error occurred' }
    };
  }
};
