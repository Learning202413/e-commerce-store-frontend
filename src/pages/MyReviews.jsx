import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, Trash2, ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';
import { reviewService } from '../services/api';
import '../App.css'; // Conexión a tus estilos globales
import '../estilos.css';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getUserReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Lo sentimos, no pudimos cargar tus reseñas en este momento.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu valoración?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert('Error al eliminar la reseña: ' + err.message);
    }
  };

  const renderStars = (ratingValue) => {
    return (
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
              <Star
                  key={star}
                  fill={star <= ratingValue ? '#111827' : 'none'} /* Estrellas premium oscuras */
                  color={star <= ratingValue ? '#111827' : 'var(--text-muted)'}
                  size={16}
              />
          ))}
        </div>
    );
  };

  if (loading) {
    return (
        <div className="catalog-status" style={{ minHeight: '80vh' }}>
          <div className="spinner"></div>
        </div>
    );
  }

  return (
      <div className="container reviews-page-container">

        {/* Encabezado */}
        <div className="reviews-page-header">
          <h1>Mis Valoraciones</h1>
          <Link to="/" className="secondary btn-small flex items-center gap-2">
            <ArrowLeft size={16} /> Volver a la Tienda
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
        ) : reviews.length === 0 ? (
            <div className="catalog-status empty">
              <MessageSquare size={56} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
              <h3>Aún no has escrito valoraciones</h3>
              <p>Tus opiniones sobre las prendas que adquieras aparecerán aquí.</p>
              <Link to="/orders" className="add-to-cart-btn" style={{ maxWidth: '300px', marginTop: '2rem', textDecoration: 'none' }}>
                Calificar mis compras
              </Link>
            </div>

            /* Estado: Lista de Reseñas */
        ) : (
            <div className="my-reviews-list">
              {reviews.map((review) => (
                  <div key={review.id} className="my-review-card">

                    <div className="my-review-header">
                      <div>
                        <h3 className="product-reference">
                          Prenda Ref. #{review.productId}
                          <Link to={`/product/${review.productId}`} className="view-product-link">
                            Ver artículo original
                          </Link>
                        </h3>

                        <div className="review-meta-info">
                          {renderStars(review.rating)}
                          {review.createdAt && (
                              <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                          )}
                        </div>
                      </div>

                      <button
                          className="btn-icon remove"
                          onClick={() => handleDeleteReview(review.id)}
                          title="Eliminar valoración"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="review-quote-block">
                      <p>"{review.reviewText}"</p>
                    </div>

                    {review.orderId && (
                        <div className="order-reference">
                          Adquirido en Pedido #{review.orderId}
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default MyReviews;