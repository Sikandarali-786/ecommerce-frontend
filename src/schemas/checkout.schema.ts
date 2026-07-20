import { z } from 'zod';

export const checkoutSchema = z.object({
  // Shipping Information
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  country: z.string().min(2, 'Country is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  zipCode: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
