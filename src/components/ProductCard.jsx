import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../App.css'; // Conexión a tus estilos globales
import '../estilos.css';
const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const isOutOfStock = product.quantity === 0;

    return (
        <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>

            <Link to={`/product/${product.id}`} className="product-card-link">

                {/* Contenedor de Imagen (Proporción 3:4) */}
                <div className="product-image-container">
                    {/* Placeholder Minimalista */}
                    <div className="image-placeholder">
                        <span>{product.name?.substring(0, 2).toUpperCase()}</span>
                    </div>

                    {/* Badge Flotante */}
                    {isOutOfStock && (
                        <div className="badge danger">Agotado</div>
                    )}
                </div>

                {/* Información del Producto */}
                <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">${product.price?.toFixed(2)}</p>
                </div>

            </Link>

            {/* Acción de Compra Rápida */}
            <button
                className={`quick-add-btn ${isOutOfStock ? 'disabled' : ''}`}
                onClick={(e) => {
                    e.preventDefault(); // Evita que el clic en el botón abra la página de detalle
                    addToCart(product);
                }}
                disabled={isOutOfStock}
                title={isOutOfStock ? 'Sin stock' : 'Añadir a la bolsa'}
            >
                <ShoppingBag size={16} />
                <span>{isOutOfStock ? 'Agotado' : 'Añadir'}</span>
            </button>

        </div>
    );
};

export default ProductCard;