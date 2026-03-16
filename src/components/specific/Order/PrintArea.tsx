import { Ionicons } from '@expo/vector-icons';
import { hp, rfs } from "@utils/responsive";
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const SIZE_OPTIONS = ['XS', 'Small', 'Medium', 'Large', 'XL', '2XL', '3XL'];

const QuotationAndSizes = forwardRef((props, ref) => {
  const [sizeCards, setSizeCards] = useState([
    { id: 1, size: '', quantity: '', costPrice: '', unitPrice: '', keepColor: false },
    { id: 2, size: '', quantity: '', costPrice: '', unitPrice: '', keepColor: false },
    { id: 3, size: '', quantity: '', costPrice: '', unitPrice: '', keepColor: false },
  ]);

  const [openDropdownId, setOpenDropdownId] = useState(null);

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      setSizeCards([{ id: 1, size: '', quantity: '', costPrice: '', unitPrice: '', keepColor: false }]);
    },
    getData: () => {
      const filteredItems = sizeCards
        .filter(card => card.size && card.quantity && parseInt(card.quantity) > 0);
      
      console.log('PrintArea getData called:', {
        totalCards: sizeCards.length,
        filteredItems: filteredItems.length,
        sizeCards: sizeCards
      });
      
      return {
        items: filteredItems.map(card => ({
          product_name: card.size ? `${card.size} Size Item` : 'Size Item',
          size: card.size || '',
          quantity: parseInt(card.quantity) || 0,
          price: parseFloat(card.unitPrice) || 0,
          color: card.keepColor ? 'Custom Color' : ''
        })),
        notes: ''
      };
    }
  }));

  const addSizeCard = () => {
    const newCard = {
      id: Date.now(),
      size: '', 
      quantity: '',
      costPrice: '',
      unitPrice: '',
      keepColor: false
    };
    setSizeCards([...sizeCards, newCard]);
  };

  const removeSizeCard = (id) => {
    if (sizeCards.length > 1) {
      setSizeCards(sizeCards.filter(card => card.id !== id));
    }
  };

  const toggleKeepColor = (id) => {
    setSizeCards(sizeCards.map(card => 
      card.id === id ? { ...card, keepColor: !card.keepColor } : card
    ));
  };

  const updateSizeCard = (id, field, value) => {
    setSizeCards(sizeCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSelectSize = (size) => {
    setSizeCards(sizeCards.map(card => 
      card.id === openDropdownId ? { ...card, size: size } : card
    ));
    setOpenDropdownId(null);
  };

  return (
    <View style={styles.stepContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          
          {/* ==========================================
              SECTION 1: QUOTATION 
          ========================================== */}
          <Text style={styles.sectionTitle}>Quotation</Text>
          <View style={styles.divider} />
          
          <Text style={styles.sectionHeader}>Preview</Text>
          <View style={styles.previewBox}>
            <Text style={styles.placeholderText}>Preview will show here</Text>
          </View>

          <View style={styles.packageBox}>
            <Text style={styles.labelBold}>Package: </Text>
            <Text style={styles.valueText}>No data yet</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailsCol}>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Client:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Pattern:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Print Type:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Neckline:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
            </View>
            <View style={styles.detailsCol}>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Shirt Color:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Color Amount:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Quantity:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
              <View style={styles.detailRow}><Text style={styles.gridLabelBold}>Free:</Text><Text style={styles.gridValueText}>No data yet</Text></View>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Size</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Quantity</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
            </View>
            {['Small', 'Medium', 'Large', 'XL', '2XL', '3XL'].map((size, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCellText, { flex: 1, fontFamily: 'Poppins_600SemiBold' }]}>{size}</Text>
                <Text style={[styles.tableCellText, { flex: 1, textAlign: 'center' }]}>0</Text>
                <Text style={[styles.tableCellText, { flex: 1, textAlign: 'right' }]}>0.00 PHP</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subSectionTitle}>Quotation Summary</Text>
          <View style={styles.quotationSummaryBox}>
            <View style={styles.inputGroup}>
              <Text style={styles.labelBold}>60% Downpayment</Text>
              <TextInput style={styles.blueInputFull} editable={false} placeholder="0.00 PHP" placeholderTextColor="#6B7280" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.labelBold}>40% Balance (Upon Delivery/Pickup)</Text>
              <TextInput style={styles.blueInputFull} editable={false} placeholder="0.00 PHP" placeholderTextColor="#6B7280" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.labelBold}>Total</Text>
              <TextInput style={styles.blueInputFull} editable={false} placeholder="0.00 PHP" placeholderTextColor="#6B7280" />
            </View>
          </View>

          {/* ==========================================
              SECTION 2: SIZES & QUANTITIES 
          ========================================== */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Sizes & Quantities</Text>
          <View style={styles.divider} />

          {sizeCards.map((card) => (
            <View 
              key={card.id} 
              style={[
                styles.sizeCard, 
                openDropdownId === card.id ? { zIndex: 1000, elevation: 1000 } : {}
              ]}
            >
              {/* Row 1: Size & Cost Price */}
              <View style={[
                styles.inputRow, 
                openDropdownId === card.id ? { zIndex: 1000, elevation: 1000 } : {}
              ]}>
                <View style={[
                  styles.inputCol, 
                  openDropdownId === card.id ? { zIndex: 1000, elevation: 1000 } : {}
                ]}>
                  <Text style={styles.labelBold}>Size</Text>
                  <View style={{ 
                    position: 'relative', 
                    zIndex: openDropdownId === card.id ? 1000 : 1 
                  }}>
                    <TouchableOpacity 
                      style={styles.dropdownInput} 
                      onPress={() => setOpenDropdownId(openDropdownId === card.id ? null : card.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: card.size ? '#1F2937' : '#9CA3AF', fontSize: 13 }}>
                        {card.size || 'Select Size'}
                      </Text>
                      <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>

                    {openDropdownId === card.id && (
                      <View style={styles.popoverDropdown}>
                        <View> 
                          {SIZE_OPTIONS.map((sizeOption, idx) => (
                            <TouchableOpacity 
                              key={idx}
                              style={[
                                styles.popoverItem, 
                                idx === SIZE_OPTIONS.length - 1 ? { borderBottomWidth: 0 } : {}
                              ]}
                              onPress={() => handleSelectSize(sizeOption)}
                            >
                              <Text style={styles.popoverItemText}>{sizeOption}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.inputCol}>
                  <Text style={styles.labelBold}>Cost Price</Text>
                  <TextInput 
                    style={styles.blueInputFull} 
                    placeholder="Computation will show here" 
                    placeholderTextColor="#6B7280"
                    editable={false}
                    value={card.costPrice || ''}
                  />
                </View>
              </View>

              {/* Row 2: Checkbox (Right Side Only) */}
              <View style={styles.checkboxRowContainer}>
                <View style={styles.inputCol} /> {/* Empty space on left */}
                <View style={styles.inputCol}>
                  <TouchableOpacity 
                    style={styles.checkboxRow} 
                    onPress={() => toggleKeepColor(card.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.checkbox}>
                      {card.keepColor ? <Ionicons name="checkmark" size={12} color="#001C34" /> : null}
                    </View>
                    <Text style={styles.checkboxText}>Keep the same color for others</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Row 3: Quantity & Unit Price */}
              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <Text style={styles.labelBold}>Quantity</Text>
                  <TextInput 
                    style={styles.whiteInput} 
                    placeholder="Enter Quantity" 
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={String(card.quantity || '')}
                    onChangeText={(value) => updateSizeCard(card.id, 'quantity', value)}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={styles.labelBold}>Unit Price</Text>
                  <TextInput 
                    style={styles.blueInputFull} 
                    placeholder="Computation will show here" 
                    placeholderTextColor="#6B7280"
                    editable={false}
                    value={card.unitPrice || ''}
                  />
                </View>
              </View>

              <View style={styles.removeRow}>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeSizeCard(card.id)}>
                  <Text style={styles.removeBtnText}>- Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addSizeBtn} onPress={addSizeCard}>
            <Text style={styles.addSizeBtnText}>+ Add Size</Text>
          </TouchableOpacity>


          {/* ==========================================
              SECTION 3: SUMMARY 
          ========================================== */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Summary</Text>
          
          <View style={styles.finalSummaryBox}>
            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.labelBold}>Total Quantity</Text>
                <TextInput style={styles.blueInputFull} editable={false} placeholder="0" placeholderTextColor="#1F2937" />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.labelBold}>Unit Price</Text>
                <TextInput style={styles.blueInputFull} editable={false} placeholder="P0.00" placeholderTextColor="#1F2937" />
              </View>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={styles.labelBold}>Total Amount</Text>
              <TextInput style={styles.blueInputFull} editable={false} placeholder="Total amount of the unit" placeholderTextColor="#1F2937" />
            </View>
          </View>
        </View>
        {/* === END OF CARD === */}

      </ScrollView>
    </View>
  );
});

QuotationAndSizes.displayName = 'QuotationAndSizes';

export default QuotationAndSizes;

const styles = StyleSheet.create({
  stepContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 0, 
  },
  card: {
    backgroundColor: '#EBF6FF', 
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: rfs(16),
    fontFamily: "Poppins_600SemiBold",
    color: '#111827',
    marginBottom: hp(0.5),
  },
  subSectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
    marginBottom: 10,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginBottom: 20,
  },
  labelBold: {
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
  },

  // --- QUOTATION STYLES ---
  previewBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
  },
  packageBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  
  detailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  detailsCol: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginBottom: 8,
    paddingRight: 10,
  },
  gridLabelBold: {
    fontSize: 9,
    fontFamily: 'Poppins_600SemiBold',
    color: '#001C34',
    width: 75, 
  },
  gridValueText: {
    fontSize: 9,
    fontFamily: 'Poppins_400Regular',
    color: '#9CA3AF',
    flex: 1, 
  },

  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DCEAF5', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  tableHeaderText: {
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
    color: '#001C34',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCellText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
  },
  quotationSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 15,
  },
  inputGroup: {
    marginBottom: 12,
  },

  // --- REBUILT FLEX SIZES & QUANTITIES ALIGNMENT ---
  sizeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    ...(Platform.OS === 'ios' ? { zIndex: 1 } : {}),
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  inputCol: {
    flex: 1,
  },
  checkboxRowContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },

  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  
  popoverDropdown: {
    position: 'absolute',
    top: 46, 
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  popoverItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', 
    flexDirection: 'row',
    alignItems: 'center',
  },
  popoverItemText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular', 
    color: '#001C34', 
  },

  whiteInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  blueInputFull: {
    backgroundColor: '#DCEAF5', 
    borderWidth: 1,
    borderColor: '#CFE0EE',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13, 
    fontFamily: 'Poppins_400Regular',
    color: '#1F2937',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 9,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  removeRow: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: '#EF4444', 
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  removeBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  addSizeBtn: {
    backgroundColor: '#001C34', 
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  addSizeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },

  finalSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },

  // --- FOOTER BUTTONS (MOVED OUTSIDE CARD) ---
  clearBtnContainer: {
    alignItems: 'flex-end',
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 20, // Added to align with card content
  },
  clearText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#4B5563',
    textDecorationLine: 'underline',
  },
});