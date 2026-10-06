import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminRoute from './components/AdminRoute';
import UserListPage from './pages/UserListPage';
import ProductListPage from './pages/ProductListPage';
import OrderListPage from './pages/OrderListPage';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/userlist" element={<UserListPage />} />
            <Route path="/admin/productlist" element={<ProductListPage />} />
            <Route path="/admin/orderlist" element={<OrderListPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </Router>
  );
}

export default App;
