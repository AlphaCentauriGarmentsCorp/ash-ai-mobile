import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SIZES } from '@styles';
import React, { useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

export interface Column {
  key: string;
  header: string;
  width: number;
  sortable?: boolean;
  render?: (value: any, item: any, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  trackWidth?: number;
  thumbWidth?: number;
  style?: ViewStyle;
  activeRowIndex?: number | null;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onRowPress?: (item: any, index: number) => void;
}

export default function DataTable({
  columns,
  data,
  trackWidth = 350,
  thumbWidth = 120,
  style,
  activeRowIndex = null,
  onSort,
  onRowPress,
}: DataTableProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(1);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const scrollableWidth = contentWidth - visibleWidth;

  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, scrollableWidth > 0 ? scrollableWidth : 1],
    outputRange: [0, trackWidth - thumbWidth],
    extrapolate: 'clamp',
  });

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnKey, direction });
    
    if (onSort) {
      onSort(columnKey, direction);
    }
  };

  const getSortedData = () => {
    if (!sortConfig) return data;

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sortedData;
  };

  const sortedData = getSortedData();

  return (
    <View style={[styles.tableWrapper, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onContentSizeChange={(w) => setContentWidth(w)}
        onLayout={(e) => setVisibleWidth(e.nativeEvent.layout.width)}
      >
        <View>
          <View style={styles.tableHeader}>
            {columns.map((column, index) => {
              const isSortable = column.sortable !== false && !column.render;
              const isSorted = sortConfig?.key === column.key;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.columnHeaderContainer, { width: column.width }]}
                  onPress={() => isSortable && handleSort(column.key)}
                  disabled={!isSortable}
                  activeOpacity={isSortable ? 0.7 : 1}
                >
                  <Text style={styles.columnHeader}>
                    {column.header}
                  </Text>
                  {isSortable && (
                    <View style={styles.sortIconContainer}>
                      {isSorted ? (
                        <Ionicons
                          name={sortConfig.direction === 'asc' ? 'chevron-up' : 'chevron-down'}
                          size={14}
                          color="#0D253F"
                        />
                      ) : (
                        <Ionicons name="swap-vertical" size={14} color="#A5B4BF" />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {sortedData.map((item, rowIndex) => {
            const RowWrapper = onRowPress ? TouchableOpacity : View;
            return (
              <RowWrapper
                key={rowIndex}
                style={[
                  styles.tableRow,
                  rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
                  { zIndex: activeRowIndex === rowIndex ? 1000 : 1 },
                ]}
                onPress={onRowPress ? () => onRowPress(item, rowIndex) : undefined}
                activeOpacity={onRowPress ? 0.7 : 1}
              >
                {columns.map((column, colIndex) => {
                  const value = item[column.key];
                  return (
                    <View
                      key={colIndex}
                      style={{ 
                        width: column.width, 
                        alignItems: column.render ? 'center' : 'flex-start',
                        paddingHorizontal: 4,
                      }}
                    >
                      {column.render ? (
                        column.render(value, item, rowIndex)
                      ) : (
                        <Text style={styles.cellText} numberOfLines={2}>
                          {value}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </RowWrapper>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.customScrollContainer}>
        <View style={[styles.scrollTrack, { width: trackWidth }]}>
          <Animated.View
            style={[
              styles.scrollThumb,
              { width: thumbWidth, transform: [{ translateX: thumbTranslateX }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 tableWrapper: {
    borderWidth: 2,           // Thicker stroke (matches image)
    borderColor: '#A5B4BF',   // Blue-grey color (Slate-400)         // Keeps the rounded corners
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EBF6FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: SIZES.border.thick,
    borderBottomColor: '#A5B4BF',
    gap: 16,
  },
  columnHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  columnHeader: {
    fontSize: 10,
    fontFamily: "Poppins_300Light",
    color: 'COLORS.textSecondary',
  },
  sortIconContainer: {
    marginLeft: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: SIZES.border.thick,
    borderBottomColor: '#A5B4BF',
    alignItems: 'center',
    gap: 16,
  },
  rowEven: {
    backgroundColor: COLORS.white,
  },
  rowOdd: {
    backgroundColor: '#F9FAFB',
  },
  cellText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: 'poppins-regular',
    flexWrap: 'wrap',
  },
  customScrollContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: SIZES.radius.xs,
    overflow: 'hidden',
  },
  scrollThumb: {
    height: '100%',
    backgroundColor: '#0B1C36',
    borderRadius: SIZES.radius.xs,
  },
});
