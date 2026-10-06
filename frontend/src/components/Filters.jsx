import React from 'react';
import { Filter, RotateCcw, DollarSign, ArrowUpDown } from 'lucide-react';

const Filters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onResetFilters,
}) => {
  return (
    <div className="filter-card">
      <div className="filter-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="filter-icon-badge">
            <Filter size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Filter & Sort Catalog</span>
        </div>
        {(selectedCategory !== 'All' || minPrice || maxPrice || sortBy !== 'newest') && (
          <button
            onClick={onResetFilters}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="filter-section-label">SELECT CATEGORY</label>
        <div className="category-pills">
          <button
            className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => onSelectCategory('All')}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="minPriceInput">
            <DollarSign size={13} style={{ display: 'inline', marginRight: '2px' }} />
            MIN PRICE
          </label>
          <div className="filter-input-wrapper">
            <span className="input-prefix">$</span>
            <input
              id="minPriceInput"
              type="number"
              placeholder="0"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="maxPriceInput">
            <DollarSign size={13} style={{ display: 'inline', marginRight: '2px' }} />
            MAX PRICE
          </label>
          <div className="filter-input-wrapper">
            <span className="input-prefix">$</span>
            <input
              id="maxPriceInput"
              type="number"
              placeholder="2000"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBySelect">
            <ArrowUpDown size={13} style={{ display: 'inline', marginRight: '2px' }} />
            SORT BY
          </label>
          <select id="sortBySelect" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
