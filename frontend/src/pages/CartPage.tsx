import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.bookId}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total:
              </td>
              <td colSpan={2} className="fw-bold">
                ${total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <button className="btn btn-secondary me-2" onClick={() => navigate('/books')}>
          Continue Shopping
        </button>
        <button className="btn btn-success" disabled={cart.length === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;
