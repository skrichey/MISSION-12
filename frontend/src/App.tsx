import './App.css';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import BooksPage from './pages/BooksPage';
import { Routes, Route } from 'react-router-dom';
import AdminBooksPage from './pages/AdminBooksPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AdminBooksPage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
