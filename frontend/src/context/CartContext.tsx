import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev =>
      prev.find(c => c.bookId === item.bookId)
        ? prev.map(c =>
            c.bookId === item.bookId
              ? { ...c, quantity: c.quantity + item.quantity }
              : c
          )
        : [...prev, item]
    );
  };

  const removeFromCart = (bookId: number) => {
    setCart(prev => prev.filter(c => c.bookId !== bookId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
