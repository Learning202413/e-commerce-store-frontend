import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import '../App.css'; // Conexión a tus estilos globales
import '../estilos.css';

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      setError('Debes iniciar sesión para finalizar tu compra.');
      return;
    }

    setLoading(true);
    try {
      const orderProducts = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const newOrder = await orderService.placeOrder(orderProducts);

      // Guardar el ID para el historial
      if (newOrder && newOrder.id) {
        const savedOrdersStr = localStorage.getItem('my_orders');
        const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
        savedOrders.push(newOrder.id);
        localStorage.setItem('my_orders', JSON.stringify(savedOrders));
      }

      setSuccess('¡Orden procesada con éxito!');
      clearCart();
    } catch (err) {
      if (err.message && err.message.includes('500')) {
        setError('Nuestros servidores están en mantenimiento. Por favor, intenta más tarde.');
      } else {
        setError(err.message || 'Hubo un error al procesar tu orden.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ESTADO 1: Carrito Vacío
  if (cartItems.length === 0 && !success) {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
          <div className="catalog-status empty">
            <ShoppingBag size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestra colección y añade prendas exclusivas a tu carrito.</p>
            <button className="secondary" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
              <ArrowLeft size={18} /> Volver a la Tienda
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>

        <div className="cart-header">
          <h1>Bolsa de Compras</h1>
          {!success && <span className="cart-count">{cartItems.length} artículo(s)</span>}
        </div>

        {/* ESTADO 2: Compra Exitosa */}
        {success ? (
            <div className="catalog-status">
              <CheckCircle2 size={72} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
              <h2>{success}</h2>
              <p>Gracias por tu compra. Te notificaremos cuando tu pedido esté en camino.</p>
              <button onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
                Seguir Comprando
              </button>
            </div>
        ) : (

            /* ESTADO 3: Carrito Activo */
            <div className="cart-layout">

              {/* Columna Izquierda: Lista de Productos */}
              <div className="cart-items-list">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item-card">
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-meta">Cant: {item.quantity}</p>
                      </div>

                      <div className="item-actions">
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                            className="btn-icon remove"
                            onClick={() => removeFromCart(item.id)}
                            title="Eliminar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                ))}
              </div>

              {/* Columna Derecha: Resumen de Orden */}
              <aside className="cart-summary-sidebar">
                <div className="card summary-card">
                  <h3>Resumen de Orden</h3>

                  <div className="summary-row total">
                    <span>Total estimado</span>
                    <span className="total-price">${cartTotal.toFixed(2)}</span>
                  </div>

                  <p className="summary-note">
                    Los gastos de envío y los impuestos se calculan en el siguiente paso.
                  </p>

                  {error && (
                      <div className="storefront-alert flex items-center gap-2" style={{ textAlign: 'left' }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                      </div>
                  )}

                  <button
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={loading}
                  >
                    {loading ? (
                        <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div>
                    ) : (
                        <><CreditCard size={18} /> Pago Seguro</>
                    )}
                  </button>
                </div>
              </aside>

            </div>
        )}
      </div>
  );
};

export default Cart;