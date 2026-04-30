import Header from '@/layouts/Header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import quotationApi from '../../api/quotation';

export default function AllQuotationScreen() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from API
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await quotationApi.index();
      setQuotations(res.data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) =>
      item.client_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [quotations, search]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ TOP HEADER */}
      <Header />

      <View style={styles.topTitleBar}>
    <View style={styles.topTitleContent}>
      <View style={styles.titleIconCircle}>
        <Ionicons name="document-text-outline" size={22} color="#0D253F" />
      </View>
      <Text style={styles.topTitleText}>All Quotations</Text>
    </View>
  </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ✅ ADD BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/quotation' as any)}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add Quotation</Text>
        </TouchableOpacity>

        {/* ✅ SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search quotations"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ✅ LIST */}
        {loading ? (
          <Text>Loading...</Text>
        ) : filteredQuotations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No quotations found</Text>
          </View>
        ) : (
          filteredQuotations.map((item: any) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.quotation_no || 'No Code'}
              </Text>

              <Text style={styles.info}>
                Client: {item.client_name}
              </Text>

              <Text style={styles.info}>
                Email: {item.client_email}
              </Text>

              <Text style={styles.info}>
                Brand: {item.brand || '-'}
              </Text>

              <Text style={styles.info}>
                Amount: ₱{Number(item.total_amount || 0).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#0D253F',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  searchBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  topTitleBar: {
  backgroundColor: '#fff',
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
},
topTitleContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
titleIconCircle: {
  width: 42,
  height: 42,
  borderRadius: 21,
  borderWidth: 2,
  borderColor: '#64748B',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
topTitleText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#0F172A',
},
});