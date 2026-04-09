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

export const productService = {
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
  }
};
