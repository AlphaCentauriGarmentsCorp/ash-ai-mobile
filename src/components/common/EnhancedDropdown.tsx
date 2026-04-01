import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UnifiedDropdown, type UnifiedDropdownOption } from '../unified';

interface EnhancedDropdownProps {
  options: any[]; // Enhanced options with additional properties
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
  showDetails?: boolean;
  style?: any;
}

const getIconComponent = (iconFamily: string) => {
  switch (iconFamily) {
    case 'Ionicons': return Ionicons;
    case 'MaterialIcons': return MaterialIcons;
    default: return Ionicons;
  }
};

export const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  showDetails = false,
  style
}) => {
  // Convert enhanced options to UnifiedDropdown format
  const formOptions: UnifiedDropdownOption[] = options.map(option => ({
    label: option.label,
    value: option.value
  }));

  // Get selected option details
  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <View style={style}>
      <UnifiedDropdown
        variant="searchable"
        options={formOptions}
        selectedValue={selectedValue}
        onSelect={onSelect}
        placeholder={placeholder}
      />
      
      {/* Show additional details if option is selected and showDetails is true */}
      {showDetails && selectedOption && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            {selectedOption.iconFamily && selectedOption.iconName && (
              <View style={styles.iconContainer}>
                {React.createElement(
                  getIconComponent(selectedOption.iconFamily),
                  {
                    name: selectedOption.iconName,
                    size: 16,
                    color: selectedOption.color || '#6B7280'
                  }
                )}
              </View>
            )}
            <Text style={styles.detailsTitle}>{selectedOption.label}</Text>
            {selectedOption.badge && (
              <View style={[styles.badge, { backgroundColor: selectedOption.color || '#6B7280' }]}>
                <Text style={styles.badgeText}>{selectedOption.badge}</Text>
              </View>
            )}
          </View>
          
          {selectedOption.description && (
            <Text style={styles.description}>{selectedOption.description}</Text>
          )}
          
          <View style={styles.detailsRow}>
            {selectedOption.estimatedDays && (
              <Text style={styles.detailText}>⏱️ {selectedOption.estimatedDays}</Text>
            )}
            {selectedOption.priceRange && (
              <Text style={styles.detailText}>💰 {selectedOption.priceRange}</Text>
            )}
            {selectedOption.processingTime && (
              <Text style={styles.detailText}>⚡ {selectedOption.processingTime}</Text>
            )}
          </View>
          
          {selectedOption.features && selectedOption.features.length > 0 && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Features:</Text>
              <View style={styles.featuresRow}>
                {selectedOption.features.map((feature: string, index: number) => (
                  <Text key={index} style={styles.featureTag}>
                    {feature}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    marginRight: 8,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailText: {
    fontSize: 11,
    color: '#374151',
  },
  featuresContainer: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  featureTag: {
    fontSize: 10,
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default EnhancedDropdown;