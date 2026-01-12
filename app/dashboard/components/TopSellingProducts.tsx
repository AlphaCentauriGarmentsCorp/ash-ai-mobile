import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <Ionicons name="shirt-outline" size={24} color="#666" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productPrice}>{price}</Text>
          <Text style={styles.productDescription}>{description}</Text>
          <View style={styles.statusRow}>
            <Ionicons name={getStatusIcon()} size={12} color={statusColor} />
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
          <Text style={styles.viewAll}>View full analysis ›</Text>
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#666',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  productImage: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    marginLeft: 4,
  },
  productRight: {
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: 12,
    color: '#666',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sorberesSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  sorberesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sorberesType: {
    fontSize: 14,
    color: '#666',
  },
  sorberesOrders: {
    fontSize: 14,
    color: '#666',
  },
});