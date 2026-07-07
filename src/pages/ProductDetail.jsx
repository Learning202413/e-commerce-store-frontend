import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Trash2, AlertCircle, MessageSquare } from 'lucide-react';
import { catalogService, reviewService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../App.css'; // Tus estilos globales
import '../estilos.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get('order');

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
          catalogService.getProductById(id),
          reviewService.getProductReviews(id).catch(() => [])
        ]);

        setProduct(productData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        setError(err.message || 'No pudimos encontrar esta prenda.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const reviewPayload = {
        productId: Number(id),
        rating: Number(rating),
        reviewText: reviewText,
        orderId: Number(orderIdFromUrl)
      };

      const newReview = await reviewService.addReview(reviewPayload);
      setReviews([newReview, ...reviews]); // Agregar al inicio para verla inmediatamente
      setReviewText('');
      setRating(5);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.message || 'Error al publicar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu opinión?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert('Error al eliminar reseña: ' + err.message);
    }
  };

  const renderStars = (ratingValue, interactive = false) => {
    return (
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
              <Star
                  key={star}
                  onClick={() => interactive && setRating(star)}
                  fill={star <= ratingValue ? '#111827' : 'none'} /* Estrellas negras/oscuras premium */
                  color={star <= ratingValue ? '#111827' : 'var(--text-muted)'}
                  size={interactive ? 24 : 16}
                  style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.2s' }}
              />
          ))}
        </div>
    );
  };

  // ESTADOS DE CARGA Y ERROR
  if (loading) return <div className="catalog-status" style={{ minHeight: '80vh' }}><div className="spinner"></div></div>;

  if (error || !product) {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
          <div className="catalog-status error">
            <AlertCircle size={48} />
            <h3>Prenda no encontrada</h3>
            <p>{error || 'El artículo que buscas ya no está disponible o el enlace es incorrecto.'}</p>
            <Link to="/" className="secondary" style={{ marginTop: '2rem', display: 'inline-flex', padding: '0.8rem 1.5rem' }}>
              <ArrowLeft size={18} style={{ marginRight: '0.5rem' }}/> Volver a la tienda
            </Link>
          </div>
        </div>
    );
  }

  const isOutOfStock = product.quantity === 0;

  return (
      <div className="container" style={{ padding: '2rem 1.5rem 6rem 1.5rem' }}>

        {/* Navegación sutil */}
        <div className="breadcrumb">
          <Link to="/"><ArrowLeft size={16} /> Volver a la colección</Link>
        </div>

        {/* SECCIÓN 1: DETALLES DEL PRODUCTO */}
        <div className="product-detail-layout">

          {/* Galería / Imagen Principal */}
          <div className="product-image-large">
            {/* Placeholder elegante en lugar del gradiente */}
            <div className="image-placeholder">
              <span>{product.name?.substring(0, 2).toUpperCase()}</span>
            </div>
            {isOutOfStock && <div className="badge danger">Agotado</div>}
          </div>

          {/* Información y Compra */}
          <div className="product-info-panel">
            <h1>{product.name}</h1>
            <p className="product-price-large">${product.price?.toFixed(2)}</p>

            <div className="product-description">
              <p>{product.description || 'Una prenda esencial diseñada con atención al detalle y materiales de alta calidad para garantizar confort y estilo duradero.'}</p>
            </div>

            <div className="product-meta">
              <span className="meta-label">Disponibilidad:</span>
              {isOutOfStock ? (
                  <span className="meta-value text-danger">Sin stock en este momento</span>
              ) : (
                  <span className="meta-value">{product.quantity} unidades en bodega</span>
              )}
            </div>

            {/* Call to Action Principal */}
            <button
                className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
            >
              <ShoppingBag size={20} />
              {isOutOfStock ? 'Artículo Agotado' : 'Añadir a la Bolsa'}
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: RESEÑAS */}
        <div className="reviews-section">
          <h2>Valoraciones de Clientes</h2>

          <div className="reviews-layout">

            {/* Formulario de Reseña (Condicionado a compras previas) */}
            <div className="review-form-container">
              <h3>Comparte tu experiencia</h3>

              {!user ? (
                  <div className="review-notice">
                    <p>Para garantizar la autenticidad, solo los clientes registrados pueden dejar valoraciones.</p>
                    <Link to="/login" className="secondary btn-small">Iniciar Sesión</Link>
                  </div>
              ) : !orderIdFromUrl ? (
                  <div className="review-notice">
                    <MessageSquare size={24} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                    <p>Solo puedes valorar prendas que hayas comprado. Ve a <strong>Mis Pedidos</strong> para calificar esta compra.</p>
                    <Link to="/orders" className="secondary btn-small">Ver mis pedidos</Link>
                  </div>
              ) : (
                  <form onSubmit={handleReviewSubmit} className="review-form flex-col gap-4">
                    {submitSuccess && <div className="storefront-alert success">¡Gracias por tu valoración!</div>}
                    {submitError && <div className="storefront-alert">{submitError}</div>}

                    <div className="form-group">
                      <label>Tu calificación</label>
                      {renderStars(rating, true)}
                    </div>

                    <div className="form-group">
                      <label htmlFor="reviewText">Reseña</label>
                      <textarea
                          id="reviewText"
                          rows="4"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="¿Qué te pareció el ajuste, la tela y el diseño?"
                          required
                      />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="submit-review-btn">
                      {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
                    </button>
                  </form>
              )}
            </div>

            {/* Lista de Reseñas */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                  <div className="catalog-status empty" style={{ minHeight: 'auto', padding: '3rem 0' }}>
                    <p>Esta prenda aún no tiene valoraciones.</p>
                  </div>
              ) : (
                  reviews.map((review, index) => (
                      <div key={review.id || index} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.userId ? `U${review.userId}` : 'U'}
                            </div>
                            <div>
                              <strong>Usuario {review.userId || 'Anónimo'}</strong>
                              {renderStars(review.rating)}
                            </div>
                          </div>

                          <div className="review-actions">
                      <span className="review-date">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Reciente'}
                      </span>
                            {user && review.userId === user.id && (
                                <button
                                    className="btn-icon remove"
                                    onClick={() => handleDeleteReview(review.id)}
                                    title="Eliminar mi reseña"
                                >
                                  <Trash2 size={16} />
                                </button>
                            )}
                          </div>
                        </div>
                        <p className="review-text">{review.reviewText}</p>
                      </div>
                  ))
              )}
            </div>

          </div>
        </div>
      </div>
  );
};

export default ProductDetail;