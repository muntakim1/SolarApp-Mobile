import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CatalogStackParamList } from '../../navigation/CatalogStack';
import { useCartStore } from '../../store/cartStore';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<CatalogStackParamList, 'ProductDetail'>;
  route: RouteProp<CatalogStackParamList, 'ProductDetail'>;
};

export const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { product } = route.params;
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('Added!', `${product.name} has been added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Basic Carousel Substitute using ScrollView */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.image} />
            ))
          ) : (
            <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#888' }}>No Image Available</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.detailsContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₨ {product.price.toLocaleString()}</Text>
            {product.stock_quantity > 0 ? (
              <Text style={styles.inStock}>In Stock</Text>
            ) : (
              <Text style={styles.outOfStock}>Out of Stock</Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || 'No description available for this product.'}</Text>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsContainer}>
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <View key={idx} style={styles.specRow}>
                    <Text style={styles.specKey}>{key}</Text>
                    <Text style={styles.specValue}>{value as string}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.button, product.stock_quantity === 0 && styles.buttonDisabled]} 
          disabled={product.stock_quantity === 0}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 100 },
  imageContainer: { width, height: width },
  image: { width, height: width, resizeMode: 'cover', backgroundColor: '#F5F5F5' },
  detailsContainer: { padding: 20 },
  brand: { fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#FF5A5A' },
  inStock: { fontSize: 12, fontWeight: 'bold', color: '#34C759', backgroundColor: '#E8F8EE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  outOfStock: { fontSize: 12, fontWeight: 'bold', color: '#FF3B30', backgroundColor: '#FFEBEA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12, width: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginTop: 15, marginBottom: 10 },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
  specsContainer: { marginTop: 5, backgroundColor: '#F9F9F9', borderRadius: 8, overflow: 'hidden' },
  specRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  specKey: { flex: 1, fontSize: 13, color: '#555', fontWeight: '500' },
  specValue: { flex: 1, fontSize: 13, color: '#1A1A2E', fontWeight: '600', textAlign: 'right' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 10 },
  button: { backgroundColor: '#FF5A5A', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#FFC8C8' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
