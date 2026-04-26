import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CatalogStackParamList } from '../../navigation/CatalogStack';
import { productService as productSvc, Product } from '../../services/productService';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

type Props = {
  navigation: NativeStackNavigationProp<CatalogStackParamList, 'CatalogList'>;
  route?: any;
};

type SortOption = 'newest' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'price_asc', label: 'Price ↑' },
  { key: 'price_desc', label: 'Price ↓' },
];

export const CatalogScreen: React.FC<Props> = ({ navigation, route }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    route?.params?.categorySlug || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productData, catData] = await Promise.all([
        productSvc.getProducts(),
        productSvc.getCategories(),
      ]);
      setProducts(productData);
      setCategories(catData as { id: string; name: string; slug: string }[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique brands from products
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    // Brand filter
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Already sorted by created_at desc from API
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, categories]);

  const getStockBadge = (qty: number) => {
    if (qty === 0) return { text: 'Out of Stock', bg: colors.errorLight, color: colors.error };
    if (qty < 5) return { text: 'Low Stock', bg: colors.warningLight, color: colors.warning };
    return { text: 'In Stock', bg: colors.successLight, color: colors.success };
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const stockBadge = getStockBadge(item.stock_quantity);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        {/* Stock Badge */}
        <View style={[styles.stockBadge, { backgroundColor: stockBadge.bg }]}>
          <Text style={[styles.stockBadgeText, { color: stockBadge.color }]}>
            {stockBadge.text}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>₨ {item.price.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color={colors.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands, or SKU..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray500}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={16} color={colors.gray300} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContainer}
      >
        <TouchableOpacity
          style={[styles.tab, !selectedCategory && styles.tabActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.tabText, !selectedCategory && styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, selectedCategory === cat.slug && styles.tabActive]}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)
            }
          >
            <Text
              style={[styles.tabText, selectedCategory === cat.slug && styles.tabTextActive]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Brand Filter + Sort Row */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand}
              style={[styles.brandChip, selectedBrand === brand && styles.brandChipActive]}
              onPress={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
            >
              <Text
                style={[
                  styles.brandChipText,
                  selectedBrand === brand && styles.brandChipTextActive,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Sort Toggle */}
        <View style={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortBtn, sortBy === opt.key && styles.sortBtnActive]}
              onPress={() => setSortBy(opt.key)}
            >
              <Text
                style={[styles.sortBtnText, sortBy === opt.key && styles.sortBtnTextActive]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
        {(selectedCategory || selectedBrand) && (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(null);
              setSelectedBrand(null);
            }}
          >
            <Text style={styles.clearFilters}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Product Grid */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="search" size={48} color={colors.primary} style={{ opacity: 0.5 }} />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters or search</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: 15,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 48, fontSize: 15, color: colors.dark },

  // Tabs
  tabsScroll: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tabsContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.secondary, // Black text on yellow for contrast
  },

  // Brand Chips & Sort
  filterRow: {
    paddingHorizontal: 15,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginRight: 8,
  },
  brandChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  brandChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray700,
  },
  brandChipTextActive: {
    color: colors.primary,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 4,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortBtnActive: {
    backgroundColor: colors.dark,
  },
  sortBtnText: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: colors.white,
  },

  // Results bar
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  resultsText: { fontSize: 12, color: colors.gray500 },
  clearFilters: { fontSize: 12, color: colors.primary, fontWeight: '600' },

  // Grid
  list: { paddingHorizontal: 10, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.white,
    width: '48%',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray100,
    resizeMode: 'cover',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  cardBody: { padding: 12 },
  brand: {
    fontSize: 11,
    color: colors.gray500,
    marginBottom: 3,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    height: 36,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 4,
    textAlign: 'center',
  },
});
