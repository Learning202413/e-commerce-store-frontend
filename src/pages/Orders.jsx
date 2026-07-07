import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, ArrowLeft, Star, AlertCircle, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/api';
import '../App.css'; // Conexión a tus estilos globales
import '../estilos.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const savedOrdersStr = localStorage.getItem('my_orders');
        const savedOrderIds = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];

        if (savedOrderIds.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch each order individually
        const orderPromises = savedOrderIds.map(id => orderService.getOrderById(id).catch(e => null));
        const ordersData = await Promise.all(orderPromises);

        // Filter out nulls (failed requests)
        setOrders(ordersData.filter(o => o !== null));
      } catch (err) {
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
        <div className="catalog-status" style={{ minHeight: '80vh' }}>
          <div className="spinner"></div>
        </div>
    );
  }

  return (
      <div className="container orders-container">

        {/* Encabezado de la página */}
        <div className="orders-header">
          <h1>Mis Pedidos</h1>
          <Link to="/" className="secondary btn-small flex items-center gap-2">
            <ArrowLeft size={16} /> Seguir Comprando
          </Link>
        </div>

        {/* Estado: Error */}
        {error ? (
            <div className="catalog-status error">
              <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
              <h3>Inconveniente al cargar</h3>
              <p>{error}</p>
            </div>

            /* Estado: Vacío */
        ) : orders.length === 0 ? (
            <div className="catalog-status empty">
              <ShoppingBag size={56} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
              <h3>Aún no tienes pedidos</h3>
              <p>Tus compras y su estado de envío aparecerán aquí.</p>
              <Link to="/" className="add-to-cart-btn" style={{ maxWidth: '300px', marginTop: '2rem', textDecoration: 'none' }}>
                Explorar Colección
              </Link>
            </div>

            /* Estado: Lista de Pedidos */
        ) : (
            <div className="orders-list">
              {orders.map((order, index) => (
                  <div key={order.id || index} className="order-card">

                    {/* Cabecera del Pedido */}
                    <div className="order-card-header">
                      <div className="order-info">
                        <h3>Pedido #{order.id}</h3>
                        <span className="order-date">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Fecha no disponible'}
                  </span>
                      </div>

                      <div className="order-status-badge">
                  <span className={`badge ${order.status === 'APPROVED' || order.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                    {order.status === 'APPROVED' || order.status === 'COMPLETED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {order.status || 'PROCESANDO'}
                  </span>
                      </div>
                    </div>

                    {/* Lista de Artículos del Pedido */}
                    <div className="order-items-wrapper">
                      <h4 className="items-title">Artículos en este pedido:</h4>
                      <div className="order-items-list">
                        {order.products && order.products.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <div className="item-reference">
                                <span className="ref-label">Ref. Prenda #{item.productId}</span>
                                <span className="item-qty">Cantidad: <strong>{item.quantity}</strong></span>
                              </div>

                              <Link
                                  to={`/product/${item.productId}?order=${order.id}`}
                                  className="rate-product-btn"
                                  title="Calificar esta prenda"
                              >
                                <Star size={16} /> <span>Calificar</span>
                              </Link>
                            </div>
                        ))}
                      </div>
                    </div>

                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default Orders;