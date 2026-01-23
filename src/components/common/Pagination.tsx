import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
// Assuming these constants exist in your project based on previous context
import { FONT_FAMILY } from '../../constants';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onEntriesChange: (entries: number) => void;
  entriesOptions?: number[];
  style?: ViewStyle;
}

export default function Pagination({
  currentPage,
  totalPages,
  entriesPerPage,
  onPageChange,
  onEntriesChange,
  entriesOptions = [5, 10, 15],
  style,
}: PaginationProps) {
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

  const handleEntriesChange = (value: number) => {
    onEntriesChange(value);
    setShowEntriesDropdown(false);
  };

  // Helper to generate page numbers
  const renderPageNumbers = () => {
    const pagesToShow = [];
    const limit = Math.min(totalPages, 7); 
    
    for (let i = 1; i <= limit; i++) {
      pagesToShow.push(i);
    }

    return (
      <>
        {pagesToShow.map((page) => (
          <TouchableOpacity
            key={page}
            style={[
              styles.pageNum,
              currentPage === page ? styles.activePage : styles.inactivePage
            ]}
            onPress={() => onPageChange(page)}
          >
            <Text
              style={
                currentPage === page ? styles.activePageText : styles.inactivePageText
              }
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* "Last" Button */}
        {totalPages > 1 && (
             <TouchableOpacity
             style={[styles.pageNum, styles.lastButton]}
             onPress={() => onPageChange(totalPages)}
           >
             <Text style={styles.inactivePageText}>Last</Text>
           </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={[styles.paginationWrapper, style]}>
      
      {/* TOP ROW: Show Entries (Aligned Right) */}
      <View style={styles.entriesContainer}>
        <Text style={styles.showText}>Show all</Text>
        
        <View style={styles.dropdownWrapperPagination}>
          <TouchableOpacity style={styles.dropdownBox} onPress={() => setShowEntriesDropdown(!showEntriesDropdown)}>
            <Text style={styles.dropdownText}>
              {entriesPerPage}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#64748B" />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {showEntriesDropdown && (
            <View style={styles.dropdownMenu}>
              {entriesOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItemBtn}
                  onPress={() => handleEntriesChange(option)}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <Text style={styles.showText}>entries</Text>
      </View>

      {/* BOTTOM ROW: Pagination Controls (Centered) */}
      <View style={styles.pageControls}>
        {/* Previous Arrow */}
        <TouchableOpacity
          style={styles.navArrow}
          onPress={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentPage === 1 ? "#94A3B8" : "#0B1C36"} // Grey if disabled
          />
        </TouchableOpacity>

        {/* Page Numbers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}}>
             <View style={{flexDirection: 'row', gap: 6}}>
                {renderPageNumbers()}
             </View>
        </ScrollView>

        {/* Next Arrow */}
        <TouchableOpacity
          style={styles.navArrow}
          onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentPage === totalPages ? "#94A3B8" : "#0B1C36"} // Grey if disabled
          />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  paginationWrapper: {
    flexDirection: 'column', // Stack children vertically
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    gap: 16, // Space between the top and bottom rows
  },

  // --- TOP ROW: Entries Dropdown ---
  entriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end', // Align to the right side
    gap: 10,
    zIndex: 10, // Ensure dropdown floats on top of everything
  },
  showText: {
    fontSize: 14,
    color: '#0B1C36',
    fontFamily: FONT_FAMILY.regular,
  },
  dropdownWrapperPagination: {
    position: 'relative',
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#94A3B8',
    paddingHorizontal: 12,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 55,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 14,
    color: '#0B1C36',
    fontFamily: FONT_FAMILY.medium,
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: '120%', // Pushes it down below the box
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    minWidth: 65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItemBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#0B1C36',
    fontFamily: FONT_FAMILY.regular,
  },

  // --- BOTTOM ROW: Page Controls ---
  pageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center', // Center horizontally
    gap: 8,
  },
  navArrow: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNum: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  lastButton: {
    width: 50,
    backgroundColor: '#F0F8FF',
  },

  // State: Active
  activePage: {
    backgroundColor: '#0B1C36', 
  },
  activePageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
  },

  // State: Inactive
  inactivePage: {
    backgroundColor: '#F0F8FF', 
  },
  inactivePageText: {
    color: '#0B1C36',
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
});