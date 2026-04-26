import { supabase } from './supabaseClient';

export interface Product {
  id: string;
  category_id: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  created_at: string;
}

const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Product[];
  },

  async getProductsPaginated(params: {
    page: number;
    pageSize: number;
    categoryId?: string | null;
    brand?: string | null;
    search?: string | null;
    sortBy?: 'newest' | 'price_asc' | 'price_desc';
  }) {
    const { page, pageSize, categoryId, brand, search, sortBy = 'newest' } = params;

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (categoryId) query = query.eq('category_id', categoryId);
    if (brand) query = query.eq('brand', brand);
    if (search?.trim()) {
      query = query.or(
        `name.ilike.%${search.trim()}%,brand.ilike.%${search.trim()}%,sku.ilike.%${search.trim()}%`
      );
    }

    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await query.range(from, to);

    if (error) throw new Error(error.message);
    return data as Product[];
  },

  async getBrands() {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (error) throw new Error(error.message);
    return [...new Set((data as { brand: string }[]).map((p) => p.brand))].sort();
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(error.message);
    return data;
  },
};

export { productService };
export default productService;
