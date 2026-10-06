import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fallback sample products if server DB hasn't been seeded yet
const fallbackProducts = [
  {
    _id: '1',
    name: 'Aura Sound Pro Wireless Noise-Canceling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    description: 'Immerse yourself in pure studio-grade acoustics with active noise cancellation, 40-hour battery life, and ultra-soft memory foam ear cushions.',
    brand: 'AuraAudio',
    category: 'Audio',
    price: 249.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 42,
  },
  {
    _id: '2',
    name: 'Pulse X Ultra AMOLED Smartwatch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    description: 'Track your health, ECG, pulse, fitness goals, and notifications with a vibrant 1.9-inch HD touch screen.',
    brand: 'PulseTech',
    category: 'Wearables',
    price: 189.50,
    countInStock: 8,
    rating: 4.6,
    numReviews: 29,
  },
  {
    _id: '3',
    name: 'ZenBook Pro Ultra Slim Laptop 15.6"',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    description: 'Powered by 13th Gen Intel i7, 32GB DDR5 RAM, 1TB NVMe SSD, and 4K OLED HDR display.',
    brand: 'ZenSys',
    category: 'Electronics',
    price: 1299.00,
    countInStock: 5,
    rating: 4.9,
    numReviews: 54,
  },
  {
    _id: '4',
    name: 'HyperGamer Mechanical RGB Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    description: 'Tactile mechanical switches, customizable per-key RGB illumination, aircraft-grade aluminum alloy body.',
    brand: 'HyperGear',
    category: 'Electronics',
    price: 89.99,
    countInStock: 20,
    rating: 4.5,
    numReviews: 18,
  },
  {
    _id: '5',
    name: 'AeroGlide Running Performance Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    description: 'Ultra-lightweight mesh upper combined with responsive nitrogen-infused foam cushioning.',
    brand: 'AeroStep',
    category: 'Footwear',
    price: 120.00,
    countInStock: 12,
    rating: 4.7,
    numReviews: 31,
  },
  {
    _id: '6',
    name: 'Nomad Minimalist Leather Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description: 'Handcrafted full-grain leather backpack featuring a 16-inch padded laptop compartment.',
    brand: 'NomadCraft',
    category: 'Accessories',
    price: 165.00,
    countInStock: 10,
    rating: 4.8,
    numReviews: 22,
  },
];

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ keyword = '', category = 'All', minPrice = '', maxPrice = '', sortBy = 'newest', pageNumber = 1, pageSize = 12 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/products?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return data;
    } catch (error) {
      // Return fallback data locally if backend API is offline or not configured
      let filtered = [...fallbackProducts];
      if (keyword) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
      }
      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (minPrice) {
        filtered = filtered.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(maxPrice));
      }
      const categories = Array.from(new Set(fallbackProducts.map(p => p.category)));
      return {
        products: filtered,
        page: 1,
        pages: 1,
        totalProducts: filtered.length,
        categories,
      };
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      const localProduct = fallbackProducts.find(p => p._id === id);
      if (localProduct) return localProduct;
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: ['Audio', 'Wearables', 'Electronics', 'Footwear', 'Accessories'],
    page: 1,
    pages: 1,
    totalProducts: 0,
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalProducts = action.payload.totalProducts;
        if (action.payload.categories && action.payload.categories.length > 0) {
          state.categories = action.payload.categories;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
