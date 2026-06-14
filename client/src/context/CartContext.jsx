import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';

import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  const cartKey = useMemo(() => {
    return user ? `tremoc_cart_${user.id}` : 'tremoc_cart_guest';
  }, [user]);

  const [items, setItems] = useState([]);
  const activeKeyRef = useRef(cartKey);

  // Keep activeKeyRef in sync with cartKey
  useEffect(() => {
    activeKeyRef.current = cartKey;
  }, [cartKey]);

  // Load items when cartKey changes
  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    setItems(saved ? JSON.parse(saved) : []);
  }, [cartKey]);

  // Save items when items change
  useEffect(() => {
    localStorage.setItem(activeKeyRef.current, JSON.stringify(items));
  }, [items]);

  // Trả về null nếu thành công, trả về message lỗi nếu không đủ hàng
  const addToCart = (product, quantity = 1) => {
    if (user?.role === 'Manager') {
      return Promise.resolve({
        success: false,
        message: 'Tài khoản quản lý không thể thực hiện chức năng mua hàng.'
      });
    }
    const maxStock = product.stockQuantity ?? 99;

    return new Promise((resolve) => {
      setItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        const currentQty = existing ? existing.quantity : 0;
        const newQty = currentQty + quantity;

        if (newQty > maxStock) {
          resolve({
            success: false,
            message: maxStock === 0
              ? `Sản phẩm "${product.name}" đã hết hàng.`
              : `Sản phẩm "${product.name}" chỉ còn ${maxStock} chiếc. Bạn đã có ${currentQty} trong giỏ.`
          });
          return prev; // Không thay đổi giỏ hàng
        }

        resolve({ success: true });

        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQty }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity, maxStock = 99) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }
    if (quantity > maxStock) {
      return { success: false, message: `Chỉ còn ${maxStock} sản phẩm trong kho.` };
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    return { success: true };
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};
