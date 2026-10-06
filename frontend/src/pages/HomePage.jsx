import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Sparkles } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get('keyword') || '';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { products, categories, page, pages, totalProducts, loading, error } =
    useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: urlKeyword,
        category: selectedCategory,
        minPrice,
        maxPrice,
        sortBy,
        pageNumber,
        pageSize,
      })
    );
  }, [dispatch, urlKeyword, selectedCategory, minPrice, maxPrice, sortBy, pageNumber, pageSize]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPageNumber(1);
    if (urlKeyword) {
      setSearchParams({});
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      {!urlKeyword && (
        <div className="hero-banner">
          <span className="hero-tag">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            New Season Arrival 2026
          </span>
          <h1 className="hero-title">
            Elevate Your Everyday Tech & Style Experience
          </h1>
          <p className="hero-desc">
            Explore studio audio gear, wearable AMOLED smartwatches, creator laptops, and performance footwear crafted for maximum comfort and style.
          </p>
        </div>
      )}

      {/* Page Title / Search Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2>
          {urlKeyword ? `Search Results for "${urlKeyword}"` : 'Discover Catalog'}
        </h2>
        <span className="text-muted" style={{ fontWeight: 600 }}>
          {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'} Available
        </span>
      </div>

      {/* Filters Component */}
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setPageNumber(1);
        }}
        minPrice={minPrice}
        setMinPrice={(val) => {
          setMinPrice(val);
          setPageNumber(1);
        }}
        maxPrice={maxPrice}
        setMaxPrice={(val) => {
          setMaxPrice(val);
          setPageNumber(1);
        }}
        sortBy={sortBy}
        setSortBy={(val) => {
          setSortBy(val);
          setPageNumber(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Content Area */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message variant="info">
          No products match your search or filter criteria. Try clearing filters or refining your search keywords.
        </Message>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            pages={pages}
            page={page}
            totalProducts={totalProducts}
            pageSize={pageSize}
            onPageChange={(newPage) => setPageNumber(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPageNumber(1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
