// Material options for inventory and production
import { EnhancedOption } from '../../utils/dropdownHelpers';

export const materialOptions: EnhancedOption[] = [
  // Fabrics & Garments
  {
    value: "Fabric",
    label: "Fabric",
    description: "Base fabric materials",
    iconFamily: "MaterialIcons",
    iconName: "texture",
    color: "#10B981",
    category: "Fabrics & Garments"
  },
  {
    value: "Threads",
    label: "Threads",
    description: "Sewing threads",
    iconFamily: "MaterialIcons",
    iconName: "linear-scale",
    color: "#8B5CF6",
    category: "Fabrics & Garments"
  },
  {
    value: "Interfacing",
    label: "Interfacing",
    description: "Fabric reinforcement",
    iconFamily: "MaterialIcons",
    iconName: "layers",
    color: "#6B7280",
    category: "Fabrics & Garments"
  },
  {
    value: "Labels Tags",
    label: "Labels Tags",
    description: "Garment labels and tags",
    iconFamily: "MaterialIcons",
    iconName: "label",
    color: "#F59E0B",
    category: "Fabrics & Garments"
  },

  // Inks & Paints
  {
    value: "Plastisol Ink",
    label: "Plastisol Ink",
    description: "Screen printing ink",
    iconFamily: "MaterialIcons",
    iconName: "colorize",
    color: "#EF4444",
    category: "Inks & Paints"
  },
  {
    value: "Water-Based Ink",
    label: "Water-Based Ink",
    description: "Eco-friendly printing ink",
    iconFamily: "Ionicons",
    iconName: "water-outline",
    color: "#06B6D4",
    category: "Inks & Paints"
  },
  {
    value: "Discharge Ink",
    label: "Discharge Ink",
    description: "Color removal ink",
    iconFamily: "MaterialIcons",
    iconName: "invert-colors",
    color: "#8B5CF6",
    category: "Inks & Paints"
  },
  {
    value: "Fabric Paints",
    label: "Fabric Paints",
    description: "Direct fabric painting",
    iconFamily: "MaterialIcons",
    iconName: "brush",
    color: "#F59E0B",
    category: "Inks & Paints"
  },
  {
    value: "Heat Transfer Powder",
    label: "Heat Transfer Powder",
    description: "Heat transfer material",
    iconFamily: "MaterialIcons",
    iconName: "local-fire-department",
    color: "#EF4444",
    category: "Inks & Paints"
  },
  {
    value: "Foil Glitter Material",
    label: "Foil Glitter Material",
    description: "Decorative foil and glitter",
    iconFamily: "MaterialIcons",
    iconName: "auto-awesome",
    color: "#F59E0B",
    category: "Inks & Paints"
  },

  // Tools & Equipment
  {
    value: "Screen Mesh",
    label: "Screen Mesh",
    description: "Screen printing mesh",
    iconFamily: "MaterialIcons",
    iconName: "grid-on",
    color: "#6B7280",
    category: "Tools & Equipment"
  },
  {
    value: "Aluminum Screen Frame",
    label: "Aluminum Screen Frame",
    description: "Screen printing frame",
    iconFamily: "MaterialIcons",
    iconName: "crop-free",
    color: "#9CA3AF",
    category: "Tools & Equipment"
  },
  {
    value: "Squeegee Rubber",
    label: "Squeegee Rubber",
    description: "Screen printing squeegee",
    iconFamily: "MaterialIcons",
    iconName: "straighten",
    color: "#EF4444",
    category: "Tools & Equipment"
  },
  {
    value: "Squeegee Handle",
    label: "Squeegee Handle",
    description: "Squeegee handle",
    iconFamily: "MaterialIcons",
    iconName: "pan-tool",
    color: "#8B5CF6",
    category: "Tools & Equipment"
  },
  {
    value: "Screen Tape",
    label: "Screen Tape",
    description: "Screen masking tape",
    iconFamily: "MaterialIcons",
    iconName: "tape",
    color: "#F59E0B",
    category: "Tools & Equipment"
  },
  {
    value: "Heat Press",
    label: "Heat Press",
    description: "Heat transfer equipment",
    iconFamily: "MaterialIcons",
    iconName: "compress",
    color: "#EF4444",
    category: "Tools & Equipment"
  },
  {
    value: "Stencil Masking Materials",
    label: "Stencil Masking Materials",
    description: "Stencil and masking supplies",
    iconFamily: "MaterialIcons",
    iconName: "crop",
    color: "#10B981",
    category: "Tools & Equipment"
  },

  // Chemicals & Cleaning
  {
    value: "Photo Emulsion",
    label: "Photo Emulsion",
    description: "Screen coating emulsion",
    iconFamily: "MaterialIcons",
    iconName: "photo",
    color: "#3B82F6",
    category: "Chemicals & Cleaning"
  },
  {
    value: "Emulsion Remover",
    label: "Emulsion Remover",
    description: "Screen cleaning chemical",
    iconFamily: "MaterialIcons",
    iconName: "cleaning-services",
    color: "#EF4444",
    category: "Chemicals & Cleaning"
  },
  {
    value: "Screen Cleaner Degreaser",
    label: "Screen Cleaner Degreaser",
    description: "Screen maintenance chemical",
    iconFamily: "MaterialIcons",
    iconName: "local-car-wash",
    color: "#06B6D4",
    category: "Chemicals & Cleaning"
  },
  {
    value: "Adhesive Spray",
    label: "Adhesive Spray",
    description: "Temporary adhesive",
    iconFamily: "MaterialIcons",
    iconName: "spray",
    color: "#F59E0B",
    category: "Chemicals & Cleaning"
  },

  // Miscellaneous / Packaging
  {
    value: "Packaging Materials",
    label: "Packaging Materials",
    description: "Product packaging supplies",
    iconFamily: "MaterialIcons",
    iconName: "inventory",
    color: "#8B5CF6",
    category: "Miscellaneous / Packaging"
  },
  {
    value: "Protective Gloves",
    label: "Protective Gloves",
    description: "Safety equipment",
    iconFamily: "MaterialIcons",
    iconName: "pan-tool",
    color: "#10B981",
    category: "Miscellaneous / Packaging"
  },
  {
    value: "Aprons Workwear",
    label: "Aprons Workwear",
    description: "Work protection clothing",
    iconFamily: "MaterialIcons",
    iconName: "checkroom",
    color: "#6B7280",
    category: "Miscellaneous / Packaging"
  }
];