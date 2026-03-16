// Payment method and plan options
import { EnhancedOption } from '../../utils/dropdownHelpers';

export const paymentMethodOptions: EnhancedOption[] = [
  {
    value: "cash",
    label: "Cash",
    description: "Cash Payment",
    iconFamily: "Ionicons",
    iconName: "cash-outline",
    color: "#10B981",
    processingTime: "Instant",
    fees: "None"
  },
  {
    value: "credit_card",
    label: "Credit Card",
    description: "Credit / Debit Card",
    iconFamily: "Ionicons",
    iconName: "card-outline",
    color: "#6B7280",
    processingTime: "Instant",
    fees: "3.5%"
  },
  {
    value: "debit_card",
    label: "Debit Card",
    description: "Debit Card",
    iconFamily: "Ionicons",
    iconName: "card-outline",
    color: "#3B82F6",
    processingTime: "Instant",
    fees: "2.5%"
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Online Bank Transfer", 
    iconFamily: "MaterialIcons",
    iconName: "account-balance",
    color: "#3B82F6",
    processingTime: "1-2 hours",
    fees: "Bank charges may apply"
  },
  {
    value: "gcash",
    label: "GCash",
    description: "GCash E-Wallet",
    iconFamily: "MaterialIcons", 
    iconName: "account-balance-wallet",
    color: "#0066CC",
    processingTime: "Instant",
    fees: "2.5%",
    popular: true
  },
  {
    value: "paymaya",
    label: "Maya",
    description: "Maya (PayMaya)",
    iconFamily: "MaterialIcons",
    iconName: "payment",
    color: "#00D632",
    processingTime: "Instant",
    fees: "2.5%"
  },
  {
    value: "paypal",
    label: "PayPal",
    description: "PayPal",
    iconFamily: "MaterialIcons",
    iconName: "payment",
    color: "#0070BA",
    processingTime: "Instant",
    fees: "3.9% + ₱15"
  }
];

export const paymentPlanOptions: EnhancedOption[] = [
  {
    value: "full_payment",
    label: "Full Payment",
    description: "Pay the total amount upfront before production starts",
    discount: "5% discount",
    iconFamily: "Ionicons",
    iconName: "checkmark-circle-outline",
    color: "#10B981",
    recommended: true,
    badge: "SAVE 5%"
  },
  {
    value: "downpayment",
    label: "Down Payment",
    description: "Partial payment required before production, balance due before release",
    iconFamily: "MaterialIcons",
    iconName: "pie-chart",
    color: "#F59E0B",
    badge: "FLEXIBLE"
  }
];