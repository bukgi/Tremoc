import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ManagerRoute from './components/auth/ManagerRoute';
import ManagerPage from './pages/ManagerPage';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import StoryPage from './pages/StoryPage';
import LookbookPage from './pages/LookbookPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Các trang riêng biệt */}
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <ManagerRoute>
                  <ManagerPage />
                </ManagerRoute>
              }
            />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
