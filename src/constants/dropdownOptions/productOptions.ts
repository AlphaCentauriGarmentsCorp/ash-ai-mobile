// Product-related dropdown options
import { EnhancedOption } from '../../utils/dropdownHelpers';

export const fabricTypeOptions: EnhancedOption[] = [
  {
    value: "cotton",
    label: "Cotton",
    description: "Natural fiber fabric",
    properties: ["Breathable", "Soft", "Durable"],
    iconFamily: "MaterialIcons",
    iconName: "eco",
    color: "#10B981",
    weight: "180-220 GSM",
    care: "Machine washable"
  },
  {
    value: "polyester",
    label: "Polyester",
    description: "Synthetic fabric",
    properties: ["Quick-dry", "Wrinkle-resistant"],
    iconFamily: "Ionicons",
    iconName: "water-outline",
    color: "#3B82F6",
    weight: "150-200 GSM",
    care: "Easy care"
  },
  {
    value: "blend",
    label: "Cotton-Poly Blend",
    description: "Mixed fabric",
    properties: ["Comfortable", "Durable", "Easy care"],
    iconFamily: "MaterialIcons",
    iconName: "layers",
    color: "#8B5CF6",
    weight: "160-210 GSM",
    care: "Machine washable",
    popular: true
  },
  {
    value: "fleece",
    label: "Fleece",
    description: "Soft, warm fabric",
    properties: ["Warm", "Soft", "Lightweight"],
    iconFamily: "MaterialIcons",
    iconName: "ac-unit",
    color: "#F59E0B",
    weight: "200-300 GSM",
    care: "Gentle wash"
  },
  {
    value: "jersey",
    label: "Jersey",
    description: "Knitted fabric",
    properties: ["Stretchy", "Comfortable", "Breathable"],
    iconFamily: "MaterialIcons",
    iconName: "fitness-center",
    color: "#EF4444",
    weight: "140-180 GSM",
    care: "Cold wash recommended",
    badge: "PERFORMANCE"
  }
];

export const fabricSupplierOptions: EnhancedOption[] = [
  {
    value: "textile_mart",
    label: "Textile Mart",
    description: "General fabric supplier",
    iconFamily: "MaterialIcons",
    iconName: "store",
    color: "#6366F1",
    location: "Manila",
    rating: 4.5,
    specialties: ["Cotton", "Blends", "Basic fabrics"]
  },
  {
    value: "premium_fabrics",
    label: "Premium Fabrics Co.",
    description: "High-quality fabric supplier",
    iconFamily: "MaterialIcons",
    iconName: "business",
    color: "#10B981",
    location: "Quezon City",
    rating: 4.8,
    specialties: ["Premium cotton", "Performance fabrics"],
    badge: "PREMIUM"
  },
  {
    value: "local_weavers",
    label: "Local Weavers Collective",
    description: "Local fabric producer",
    iconFamily: "MaterialIcons",
    iconName: "handyman",
    color: "#F59E0B",
    location: "Cebu",
    rating: 4.3,
    specialties: ["Handwoven", "Traditional fabrics", "Eco-friendly"]
  },
  {
    value: "import_fabrics",
    label: "Import Fabrics Inc.",
    description: "Imported fabric supplier",
    iconFamily: "MaterialIcons",
    iconName: "public",
    color: "#8B5CF6",
    location: "Manila",
    rating: 4.6,
    specialties: ["Imported materials", "Specialty fabrics"]
  }
];

export const printServiceOptions: EnhancedOption[] = [
  {
    value: "In House",
    label: "In-House Printing",
    description: "Printing services handled internally by our production team",
    bestFor: "Quality control, faster turnaround",
    iconFamily: "MaterialIcons",
    iconName: "home-work",
    color: "#10B981",
    durability: "Excellent",
    recommended: true
  },
  {
    value: "Sub Contract",
    label: "Subcontracted Printing",
    description: "Printing services outsourced to a trusted third-party provider",
    bestFor: "Large quantities, specialized techniques",
    iconFamily: "MaterialIcons",
    iconName: "business",
    color: "#3B82F6",
    durability: "Good"
  }
];