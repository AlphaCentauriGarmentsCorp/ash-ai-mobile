import React from 'react';
import { StyleSheet, View } from 'react-native';
import { hp } from '@utils/responsive';

interface FormRowProps {
  children: React.ReactNode;
}

export const FormRow: React.FC<FormRowProps> = ({ children }) => {
  // Clone children and add halfInputContainer style to each UnifiedInput
  const childrenWithStyles = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type && 
        ((child.type as any).name === 'UnifiedInput' || (child.type as any).name === 'UnifiedDropdown')) {
      return React.cloneElement(child, {
        containerStyle: [styles.halfInputContainer, child.props.containerStyle],
      });
    }
    return child;
  });

  return (
    <View style={styles.row}>
      {childrenWithStyles}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.9),
  },
  halfInputContainer: {
    width: '48%',
  },
});