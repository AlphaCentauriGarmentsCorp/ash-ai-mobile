// Order calculation helper functions

/**
 * Calculate unit price (costPrice × quantity)
 * @param {number} costPrice - Cost per piece
 * @param {number} quantity - Number of pieces
 * @returns {number} Unit price
 */
export const calculateUnitPrice = (costPrice, quantity) => {
  return (parseFloat(costPrice) || 0) * (parseFloat(quantity) || 0);
};

/**
 * Calculate order summary from sizes array
 * @param {Array} sizes - Array of size objects
 * @param {number} depositPercentage - Deposit percentage (default 60)
 * @returns {Object} Order summary calculations
 */
export const calculateOrderSummary = (sizes, depositPercentage = 60) => {
  let totalQuantity = 0;
  let totalAmount = 0;
  let totalCost = 0;
  let unitPriceSum = 0;
  let validSizeCount = 0;

  sizes.forEach(size => {
    const qty = parseFloat(size.quantity) || 0;
    const cost = parseFloat(size.costPrice) || 0;
    const unitPrice = parseFloat(size.unitPrice) || 0;

    if (qty > 0) {
      totalQuantity += qty;
      totalAmount += unitPrice;
      totalCost += cost * qty;
      unitPriceSum += unitPrice;
      validSizeCount++;
    }
  });

  const depositAmount = (totalAmount * depositPercentage) / 100;
  const remainingBalance = totalAmount - depositAmount;

  return {
    totalQuantity,
    totalAmount,
    totalCost,
    averageUnitPrice: validSizeCount > 0 ? unitPriceSum / validSizeCount : 0,
    depositAmount,
    remainingBalance,
    depositPercentage
  };
};

/**
 * Get cost price for a specific size
 * @param {string} sizeName - Size name (XS, S, M, L, XL, XXL)
 * @param {Array} sizePrices - Array of size price objects
 * @returns {number} Cost price for the size
 */
export const getCostPriceForSize = (sizeName, sizePrices) => {
  const sizePrice = sizePrices.find(sp => sp.size === sizeName);
  return sizePrice ? sizePrice.costPrice : 0;
};

/**
 * Generate unique ID for size cards
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};