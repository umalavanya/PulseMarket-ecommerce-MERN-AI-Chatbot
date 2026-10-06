import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import Rating from './Rating';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      })
    );
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-img-wrapper">
        <span className="product-category-tag">{product.category}</span>
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
      </Link>

      <div className="product-card-body">
        <span className="product-brand">{product.brand}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>

        <Rating value={product.rating} text={`(${product.numReviews})`} />

        <div className="product-card-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm"
            title="Add to Shopping Cart"
            disabled={product.countInStock === 0}
          >
            <ShoppingCart size={16} />
            <span>{product.countInStock > 0 ? 'Add' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
