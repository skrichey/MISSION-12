import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';


function CartSummary() {
  const navigate = useNavigate();
  const { cart }: { cart: CartItem[] } = useCart();
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div
      className="position-fixed top-0 end-0 bg-light p-2 rounded shadow"
      style={{ cursor: 'pointer', zIndex: 1000 }}
      onClick={() => navigate('/cart')}
    >
      🛒 <strong>${total.toFixed(2)}</strong>
    </div>
  );
}

export default CartSummary;