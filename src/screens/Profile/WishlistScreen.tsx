import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useWishlistStore } from '../../store/wishlistStore';
import { useComparisonStore } from '../../store/comparisonStore';
import { productService as productSvc, Product } from '../../services/productService';
import { colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

type WishlistScreenProps = NativeStackScreenProps<any, 'Wishlist'>;

/**
 * Wishlist Screen - Display saved favorite products
 */
export const WishlistScreen: React.FC<WishlistScreenProps> = ({ navigation }) => {
  const wishlistItems = useWishlistStore((state) => state.getWishlist());
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToComparison = useComparisonStore((state) => state.addToComparison);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: `Wishlist (${wishlistItems.length})`,
    });
  }, [wishlistItems.length, navigation]);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlistItems]);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productSvc.getProducts();
      const filtered = allProducts.filter((p) => wishlistItems.includes(p.id));
      setProducts(filtered);
    } catch (error) {
      console.warn('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    navigation.navigate('Cart', {
      screen: 'CartScreen',
      params: { addProduct: product },
    });
  };

  const handleCompare = (product: Product) => {
    const added = addToComparison(product.id);
    if (added) {
      // Show success toast
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="favorite-border" size={64} color={colors.primary} />
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptySubtitle}>
          Save your favorite products to view them later
        </Text>
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.navigate('Catalog')}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <WishlistItem
            product={item}
            onRemove={() => handleRemove(item.id)}
            onAddToCart={() => handleAddToCart(item)}
            onCompare={() => handleCompare(item)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={16}
      />
    </View>
  );
};

/**
 * Individual wishlist item component
 */
const WishlistItem: React.FC<{
  product: Product;
  onRemove: () => void;
  onAddToCart: () => void;
  onCompare: () => void;
  index: number;
}> = ({ product, onRemove, onAddToCart, onCompare, index }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <View style={styles.itemCard}>
      {/* Product Image */}
      <Image
        source={{ uri: product.images?.[0] || 'https://via.placeholder.com/120' }}
        style={styles.productImage}
      />

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>₨ {product.price.toLocaleString()}</Text>

        {/* Stock Status */}
        <View style={styles.stockStatus}>
          {product.stock_quantity === 0 ? (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          ) : product.stock_quantity < 5 ? (
            <View style={styles.lowStock}>
              <Text style={styles.lowStockText}>Only {product.stock_quantity} left</Text>
            </View>
          ) : (
            <View style={styles.inStock}>
              <Text style={styles.inStockText}>In Stock</Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onRemove}>
          <MaterialIcons name="delete" size={20} color={colors.error} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onCompare}
          disabled={product.stock_quantity === 0}
        >
          <MaterialIcons name="compare" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addToCartBtn, product.stock_quantity === 0 && styles.disabled]}
          onPress={onAddToCart}
          disabled={product.stock_quantity === 0}
        >
          <FontAwesome name="shopping-cart" size={14} color="#fff" />
          <Text style={styles.addToCartText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productBrand: {
    ...Typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  productName: {
    ...Typography.body,
    color: colors.dark,
    fontWeight: '600',
  },
  productPrice: {
    ...Typography.sectionHeading,
    color: colors.primary,
  },
  stockStatus: {
    marginTop: 8,
  },
  outOfStock: {
    backgroundColor: '#ffe0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  outOfStockText: {
    ...Typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  lowStock: {
    backgroundColor: '#fff4e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  lowStockText: {
    ...Typography.caption,
    color: '#ff9800',
    fontWeight: '600',
  },
  inStock: {
    backgroundColor: '#e0f2e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  inStockText: {
    ...Typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  actions: {
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginVertical: 4,
  },
  addToCartBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginVertical: 4,
    gap: 4,
    alignItems: 'center',
  },
  addToCartText: {
    ...Typography.caption,
    color: '#fff',
    fontWeight: '600',
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
