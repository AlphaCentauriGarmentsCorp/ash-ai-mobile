import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import { hp } from '@utils/responsive';

export interface UnifiedDropdownOption {
  label: string;
  value: string;
}

type DropdownVariant = 'simple' | 'searchable';

interface UnifiedDropdownProps {
  options: UnifiedDropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  variant?: DropdownVariant;
  
  // Form integration props
  label?: string;
  required?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  
  // Searchable variant props
  icon?: keyof typeof Ionicons.glyphMap;
  showSearch?: boolean;
}

export const UnifiedDropdown: React.FC<UnifiedDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select',
  variant = 'simple',
  label,
  required = false,
  error,
  containerStyle,
  icon = 'chevron-down',
  showSearch = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      // For simple variant, measure button position for proper modal placement
      if (variant === 'simple' && buttonRef.current) {
        buttonRef.current.measure((_fx: number, _fy: number, _w: number, h: number, px: number, py: number) => {
          const windowWidth = Dimensions.get('window').width;
          setDropdownPosition({
            top: py + h + 8, // Button Y pos + Button Height + proper margin
            right: windowWidth - (px + _w), // Calculate distance from right edge
            width: _w,
          });
          setIsOpen(true);
        });
      } else {
        // For searchable variant, just open the modal
        setIsOpen(true);
      }
    }
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  // Filter options based on search query (only for searchable variant)
  const filteredOptions = variant === 'searchable' && showSearch
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Render form label if provided
  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
        {required && <Text style={styles.requiredText}> *</Text>}
      </View>
    );
  };

  // Render error text if provided
  const renderError = () => {
    if (!error) return null;
    
    return (
      <Text style={styles.errorText}>{error}</Text>
    );
  };

  // Simple variant dropdown button (matches form/FormDropdown + basic Dropdown)
  const renderSimpleButton = () => (
    <TouchableOpacity
      ref={buttonRef}
      style={[
        styles.simpleDropdownButton,
        error && styles.simpleDropdownButtonError,
      ]}
      onPress={toggleDropdown}
    >
      <Text style={[
        styles.simpleDropdownText,
        !selectedValue && styles.simplePlaceholderText
      ]}>
        {selectedLabel}
      </Text>
      <Ionicons name="chevron-down" size={14} color="#666" />
    </TouchableOpacity>
  );

  // Searchable variant dropdown button (matches common/FormDropdown)
  const renderSearchableButton = () => (
    <TouchableOpacity
      style={styles.searchableDropdownButton}
      onPress={() => setIsOpen(true)}
    >
      <Text style={[
        styles.searchableDropdownText,
        !selectedValue && styles.searchablePlaceholderText
      ]}>
        {selectedLabel}
      </Text>
      <Ionicons name={icon} size={16} color="#666" />
    </TouchableOpacity>
  );

  // Simple variant modal (matches basic Dropdown behavior)
  const renderSimpleModal = () => (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.simpleModalOverlay}>
          <View style={[
            styles.simpleModalContent,
            {
              top: dropdownPosition.top,
              right: dropdownPosition.right,
              width: dropdownPosition.width,
            }
          ]}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  index === 0 ? styles.simpleHeaderBtn : styles.simpleItemBtn,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={
                    index === 0
                      ? styles.simpleHeaderText
                      : styles.simpleItemText
                  }
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Searchable variant modal (matches common/FormDropdown)
  const renderSearchableModal = () => (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.searchableModalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View style={styles.searchableModalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.searchableModalHeader}>
            <Text style={styles.searchableModalTitle}>{placeholder}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Only show if showSearch is true */}
          {showSearch && (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <ScrollView style={styles.searchableOptionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.searchableOptionItem,
                    selectedValue === option.value && styles.searchableSelectedOption,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.searchableOptionText,
                      selectedValue === option.value && styles.searchableSelectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedValue === option.value && (
                    <Ionicons name="checkmark" size={20} color="#0D253F" />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}
      
      {variant === 'simple' ? renderSimpleButton() : renderSearchableButton()}
      {variant === 'simple' ? renderSimpleModal() : renderSearchableModal()}
      
      {renderError()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(1.9),
  },
  
  // Label styles (from form/FormLabel)
  labelContainer: {
    flexDirection: 'row',
    marginBottom: hp(0.6),
  },
  labelText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
  },
  requiredText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.errorLight,
  },
  
  // Error styles (from form/ErrorText)
  errorText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.errorLight,
    marginTop: hp(0.3),
    minHeight: hp(1.5),
  },

  // Simple variant styles (matches basic Dropdown + form integration)
  simpleDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: SIZES.border.thin + 1,
    borderColor: '#808D99',
    borderRadius: SIZES.radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  simpleDropdownButtonError: {
    borderColor: COLORS.errorLight,
  },
  simpleDropdownText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
    flex: 1,
  },
  simplePlaceholderText: {
    color: '#999',
  },
  
  // Simple modal styles (matches basic Dropdown)
  simpleModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  simpleModalContent: {
    position: 'absolute',
    minWidth: 150,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  simpleHeaderBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#E8F4F8',
  },
  simpleHeaderText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
  },
  simpleItemBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0B1C36',
    borderTopWidth: SIZES.border.thin,
    borderTopColor: '#1e3a5f',
  },
  simpleItemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
  },

  // Searchable variant styles (matches common/FormDropdown exactly)
  searchableDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  searchableDropdownText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#333',
    flex: 1,
  },
  searchablePlaceholderText: {
    color: '#999',
  },
  
  // Searchable modal styles (matches common/FormDropdown exactly)
  searchableModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchableModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  searchableModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchableModalTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchableOptionsList: {
    maxHeight: 300,
  },
  searchableOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchableSelectedOption: {
    backgroundColor: '#EBF6FF',
  },
  searchableOptionText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#333',
  },
  searchableSelectedOptionText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#999',
  },
});