# Unified Components Guide

## Overview

This project has successfully migrated from duplicate form components to a unified component system. This guide explains the new architecture and how to use the unified components.

## Architecture

### Before Migration
```
components/
├── common/
│   ├── FormDropdown.tsx (200+ lines, complex search)
│   └── FormInput.tsx (100+ lines, styled with icons)
└── form/
    ├── FormDropdown.tsx (40 lines, simple wrapper)
    └── FormField.tsx (50 lines, basic input)
```

### After Migration
```
components/
└── unified/
    ├── UnifiedDropdown.tsx (300+ lines, handles both variants)
    └── UnifiedInput.tsx (200+ lines, handles both variants)
```

## Components

### UnifiedDropdown

A single dropdown component that handles both simple and complex use cases through variants.

#### Props
```typescript
interface UnifiedDropdownProps {
  options: UnifiedDropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  variant?: 'simple' | 'searchable'; // Default: 'simple'
  
  // Form integration props
  label?: string;
  required?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  
  // Searchable variant props
  icon?: keyof typeof Ionicons.glyphMap;
  showSearch?: boolean; // Default: true
}
```

#### Usage Examples

**Simple Variant (Inventory Screens)**:
```typescript
import { UnifiedDropdown } from '@components/unified';

<UnifiedDropdown
  label="Equipment Location"
  required
  options={locationOptions}
  selectedValue={selectedLocation}
  onSelect={setSelectedLocation}
  placeholder="Select Location"
  error={errors.location}
/>
```

**Searchable Variant (Order/Quotation Screens)**:
```typescript
import { UnifiedDropdown } from '@components/unified';

<UnifiedDropdown
  variant="searchable"
  options={clientOptions}
  selectedValue={selectedClient}
  onSelect={setSelectedClient}
  placeholder="Select Client"
  showSearch={true}
/>
```

### UnifiedInput

A single input component that handles both simple and styled use cases through variants.

#### Props
```typescript
interface UnifiedInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: 'simple' | 'styled'; // Default: 'simple'
  
  // Form integration props
  label?: string;
  required?: boolean;
  error?: string;
  isTextArea?: boolean;
  containerStyle?: ViewStyle;
  
  // Styled variant props
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  inputStyle?: TextStyle;
  iconSize?: number;
  iconColor?: string;
}
```

#### Usage Examples

**Simple Variant (Inventory Screens)**:
```typescript
import { UnifiedInput } from '@components/unified';

<UnifiedInput
  label="Item Name"
  required
  placeholder="Enter item name"
  value={formData.name}
  onChangeText={(text) => setFormData({ ...formData, name: text })}
  error={errors.name}
/>
```

**Styled Variant (DropdownSettings Screens)**:
```typescript
import { UnifiedInput } from '@components/unified';

<UnifiedInput
  variant="styled"
  placeholder="Enter service type name"
  value={formData.name}
  onChangeText={(text) => setFormData({ ...formData, name: text })}
  leftIcon="person-outline"
  isPassword={false}
/>
```

**Text Area Example**:
```typescript
<UnifiedInput
  label="Description"
  placeholder="Enter description"
  value={formData.description}
  onChangeText={(text) => setFormData({ ...formData, description: text })}
  isTextArea
  numberOfLines={4}
/>
```

## Migration Summary

### Screens Migrated
- **6 Inventory Screens** → UnifiedDropdown/UnifiedInput with `variant="simple"`
- **2 Order/Quotation Screens** → UnifiedDropdown with `variant="searchable"`
- **18 DropdownSettings Screens** → UnifiedInput with `variant="styled"`
- **3 Specific Component Files** → UnifiedDropdown with `variant="searchable"`

### Benefits Achieved
- ✅ **Single Source of Truth**: One component handles all dropdown/input use cases
- ✅ **Zero Breaking Changes**: UI and functionality remain identical
- ✅ **Consistent Architecture**: Variant-based system provides clear behavior
- ✅ **Reduced Code Duplication**: Eliminated 400+ lines of duplicate logic
- ✅ **Improved Maintainability**: Future updates only need to be made in unified components
- ✅ **Enhanced Developer Experience**: Clear API with TypeScript support

### Deleted Components
The following components have been safely removed:
- `components/common/FormDropdown.tsx`
- `components/common/FormInput.tsx`
- `components/form/FormDropdown.tsx`
- `components/form/FormField.tsx`

## Best Practices

### When to Use Which Variant

#### UnifiedDropdown
- **`variant="simple"`** (default): For inventory screens, simple forms, basic dropdowns
- **`variant="searchable"`**: For order/quotation screens, complex forms, large option lists

#### UnifiedInput
- **`variant="simple"`** (default): For inventory screens, forms with integrated labels/errors
- **`variant="styled"`**: For dropdown settings screens, standalone inputs with styling

### TypeScript Support
All unified components are fully typed with TypeScript. Import types as needed:

```typescript
import { UnifiedDropdown, type UnifiedDropdownOption } from '@components/unified';
import { UnifiedInput } from '@components/unified';
```

### Form Integration
Both components integrate seamlessly with form systems:
- Built-in label rendering with required indicators
- Error message display
- Consistent spacing and styling
- Proper accessibility support

## Troubleshooting

### Common Issues

1. **Component not found**: Make sure to import from `@components/unified`
2. **Styling issues**: Check if you're using the correct variant for your use case
3. **TypeScript errors**: Ensure you're using `UnifiedDropdownOption` type for dropdown options

### Getting Help

If you encounter issues with the unified components:
1. Check this guide for usage examples
2. Look at existing implementations in the codebase
3. Verify you're using the correct variant for your use case
4. Check TypeScript types and prop requirements

## Future Enhancements

Potential improvements for the unified components:
- Dynamic positioning for simple dropdown variant
- Enhanced accessibility support
- Multi-select capability for dropdowns
- Additional input variants as needed
- Performance optimizations

---

*This guide was created as part of the unified component system migration completed in 2024.*