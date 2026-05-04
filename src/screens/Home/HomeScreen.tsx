import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { Logo } from '../../components/Logo';
import { productService as productSvc, Product } from '../../services/productService';
import { EventBus } from '../../utils/EventBus';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Solar Panels', slug: 'solar-panels', icon: 'sun-o' as const, color: colors.primary },
  { name: 'Inverters', slug: 'inverters', icon: 'bolt' as const, color: colors.secondary },
  { name: 'Batteries', slug: 'batteries', icon: 'battery-full' as const, color: colors.success },
  { name: 'VED', slug: 'ved', icon: 'plug' as const, color: colors.info },
];

const QUICK_LINKS = [
  { label: 'My Orders', icon: 'list-alt' as const, tab: 'Orders', color: colors.primary },
  { label: 'Get a Quote', icon: 'clipboard' as const, tab: 'Profile', screen: 'SurveyRequest', color: colors.secondary },
  { label: 'Support', icon: 'life-ring' as const, tab: 'Profile', screen: 'Helpline', color: colors.success },
  { label: 'About', icon: 'info-circle' as const, tab: 'Profile', screen: 'About', color: colors.accent },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
    const sub = EventBus.addListener('products_updated', loadFeatured);
    return () => {
      sub.remove();
    };
  }, []);

  const loadFeatured = async () => {
    try {
      const products = await productSvc.getProducts();
      setFeaturedProducts(products.slice(0, 8));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCategory = (slug: string) => {
    navigation.navigate('Catalog', {
      screen: 'CatalogList',
      params: { categorySlug: slug },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay}>
          <Logo size={120} />
          <Text style={styles.heroTagline}>Power Your Future</Text>
          <Text style={styles.heroSubtitle}>
            Premium solar solutions for homes, businesses, and industries
          </Text>
          <TouchableOpacity
            style={styles.heroCTA}
            onPress={() =>
              navigation.navigate('Profile', {
                screen: 'SurveyRequest',
              })
            }
          >
            <Text style={styles.heroCTAText}>Get a Free Quote</Text>
            <FontAwesome name="arrow-right" size={14} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.slug}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => navigateToCategory(cat.slug)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                <FontAwesome name={cat.icon} size={24} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
        ) : (
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productScroll}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('Catalog', {
                    screen: 'ProductDetail',
                    params: { product: item },
                  })
                }
              >
                <Image
                  source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
                  style={styles.productImage}
                />
                <View style={styles.productBody}>
                  <Text style={styles.productBrand}>{item.brand}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>₨ {item.price.toLocaleString()}</Text>
                    {item.stock_quantity === 0 && (
                      <View style={styles.oosTag}>
                        <Text style={styles.oosText}>Out of stock</Text>
                      </View>
                    )}
                    {item.stock_quantity > 0 && item.stock_quantity < 5 && (
                      <View style={styles.lowStockTag}>
                        <Text style={styles.lowStockText}>Low stock</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.quickLinksRow}>
          {QUICK_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              style={styles.quickLinkCard}
              activeOpacity={0.8}
              onPress={() => {
                if (link.screen) {
                  navigation.navigate(link.tab, { screen: link.screen });
                } else {
                  navigation.navigate(link.tab);
                }
              }}
            >
              <View style={[styles.quickLinkIcon, { backgroundColor: link.color + '15' }]}>
                <FontAwesome name={link.icon} size={20} color={link.color} />
              </View>
              <Text style={styles.quickLinkLabel}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Brand Footer */}
      <View style={styles.brandFooter}>
        <FontAwesome name="sun-o" size={20} color={colors.primary} />
        <Text style={styles.brandFooterText}>SolventZ Solar Solutions</Text>
        <Text style={styles.brandFooterSub}>Powering Pakistan's sustainable future</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Hero
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  heroOverlay: { alignItems: 'center' },
  heroTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 20,
    opacity: 0.8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.secondary,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 8,
  },
  heroCTAText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Sections
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
    marginBottom: 14,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 32 - 12 * 3) / 4,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },

  // Featured Products
  productScroll: { paddingRight: 16 },
  productCard: {
    width: 160,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.gray100,
    resizeMode: 'cover',
  },
  productBody: { padding: 10 },
  productBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray500,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark,
    height: 36,
    marginBottom: 6,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  oosTag: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  oosText: { fontSize: 9, color: colors.error, fontWeight: '700' },
  lowStockTag: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowStockText: { fontSize: 9, color: colors.warning, fontWeight: '700' },

  // Quick Links
  quickLinksRow: { flexDirection: 'row', gap: 12 },
  quickLinkCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  quickLinkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLinkLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },

  // Brand Footer
  brandFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 12,
  },
  brandFooterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 8,
  },
  brandFooterSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
    marginBottom: 16,
  },
});
