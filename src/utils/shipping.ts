import type { Product } from '../types';

/**
 * Calculates shipping cost based on total weight in kg:
 * - Up to 1 kg: Rs. 350
 * - 1 kg to 3 kg: Rs. 650
 * - 3 kg to 5 kg: Rs. 1,250
 * - Over 5 kg: Rs. 1,500
 */
export const calculateShippingCost = (totalWeightInKg: number): number => {
  if (totalWeightInKg <= 0) return 0;
  if (totalWeightInKg <= 1) return 350;
  if (totalWeightInKg <= 3) return 650;
  if (totalWeightInKg <= 5) return 1250;
  return 1500;
};

/**
 * Calculates total weight of all items in cart (in kg)
 */
export const calculateCartWeight = (
  items: Array<{ product: Product; quantity: number }>,
): number => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const weight =
      typeof item.product?.weight === 'number' && item.product.weight > 0
        ? item.product.weight
        : 1; // Default fallback: 1 kg per item if weight is not specified
    return sum + weight * item.quantity;
  }, 0);
};

/**
 * Returns human-readable label for shipping tier
 */
export const getShippingTierLabel = (totalWeightInKg: number): string => {
  if (totalWeightInKg <= 0) return 'No weight';
  if (totalWeightInKg <= 1) return 'Up to 1 kg';
  if (totalWeightInKg <= 3) return '1 kg to 3 kg';
  if (totalWeightInKg <= 5) return '3 kg to 5 kg';
  return 'Over 5 kg';
};
