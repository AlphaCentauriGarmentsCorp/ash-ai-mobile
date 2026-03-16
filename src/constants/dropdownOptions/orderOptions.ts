// Order-related dropdown options with Expo Vector Icons integration
import { EnhancedOption } from '../../utils/dropdownHelpers';

export const priorityOptions: EnhancedOption[] = [
  {
    value: "low",
    label: "Low Priority",
    description: "Standard processing time",
    color: "#10B981",
    iconFamily: "Ionicons",
    iconName: "time-outline",
    estimatedDays: "7-10 days"
  },
  {
    value: "normal",
    label: "Normal Priority", 
    description: "Regular processing",
    color: "#F59E0B",
    iconFamily: "Ionicons",
    iconName: "flash-outline",
    estimatedDays: "5-7 days"
  },
  {
    value: "high",
    label: "High Priority",
    description: "Expedited processing", 
    color: "#EF4444",
    iconFamily: "MaterialIcons",
    iconName: "priority-high",
    estimatedDays: "3-5 days"
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Immediate attention required",
    color: "#DC2626", 
    iconFamily: "Ionicons",
    iconName: "warning",
    estimatedDays: "1-2 days",
    badge: "RUSH"
  }
];

export const brandOptions: EnhancedOption[] = [
  {
    value: "sorbetes",
    label: "Sorbetes Apparel",
    description: "Premium streetwear brand",
    color: "#6366F1",
    iconFamily: "MaterialIcons", 
    iconName: "local-fire-department"
  },
  {
    value: "reefer", 
    label: "Reefer Clothing",
    description: "Urban and casual wear",
    color: "#8B5CF6",
    iconFamily: "Ionicons",
    iconName: "shirt-outline"
  }
];