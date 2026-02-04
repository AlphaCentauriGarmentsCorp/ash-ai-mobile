import { Ionicons } from '@expo/vector-icons';
import { FONT_FAMILY } from '@styles';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
// Added Image to the import list
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SizeCard {
  id: number;
  size: string;
  quantity: string;
  costPrice: string;
  unitPrice: string;
}

const DesignMockup = forwardRef((props, ref) => {
  const [sizeCards, setSizeCards] = useState<SizeCard[]>([
    { id: 1, size: '', quantity: '', costPrice: '', unitPrice: '' }
  ]);

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      setSizeCards([{ id: 1, size: '', quantity: '', costPrice: '', unitPrice: '' }]);
    }
  }));

  const addSizeCard = () => {
    const newCard: SizeCard = {
      id: Date.now(),
      size: '',
      quantity: '',
      costPrice: '',
      unitPrice: ''
    };
    setSizeCards([...sizeCards, newCard]);
  };

  const removeSizeCard = (id: number) => {
    if (sizeCards.length > 1) {
      setSizeCards(sizeCards.filter(card => card.id !== id));
    }
  };

  const handleUpdateCard = (id: number, field: keyof SizeCard, value: string) => {
    setSizeCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  return (
    <View style={styles.card}>
      {/* Section: Design Files & Mockups */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Design Files & Mockups</Text>
      </View>
      <View style={styles.divider} />

      {/* Design Files */}
      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Design Files</Text>
        <TouchableOpacity style={styles.uploadBox}>
          {/* Replaced Ionicons with Image */}
          <Image 
           source={require('../../../assets/images/download-solid-full.png')}
            style={styles.uploadIconImage} 
          />
          <Text style={styles.uploadText}>Upload design mockups</Text>
          <Text style={styles.uploadSubtext}>image/*.ai, .psd (max 10MB)</Text>
        </TouchableOpacity>
        <View style={styles.uploadedFilesBox}>
          <Text style={styles.uploadedLabel}>Uploaded files</Text>
          <Text style={styles.placeholderText}>Preview will show here</Text>
        </View>
      </View>

      {/* Design Mockups */}
      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Design Mockups</Text>
        <TouchableOpacity style={styles.uploadBox}>
          {/* Replaced Ionicons with Image */}
          <Image 
            source={require('../../../assets/images/download-solid-full.png')} 
            style={styles.uploadIconImage} 
          />
          <Text style={styles.uploadText}>Upload design mockups</Text>
          <Text style={styles.uploadSubtext}>image/*.ai, .psd (max 10MB)</Text>
        </TouchableOpacity>
        <View style={styles.uploadedFilesBox}>
          <Text style={styles.uploadedLabel}>Uploaded files</Text>
          <Text style={styles.placeholderText}>Preview will show here</Text>
        </View>
      </View>

      {/* Placement Measurements */}
      <View style={styles.fullInputContainer}>
        <Text style={styles.label}>Placement Measurements</Text>
        <View style={styles.dropdownContainer}>
          <Text style={[styles.dropdownInput, { color: '#6B7280' }]}>Select Placement Measurements</Text>
          <Ionicons name="chevron-down" size={14} color="#6B7280" style={styles.dropdownIcon} />
        </View>
      </View>

      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Enter additional notes here..." 
        placeholderTextColor="#9CA3AF"
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Section: Sizes & Quantities */}
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Sizes & Quantities</Text>
      </View>
      <View style={styles.divider} />

      {/* Render Size Cards */}
      {sizeCards.map((card, index) => (
        <View key={card.id} style={styles.sizeCardWrapper}>
          <View style={styles.sizeCard}>
            <View style={styles.sizeRowTop}>
              <View style={{ flex: 1.3 }}>
                <Text style={styles.smallLabel}>Size</Text>
                <TouchableOpacity style={styles.smallDropdownContainer}>
                  <Text style={[styles.smallDropdownInput, { color: card.size ? '#1F2937' : '#9CA3AF' }]}>
                    {card.size || "Select Size"}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={{ flex: 0.7 }}>
                <Text style={styles.smallLabel}>Quantity</Text>
                <TextInput 
                  style={styles.smallInput} 
                  placeholder="0" 
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  value={card.quantity}
                  onChangeText={(text) => handleUpdateCard(card.id, 'quantity', text)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Cost Price</Text>
                <TextInput 
                  style={styles.smallBlueInput} 
                  placeholder="₱0.00" 
                  editable={false}
                  placeholderTextColor="#6B7280"
                  value={card.costPrice}
                />
              </View>
            </View>

            <View style={styles.sizeRowBottom}>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Unit Price</Text>
                <TextInput 
                  style={styles.smallBlueInputFull} 
                  placeholder="₱0.00" 
                  editable={false}
                  placeholderTextColor="#6B7280"
                  value={card.unitPrice}
                />
              </View>
            </View>
          </View>

          {sizeCards.length > 1 && (
            <TouchableOpacity 
              style={styles.removeBtn}
              onPress={() => removeSizeCard(card.id)}
            >
              <Ionicons name="remove" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addSizeBtn} onPress={addSizeCard}>
        <Text style={styles.addSizeBtnText}>+ Add Size</Text>
      </TouchableOpacity>

      <View style={styles.totalRow}>
        <View style={styles.totalInputContainer}>
          <Text style={styles.label}>Total Quantity</Text>
          <TextInput 
            style={styles.blueInput} 
            placeholder="0" 
            editable={false}
            placeholderTextColor="#1F2937"
          />
        </View>
        <View style={styles.totalInputContainer}>
          <Text style={styles.label}>Unit Price</Text>
          <TextInput 
            style={styles.blueInput} 
            placeholder="₱0.00" 
            editable={false}
            placeholderTextColor="#1F2937"
          />
        </View>
      </View>

      <View style={styles.totalAmountContainer}>
        <Text style={styles.label}>Total Amount</Text>
        <TextInput 
          style={styles.blueInputFull} 
          placeholder="Total amount of the unit" 
          editable={false}
          placeholderTextColor="#1F2937"
        />
      </View>
    </View>
  );
});

DesignMockup.displayName = 'DesignMockup';

export default DesignMockup;

const styles = StyleSheet.create({
  // ... (keeping your previous styles)
  card: {
    backgroundColor: '#EBF6FF', 
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.bold,
    color: '#111827',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.bold,
    color: '#1F2937',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  smallLabel: {
    fontSize: 11,
    fontFamily: FONT_FAMILY.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  smallDropdownContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallDropdownInput: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
  },
  smallBlueInput: {
    backgroundColor: '#DCEAF5',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
  },
  smallBlueInputFull: {
    backgroundColor: '#DCEAF5',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    width: '100%',
  },
  blueInput: {
    backgroundColor: '#DCEAF5', 
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
  blueInputFull: {
    backgroundColor: '#DCEAF5',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
    width: '100%',
  },
  fullInputContainer: {
    marginBottom: 15,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  // Added style for the image icon
  uploadIconImage: {
    width: 24,
    height: 24,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  uploadText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
  },
  uploadedFilesBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 15,
    minHeight: 60, 
    justifyContent: 'center',
  },
  uploadedLabel: {
    position: 'absolute',
    top: 10,
    left: 12,
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 15, 
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sizeCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sizeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sizeRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  sizeRowBottom: {
    marginTop: 0,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownInput: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  removeBtn: {
    marginLeft: 10,
    backgroundColor: '#111827', 
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSizeBtn: {
    backgroundColor: '#264660', 
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  addSizeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: FONT_FAMILY.bold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 15,
  },
  totalInputContainer: {
    flex: 1,
  },
  totalAmountContainer: {
    marginBottom: 5,
  },
});