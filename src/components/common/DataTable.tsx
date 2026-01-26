import { COLORS, FONT_SIZES, SIZES } from '@styles';
import React, { useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

export interface Column {
  key: string;
  header: string;
  width: number;
  render?: (value: any, item: any, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  trackWidth?: number;
  thumbWidth?: number;
  style?: ViewStyle;
  activeRowIndex?: number | null;
}

export default function DataTable({
  columns,
  data,
  trackWidth = 350,
  thumbWidth = 120,
  style,
  activeRowIndex = null,
}: DataTableProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(1);
  const [visibleWidth, setVisibleWidth] = useState(0);

  const scrollableWidth = contentWidth - visibleWidth;

  const thumbTranslateX = scrollX.interpolate({
    inputRange: [0, scrollableWidth > 0 ? scrollableWidth : 1],
    outputRange: [0, trackWidth - thumbWidth],
    extrapolate: 'clamp',
  });

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
            {columns.map((column, index) => (
              <Text
                key={index}
                style={[styles.columnHeader, { width: column.width }]}
              >
                {column.header}
              </Text>
            ))}
          </View>

          {data.map((item, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.tableRow,
                rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
                { zIndex: activeRowIndex === rowIndex ? 1000 : 1 },
              ]}
            >
              {columns.map((column, colIndex) => {
                const value = item[column.key];
                return (
                  <View
                    key={colIndex}
                    style={{ width: column.width, alignItems: column.render ? 'center' : 'flex-start' }}
                  >
                    {column.render ? (
                      column.render(value, item, rowIndex)
                    ) : (
                      <Text style={styles.cellText} numberOfLines={1}>
                        {value}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
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
    paddingHorizontal: 10,
    borderBottomWidth: SIZES.border.thick,
    borderBottomColor: '#A5B4BF',
  },
  columnHeader: {
    fontSize: 10,
    fontFamily: "Poppins_300Light",
    color: 'COLORS.textSecondary',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: SIZES.border.thick,
    borderBottomColor: '#A5B4BF',
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: COLORS.white,
  },

  cellText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: 'poppins-regular',
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
