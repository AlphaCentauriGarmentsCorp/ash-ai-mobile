// Shipping and courier options with detailed information
import { EnhancedOption } from '../../utils/dropdownHelpers';

export const courierOptions: EnhancedOption[] = [
  {
    value: "lakbay_express",
    label: "Lakbay Express",
    description: "Express delivery service",
    estimatedDays: "1-2 days",
    priceRange: "₱180-350",
    iconFamily: "Ionicons",
    iconName: "rocket-outline",
    color: "#EF4444",
    coverage: "Nationwide",
    features: ["Express delivery", "Real-time tracking"]
  },
  {
    value: "haribon_logistics",
    label: "Haribon Logistics",
    description: "Logistics company",
    estimatedDays: "2-3 days",
    priceRange: "₱150-300",
    iconFamily: "MaterialIcons",
    iconName: "local-shipping",
    color: "#3B82F6",
    coverage: "Nationwide",
    features: ["Reliable service", "Insurance coverage"]
  },
  {
    value: "bayan_courier",
    label: "Bayan Courier Services",
    description: "Nationwide courier",
    estimatedDays: "2-4 days",
    priceRange: "₱120-280",
    iconFamily: "MaterialIcons",
    iconName: "local-shipping",
    color: "#10B981",
    coverage: "Nationwide",
    features: ["Door-to-door", "Tracking", "Insurance"]
  },
  {
    value: "agila_delivery",
    label: "Agila Delivery",
    description: "Fast delivery service",
    estimatedDays: "1-2 days",
    priceRange: "₱200-400",
    iconFamily: "Ionicons",
    iconName: "airplane-outline",
    color: "#F59E0B",
    coverage: "Metro Manila, Major Cities",
    features: ["Fast delivery", "Real-time tracking"]
  },
  {
    value: "ulap_logistics",
    label: "Ulap Logistics",
    description: "Cloud-based logistics",
    estimatedDays: "2-3 days",
    priceRange: "₱160-320",
    iconFamily: "Ionicons",
    iconName: "cloud-outline",
    color: "#8B5CF6",
    coverage: "Major Cities",
    features: ["Digital tracking", "Cloud-based system"]
  },
  {
    value: "kalye_go",
    label: "KalyeGo",
    description: "Local delivery service",
    estimatedDays: "Same day",
    priceRange: "₱250-500",
    iconFamily: "Ionicons",
    iconName: "bicycle-outline",
    color: "#06B6D4",
    coverage: "Metro Manila",
    features: ["Same-day", "Local routes", "Eco-friendly"]
  },
  {
    value: "arangkada_express",
    label: "Arangkada Express",
    description: "Accelerated delivery",
    estimatedDays: "1-2 days",
    priceRange: "₱220-450",
    iconFamily: "Ionicons",
    iconName: "flash-outline",
    color: "#EF4444",
    coverage: "Luzon",
    features: ["Express service", "Priority handling"]
  },
  {
    value: "daloy_shipping",
    label: "Daloy Shipping",
    description: "Flow-based shipping",
    estimatedDays: "3-5 days",
    priceRange: "₱100-250",
    iconFamily: "Ionicons",
    iconName: "water-outline",
    color: "#3B82F6",
    coverage: "Island provinces",
    features: ["Sea freight", "Bulk shipping"]
  },
  {
    value: "pinoyhaul",
    label: "PinoyHaul",
    description: "Philippine hauling service",
    estimatedDays: "2-4 days",
    priceRange: "₱140-300",
    iconFamily: "MaterialIcons",
    iconName: "local-shipping",
    color: "#10B981",
    coverage: "Nationwide",
    features: ["Local expertise", "Affordable rates"]
  },
  {
    value: "habagat_logix",
    label: "Habagat Logix",
    description: "Southwest monsoon logistics",
    estimatedDays: "2-3 days",
    priceRange: "₱170-350",
    iconFamily: "Ionicons",
    iconName: "rainy-outline",
    color: "#6B7280",
    coverage: "Western regions",
    features: ["Weather-resistant", "Regional specialist"]
  }
];

export const shippingMethodOptions: EnhancedOption[] = [
  {
    value: "standard",
    label: "Standard Delivery (3–5 Business Days)",
    description: "Standard shipping method",
    priceRange: "₱150-300",
    iconFamily: "Ionicons",
    iconName: "cube-outline", 
    color: "#6B7280",
    recommended: false
  },
  {
    value: "express",
    label: "Express Delivery (1–2 Business Days)",
    description: "Fast shipping method",
    priceRange: "₱300-500",
    iconFamily: "Ionicons",
    iconName: "rocket-outline",
    color: "#3B82F6",
    recommended: true,
    badge: "POPULAR"
  },
  {
    value: "same_day", 
    label: "Same-Day Delivery (Metro Areas)",
    description: "Immediate delivery",
    priceRange: "₱500-800",
    iconFamily: "Ionicons",
    iconName: "flash-outline",
    color: "#EF4444",
    recommended: false,
    badge: "PREMIUM"
  },
  {
    value: "next_day",
    label: "Next-Day Delivery",
    description: "Delivery within 24 hours",
    priceRange: "₱400-600",
    iconFamily: "Ionicons",
    iconName: "time-outline",
    color: "#F59E0B",
    recommended: false
  },
  {
    value: "economy",
    label: "Economy Shipping",
    description: "Cost-effective shipping",
    priceRange: "₱100-200",
    iconFamily: "Ionicons",
    iconName: "wallet-outline",
    color: "#10B981",
    recommended: false,
    badge: "BUDGET"
  },
  {
    value: "pickup",
    label: "Store / Warehouse Pickup",
    description: "Customer pickup option",
    priceRange: "Free",
    iconFamily: "Ionicons",
    iconName: "storefront-outline",
    color: "#10B981", 
    recommended: false,
    badge: "FREE"
  },
  {
    value: "cargo",
    label: "Cargo / Bulk Shipping",
    description: "Large item shipping",
    priceRange: "₱200-500",
    iconFamily: "MaterialIcons",
    iconName: "inventory",
    color: "#8B5CF6",
    recommended: false
  },
  {
    value: "sea_freight",
    label: "Sea Freight (Provincial)",
    description: "Maritime shipping",
    priceRange: "₱150-400",
    iconFamily: "Ionicons",
    iconName: "boat-outline",
    color: "#06B6D4",
    recommended: false
  }
];