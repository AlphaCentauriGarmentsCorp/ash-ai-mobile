import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  
  return {
    containerPadding: isSmallDevice ? 12 : 16,
    titleSize: isSmallDevice ? 16 : 18,
    subtitleSize: isSmallDevice ? 12 : 14,
    sectionTitleSize: isSmallDevice ? 14 : 16,
    priceSize: isSmallDevice ? 14 : 16,
    descriptionSize: isSmallDevice ? 11 : 12,
    statusSize: isSmallDevice ? 9 : 10,
    stockLabelSize: isSmallDevice ? 11 : 12,
    stockValueSize: isSmallDevice ? 14 : 16,
    iconSize: isSmallDevice ? 20 : 24,
    productImageSize: isSmallDevice ? 36 : 40,
    itemPadding: isSmallDevice ? 10 : 12,
    borderRadius: isSmallDevice ? 10 : 12,
    isSmallDevice,
    isMediumDevice,
  };
};

const sizes = getResponsiveSizes();

interface ProductItemProps {
  price: string;
  description: string;
  stock: number;
  status: 'available' | 'low' | 'urgent';
  statusColor: string;
}

function ProductItem({ price, description, stock, status, statusColor }: ProductItemProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return 'checkmark-circle';
      case 'low':
        return 'warning';
      case 'urgent':
        return 'alert-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return 'Available stock';
      case 'low':
        return 'Stock running low';
      case 'urgent':
        return 'Urgent decline clearance this week';
      default:
        return 'Available stock';
    }
  };

  return (
    <View style={styles.productItem}>
      <View style={styles.productLeft}>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        <View style={styles.productImage}>
          <Ionicons name="shirt-outline" size={sizes.iconSize} color="#666" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productPrice}>{price}</Text>
          <Text style={styles.productDescription}>{description}</Text>
          <View style={styles.statusRow}>
            <Ionicons name={getStatusIcon()} size={sizes.isSmallDevice ? 11 : 12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productRight}>
        <Text style={styles.stockLabel}>Stock left</Text>
        <Text style={styles.stockValue}>{stock}</Text>
      </View>
    </View>
  );
}

interface SorberesItemProps {
  type: string;
  orders: number;
}

function SorberesItem({ type, orders }: SorberesItemProps) {
  return (
    <View style={styles.sorberesItem}>
      <Text style={styles.sorberesType}>{type}</Text>
      <Text style={styles.sorberesOrders}>{orders} orders</Text>
    </View>
  );
}

export default function TopSellingProducts() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Selling Products</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View › </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Our best products for last 7 days</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reefer</Text>
        <ProductItem
          price="₱2,400"
          description="Reefer clothing - Dark Days (Black)"
          stock={21}
          status="available"
          statusColor="#4caf50"
        />
        <ProductItem
          price="₱2,400"
          description="Reefer clothing - Dark Days (Black)"
          stock={21}
          status="low"
          statusColor="#ff9800"
        />
        <ProductItem
          price="₱2,400"
          description="Reefer clothing - Dark Days (Black)"
          stock={21}
          status="urgent"
          statusColor="#f44336"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sorbetes</Text>
        <Text style={styles.sorberesSubtitle}>Most requested apparel types</Text>
        <SorberesItem type="T-shirt" orders={200} />
        <SorberesItem type="Polo Shirt" orders={200} />
        <SorberesItem type="Hoodie" orders={200} />
        
        <Text style={styles.sorberesSubtitle}>Most requested fabric types</Text>
        <SorberesItem type="Cotton" orders={200} />
        <SorberesItem type="Dri-fit" orders={200} />
        <SorberesItem type="Dry fit" orders={200} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd',
    borderRadius: sizes.borderRadius,
    padding: sizes.containerPadding,
    marginVertical: sizes.isSmallDevice ? 6 : 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: sizes.titleSize,
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: sizes.subtitleSize,
    color: '#666',
  },
  subtitle: {
    fontSize: sizes.subtitleSize,
    color: '#666',
    marginBottom: sizes.isSmallDevice ? 12 : 16,
  },
  section: {
    marginBottom: sizes.isSmallDevice ? 16 : 20,
  },
  sectionTitle: {
    fontSize: sizes.sectionTitleSize,
    fontWeight: '600',
    color: '#333',
    marginBottom: sizes.isSmallDevice ? 10 : 12,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: sizes.isSmallDevice ? 6 : 8,
    padding: sizes.itemPadding,
    marginBottom: sizes.isSmallDevice ? 6 : 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: sizes.isSmallDevice ? 6 : 8,
    height: sizes.isSmallDevice ? 6 : 8,
    borderRadius: sizes.isSmallDevice ? 3 : 4,
    marginRight: sizes.isSmallDevice ? 10 : 12,
  },
  productImage: {
    width: sizes.productImageSize,
    height: sizes.productImageSize,
    backgroundColor: '#f5f5f5',
    borderRadius: sizes.isSmallDevice ? 6 : 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.isSmallDevice ? 10 : 12,
  },
  productInfo: {
    flex: 1,
  },
  productPrice: {
    fontSize: sizes.priceSize,
    fontWeight: '600',
    color: '#333',
  },
  productDescription: {
    fontSize: sizes.descriptionSize,
    color: '#666',
    marginVertical: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: sizes.statusSize,
    marginLeft: 4,
  },
  productRight: {
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: sizes.stockLabelSize,
    color: '#666',
  },
  stockValue: {
    fontSize: sizes.stockValueSize,
    fontWeight: '600',
    color: '#333',
  },
  sorberesSubtitle: {
    fontSize: sizes.subtitleSize,
    fontWeight: '500',
    color: '#333',
    marginBottom: sizes.isSmallDevice ? 6 : 8,
    marginTop: sizes.isSmallDevice ? 10 : 12,
  },
  sorberesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.isSmallDevice ? 6 : 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sorberesType: {
    fontSize: sizes.subtitleSize,
    color: '#666',
  },
  sorberesOrders: {
    fontSize: 14,
    color: '#666',
  },
});