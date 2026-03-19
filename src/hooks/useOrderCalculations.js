import { useMemo } from 'react';

/**
 * Custom hook for order calculations following the exact data flow architecture
 * @param {Array} sizes - Array of size objects
 * @param {number} depositPercentage - Deposit percentage (default 60)
 * @returns {Object} Calculated order summary
 */
export const useOrderCalculations = (sizes, depositPercentage = 60) => {
  const calculations = useMemo(() => {
    let totalQuantity = 0;      // Sum of all quantities
    let totalAmount = 0;        // Sum of all totalPrices
    let totalCost = 0;          // Sum of (costPrice × quantity)
    let unitPriceSum = 0;       // Sum of unitPrices for average
    let sizeCount = 0;          // Count of sizes with quantity > 0

    sizes.forEach((size) => {
      const quantity = parseFloat(size.quantity) || 0;
      const costPrice = parseFloat(size.costPrice) || 0;
      const unitPrice = parseFloat(size.unitPrice) || 0;
      const totalPrice = parseFloat(size.totalPrice) || 0;

      // Only include sizes with quantity > 0
      if (quantity > 0) {
        totalQuantity += quantity;           // Add to total pieces
        totalAmount += totalPrice;           // Add to total order value
        totalCost += costPrice * quantity;   // Add to total cost
        unitPriceSum += unitPrice;           // Add for average calculation
        sizeCount++;                         // Count valid sizes
      }
    });

    // Calculate average unit price
    const averageUnitPrice = sizeCount > 0 ? unitPriceSum / sizeCount : 0;

    // Payment calculations
    const depositPercentageNum = parseFloat(depositPercentage) || 60;
    const depositAmount = (totalAmount * depositPercentageNum) / 100;
    const remainingBalance = totalAmount - depositAmount;

    return {
      totalQuantity,                                              // Total pieces across all sizes
      totalAmount: parseFloat(totalAmount.toFixed(2)),            // Total order value
      totalCost: parseFloat(totalCost.toFixed(2)),                // Total cost (same as totalAmount in this system)
      averageUnitPrice: parseFloat(averageUnitPrice.toFixed(2)),  // Average unit price across sizes
      depositAmount: parseFloat(depositAmount.toFixed(2)),        // Deposit amount
      remainingBalance: parseFloat(remainingBalance.toFixed(2)),  // Remaining balance
      estimatedTotal: parseFloat(totalAmount.toFixed(2))          // Formatted total amount
    };
  }, [sizes, depositPercentage]);

  return calculations;
};