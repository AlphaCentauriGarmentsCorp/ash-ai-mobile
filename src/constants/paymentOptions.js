// Payment plan options
export const paymentPlanOptions = [
  {
    value: "full_payment",
    label: "Full Payment",
    title: "Pay the total amount upfront before production starts"
  },
  {
    value: "downpayment",
    label: "Down Payment", 
    title: "Partial payment required before production, balance due before release"
  }
];

// Payment method options
export const paymentMethodOptions = [
  { value: "cash", label: "Cash", title: "Cash Payment" },
  { value: "credit_card", label: "Credit Card", title: "Credit / Debit Card" },
  { value: "debit_card", label: "Debit Card", title: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer", title: "Online Bank Transfer" },
  { value: "gcash", label: "GCash", title: "GCash E-Wallet" },
  { value: "paymaya", label: "Maya", title: "Maya (PayMaya)" },
  { value: "paypal", label: "PayPal", title: "PayPal" }
];

// Default constants
export const DEFAULT_DEPOSIT_PERCENTAGE = 60;