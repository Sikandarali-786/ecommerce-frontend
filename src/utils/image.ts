/**
 * Converts a stored image path to a displayable URL.
 *
 * - Local dev:   "/uploads/products/product-123.jpg"
 *                → "http://localhost:5112/uploads/products/product-123.jpg"
 *
 * - Production:  "https://res.cloudinary.com/..."
 *                → returned as-is (already a full URL)
 *
 * - Legacy full URL already stored: returned as-is
 */

// const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL as string)
const BACKEND_URL = ((import.meta.env.VITE_API_BASE_URL as string) ?? '')
  .replace('/api', ''); // strip the /api suffix → "http://localhost:5112"

export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return 'https://placehold.co/400x400?text=No+Image';

  // Already a full URL (Cloudinary or legacy localhost URL)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Relative path — prepend backend origin
  return `${BACKEND_URL}${path}`;
};
