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

// Import cost price system
import { defaultSizePrices, sizeOptions } from '@constants/orderOptions';
import { useOrderCalculations } from '@hooks/useOrderCalculations';
import { calculateUnitPrice, generateId, getCostPriceForSize } from '@utils/orderHelpers';

const QuotationAndSizes = forwardRef((props: { onSummaryChange?: (summary: any) => void }, ref) => {
  const [sizeCards, setSizeCards] = useState([
    { 
      id: generateId(), 
      name: '', 
      costPrice: 0, 
      quantity: 0, 
      unitPrice: 0, 
      totalPrice: 0, 
      keepColor: false 
    }
  ]);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [depositPercentage] = useState(60); // Default 60% deposit

  // Calculate order summary using the custom hook
  const orderSummary = useOrderCalculations(sizeCards, depositPercentage);

  // Notify parent component when summary changes
  React.useEffect(() => {
    if (props.onSummaryChange) {
      props.onSummaryChange(orderSummary);
    }
  }, [orderSummary, props.onSummaryChange]);

  useImperativeHandle(ref, () => ({
    clearFields: () => {
      setSizeCards([{ 
        id: generateId(), 
        name: '', 
        costPrice: 0, 
        quantity: 0, 
        unitPrice: 0, 
        totalPrice: 0, 
        keepColor: false 
      }]);
    },
    getData: () => {
      const filteredItems = sizeCards
        .filter(card => card.name && card.quantity && parseInt(card.quantity) > 0);
      
      console.log('PrintArea getData called:', {
        totalCards: sizeCards.length,
        filteredItems: filteredItems.length,
        sizeCards: sizeCards,
        orderSummary: orderSummary
      });
      
      return {
        // Array of size items following the exact structure
        sizes: filteredItems.map(card => ({
          id: card.id,
          name: card.name,                    // Size name
          costPrice: parseFloat(card.costPrice) || 0,  // Cost per piece
          quantity: parseInt(card.quantity) || 0,      // Number of pieces
          unitPrice: parseFloat(card.unitPrice) || 0,  // costPrice × quantity
          totalPrice: parseFloat(card.totalPrice) || 0 // Same as unitPrice
        })),
        // Complete order summary following the architecture
        summary: {
          totalQuantity: orderSummary.totalQuantity,        // Total pieces across all sizes
          totalAmount: orderSummary.totalAmount,            // Total order value
          totalCost: orderSummary.totalCost,                // Total cost (same as totalAmount)
          averageUnitPrice: orderSummary.averageUnitPrice,  // Average unit price across sizes
          depositAmount: orderSummary.depositAmount,        // Deposit amount
          remainingBalance: orderSummary.remainingBalance,  // Remaining balance
          estimatedTotal: orderSummary.estimatedTotal       // Formatted total amount
        },
        // Legacy items format for backward compatibility
        items: filteredItems.map(card => ({
          product_name: card.name ? `${card.name} Size Item` : 'Size Item',
          size: card.name || '',
          quantity: parseInt(card.quantity) || 0,
          price: parseFloat(card.totalPrice) || 0,
          costPrice: parseFloat(card.costPrice) || 0,
          color: card.keepColor ? 'Custom Color' : ''
        })),
        notes: ''
      };
    }
  }));

  const addSizeCard = () => {
    const newCard = {
      id: generateId(),
      name: '', 
      costPrice: 0,
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
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
    setSizeCards(sizeCards.map(card => {
      if (card.id === id) {
        const updatedSize = { ...card, [field]: value };
        
        // Real-time calculation process: Individual Size Calculations
        if (field === "costPrice" || field === "quantity") {
          const cost = parseFloat(field === "costPrice" ? value : updatedSize.costPrice) || 0;
          const qty = parseFloat(field === "quantity" ? value : updatedSize.quantity) || 0;
          
          // Calculate unit price for this size (cost × qty)
          updatedSize.unitPrice = calculateUnitPrice(cost, qty);
          updatedSize.totalPrice = updatedSize.unitPrice; // Same value
        }
        
        return updatedSize;
      }
      return card;
    }));
  };

  const handleSelectSize = (sizeName) => {
    const costPrice = getCostPriceForSize(sizeName, defaultSizePrices);
    
    setSizeCards(sizeCards.map(card => {
      if (card.id === openDropdownId) {
        const updatedCard = { 
          ...card, 
          name: sizeName, 
          costPrice: costPrice 
        };
        
        // Recalculate prices if quantity exists
        if (updatedCard.quantity > 0) {
          const cost = parseFloat(costPrice) || 0;
          const qty = parseFloat(updatedCard.quantity) || 0;
          updatedCard.unitPrice = calculateUnitPrice(cost, qty);
          updatedCard.totalPrice = updatedCard.unitPrice; // Same value
        }
        
        return updatedCard;
      }
      return card;
    }));
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
            {sizeCards.filter(card => card.name && card.quantity > 0).map((card, index) => (
              <View key={card.id} style={styles.tableRow}>
                <Text style={[styles.tableCellText, { flex: 1, fontFamily: 'Poppins_600SemiBold' }]}>{card.name}</Text>
                <Text style={[styles.tableCellText, { flex: 1, textAlign: 'center' }]}>{card.quantity}</Text>
                <Text style={[styles.tableCellText, { flex: 1, textAlign: 'right' }]}>₱{card.totalPrice.toFixed(2)}</Text>
              </View>
            ))}
            {sizeCards.filter(card => card.name && card.quantity > 0).length === 0 && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellText, { flex: 1, textAlign: 'center', fontStyle: 'italic', color: '#9CA3AF' }]}>
                  No sizes added yet
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.subSectionTitle}>Quotation Summary</Text>
          <View style={styles.quotationSummaryBox}>
            <View style={styles.inputGroup}>
              <Text style={styles.labelBold}>60% Downpayment</Text>
              <TextInput 
                style={styles.blueInputFull} 
                editable={false} 
                value={`₱${orderSummary.depositAmount.toFixed(2)}`}
                placeholderTextColor="#6B7280" 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.labelBold}>40% Balance (Upon Delivery/Pickup)</Text>
              <TextInput 
                style={styles.blueInputFull} 
                editable={false} 
                value={`₱${orderSummary.remainingBalance.toFixed(2)}`}
                placeholderTextColor="#6B7280" 
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.labelBold}>Total</Text>
              <TextInput 
                style={styles.blueInputFull} 
                editable={false} 
                value={`₱${orderSummary.totalAmount.toFixed(2)}`}
                placeholderTextColor="#6B7280" 
              />
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
                      <Text style={{ color: card.name ? '#1F2937' : '#9CA3AF', fontSize: 13 }}>
                        {card.name || 'Select Size'}
                      </Text>
                      <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>

                    {openDropdownId === card.id && (
                      <View style={styles.popoverDropdown}>
                        <View> 
                          {sizeOptions.map((sizeOption, idx) => (
                            <TouchableOpacity 
                              key={idx}
                              style={[
                                styles.popoverItem, 
                                idx === sizeOptions.length - 1 ? { borderBottomWidth: 0 } : {}
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
                    placeholder="Select size first" 
                    placeholderTextColor="#6B7280"
                    editable={false}
                    value={card.costPrice > 0 ? `₱${card.costPrice.toFixed(2)}` : ''}
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
                    value={card.quantity > 0 ? String(card.quantity) : ''}
                    onChangeText={(value) => updateSizeCard(card.id, 'quantity', value)}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={styles.labelBold}>Unit Price</Text>
                  <TextInput 
                    style={styles.blueInputFull} 
                    placeholder="Auto calculated" 
                    placeholderTextColor="#6B7280"
                    editable={false}
                    value={card.unitPrice > 0 ? `₱${card.unitPrice.toFixed(2)}` : ''}
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
                <TextInput 
                  style={styles.blueInputFull} 
                  editable={false} 
                  value={String(orderSummary.totalQuantity)}
                  placeholderTextColor="#1F2937" 
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.labelBold}>Average Unit Price</Text>
                <TextInput 
                  style={styles.blueInputFull} 
                  editable={false} 
                  value={`₱${orderSummary.averageUnitPrice.toFixed(2)}`}
                  placeholderTextColor="#1F2937" 
                />
              </View>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={styles.labelBold}>Total Amount</Text>
              <TextInput 
                style={styles.blueInputFull} 
                editable={false} 
                value={`₱${orderSummary.totalAmount.toFixed(2)}`}
                placeholderTextColor="#1F2937" 
              />
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