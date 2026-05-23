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
  zipCode: z.string().min(3, 'ZIP/Postal code is required'),

  // Payment Information
  cardNumber: z.string().min(13, 'Card number must be at least 13 digits'),
  cardName: z.string().min(2, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits').max(4, 'CVV must be 3-4 digits'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
