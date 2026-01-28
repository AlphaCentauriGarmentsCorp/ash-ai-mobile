import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

export interface Legend {
  label: string;
  color: string;
}

interface FilterBarProps {
  legends?: Legend[];
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function FilterBar({ legends, children, style }: FilterBarProps) {
  return (
    <View style={[styles.filterRow, style]}>
      {legends && legends.length > 0 && (
        <View style={styles.legendContainer}>
          <Text style={styles.legendLabel}>Legends:</Text>
          {legends.map((legend, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{legend.label}</Text>
              <View style={[styles.dot, { backgroundColor: legend.color }]} />
            </View>
          ))}
        </View>
      )}

      <View style={styles.filterDropdowns}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 100,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginRight: 8,
    fontFamily: FONT_FAMILY.regular,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: SIZES.border.thin,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.text,
    marginRight: 4,
    fontFamily: FONT_FAMILY.regular,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radius.xs,
  },
  filterDropdowns: {
    flexDirection: 'row',
    gap: 8,
    zIndex: 100,
  },
});
