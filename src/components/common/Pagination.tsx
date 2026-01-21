import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '../../constants';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onEntriesChange: (entries: number) => void;
  entriesOptions?: number[];
  style?: ViewStyle;
  showAllOption?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  entriesPerPage,
  onPageChange,
  onEntriesChange,
  entriesOptions = [5, 10, 15],
  style,
  showAllOption = true,
}: PaginationProps) {
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

  const handleEntriesChange = (value: number) => {
    onEntriesChange(value);
    setShowEntriesDropdown(false);
  };

  const toggleEntriesDropdown = () => {
    setShowEntriesDropdown(!showEntriesDropdown);
  };

  return (
    <View style={[styles.paginationWrapper, style]}>
      <View style={styles.entriesContainer}>
        <Text style={styles.showText}>Show</Text>
        <View style={styles.dropdownWrapperPagination}>
          <TouchableOpacity style={styles.dropdownBox} onPress={toggleEntriesDropdown}>
            <Text style={styles.dropdownText}>
              {entriesPerPage === 9999 ? 'All' : entriesPerPage}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#999" />
          </TouchableOpacity>
          {showEntriesDropdown && (
            <View style={styles.dropdownMenuAbove}>
              {entriesOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItemBtn}
                  onPress={() => handleEntriesChange(option)}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
              {showAllOption && (
                <TouchableOpacity
                  style={styles.dropdownItemBtn}
                  onPress={() => handleEntriesChange(9999)}
                >
                  <Text style={styles.dropdownItemText}>All</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <Text style={styles.showText}>entries</Text>
      </View>

      {entriesPerPage !== 9999 && (
        <View style={styles.pageControls}>
          <TouchableOpacity
            style={styles.navArrow}
            onPress={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={currentPage === 1 ? '#ccc' : '#999'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pageNum, styles.activePage]}>
            <Text style={styles.activePageText}>{currentPage}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navArrow}
            onPress={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={currentPage === totalPages ? '#ccc' : '#999'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paginationWrapper: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
    gap: 12,
  },
  entriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  showText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.regular,
  },
  dropdownWrapperPagination: {
    position: 'relative',
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radius.sm,
    gap: 6,
    minWidth: 60,
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.medium,
  },
  dropdownMenuAbove: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: 5,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.base,
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    overflow: 'hidden',
    minWidth: 80,
    zIndex: 2000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItemBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0B1C36',
    borderTopWidth: SIZES.border.thin,
    borderTopColor: '#1e3a5f',
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.regular,
  },
  pageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navArrow: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius.xs,
  },
  pageNum: {
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: 8,
  },
  activePage: {
    backgroundColor: '#0B1C36',
  },
  activePageText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
  },
});
