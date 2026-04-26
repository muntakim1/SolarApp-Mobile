import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useWishlistStore } from '../../store/wishlistStore';
import { useComparisonStore } from '../../store/comparisonStore';
import { productService as productSvc, Product } from '../../services/productService';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

type ComparisonScreenProps = NativeStackScreenProps<any, 'Comparison'>;

/**
 * Product Comparison Screen
 * Side-by-side comparison of up to 3 products
 */
export const ComparisonScreen: React.FC<ComparisonScreenProps> = ({ navigation }) => {
  const comparisonIds = useComparisonStore((state) => state.getComparison());
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);

  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: `Compare (${comparisonIds.length}/3)`,
    });
  }, [comparisonIds.length, navigation]);

  useEffect(() => {
    loadComparisonProducts();
  }, [comparisonIds]);

  const loadComparisonProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productSvc.getProducts();
      const filtered = allProducts.filter((p) => comparisonIds.includes(p.id));
      setProducts(filtered);
    } catch (error) {
      console.warn('Error loading comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (comparisonIds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="compare" size={64} color={colors.primary} />
        <Text style={styles.emptyTitle}>No products to compare</Text>
        <Text style={styles.emptySubtitle}>
          Select up to 3 products to compare specifications
        </Text>
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.navigate('Catalog')}
        >
          <Text style={styles.continueShoppingText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {products.map((product) => (
          <ComparisonColumn
            key={product.id}
            product={product}
            onRemove={() => removeFromComparison(product.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Individual comparison column
 */
const ComparisonColumn: React.FC<{ product: Product; onRemove: () => void }> = ({
  product,
  onRemove,
}) => (
  <View style={styles.column}>
    {/* Remove Button */}
    <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
      <MaterialIcons name="close" size={20} color={colors.error} />
    </TouchableOpacity>

    {/* Product Image */}
    <Image
      source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }}
      style={styles.columnImage}
    />

    {/* Product Name */}
    <View style={styles.columnInfo}>
      <Text style={styles.columnBrand}>{product.brand}</Text>
      <Text style={styles.columnName} numberOfLines={2}>
        {product.name}
      </Text>
    </View>

    {/* Price */}
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>Price</Text>
      <Text style={styles.specValuePrice}>₨ {product.price.toLocaleString()}</Text>
    </View>

    {/* Stock */}
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>Stock</Text>
      <Text
        style={[
          styles.specValue,
          { color: product.stock_quantity > 0 ? colors.success : colors.error },
        ]}
      >
        {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
      </Text>
    </View>

    {/* Specifications */}
    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
      <View key={key} style={styles.specRow}>
        <Text style={styles.specLabel}>{key}</Text>
        <Text style={styles.specValue}>{String(value)}</Text>
      </View>
    ))}

    {/* Add to Cart */}
    <TouchableOpacity
      style={[styles.addToCartBtn, product.stock_quantity === 0 && styles.disabled]}
      disabled={product.stock_quantity === 0}
    >
      <Text style={styles.addToCartText}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },
  horizontalScroll: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  column: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
    backgroundColor: colors.light_gray,
    borderRadius: 20,
  },
  columnImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 24,
  },
  columnInfo: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  columnBrand: {
    ...Typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  columnName: {
    ...Typography.button,
    color: colors.dark,
    fontWeight: 'bold',
  },
  specRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light_gray,
  },
  specLabel: {
    ...Typography.caption,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  specValue: {
    ...Typography.body,
    color: colors.dark,
  },
  specValuePrice: {
    ...Typography.sectionHeading,
    color: colors.primary,
    fontWeight: 'bold',
  },
  addToCartBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addToCartText: {
    ...Typography.button,
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.light_gray,
  },
  emptyTitle: {
    ...Typography.screenTitle,
    color: colors.dark,
    marginTop: 16,
  },
  emptySubtitle: {
    ...Typography.body,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  continueShopping: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  continueShoppingText: {
    ...Typography.button,
    color: '#fff',
  },
});
