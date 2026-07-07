import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Package, MessageSquare, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../App.css'; // Asegúrate de tener los estilos globales
import '../estilos.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Calcular cantidad total de artículos en el carrito
    const cartItemsCount = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

    return (
        <nav className="storefront-navbar">
            <div className="navbar-container">

                {/* LOGO DE LA TIENDA */}
                <Link to="/" className="storefront-brand">
                    TIENDA ROOS
                </Link>

                {/* ACCIONES Y MENÚ DE NAVEGACIÓN */}
                <div className="storefront-actions">

                    {/* Botón Discreto de Vista Administrador */}
                    <a href="https://admin.sistematextil.pp.ua" className="admin-ghost-btn" title="Acceso exclusivo para personal">
                        <Shield size={14} />
                        <span>Admin</span>
                    </a>

                    <div className="navbar-divider"></div>

                    {user ? (
                        <div className="user-menu-group">
                            <span className="user-greeting">Hola, {user.username}</span>

                            <Link to="/orders" className="nav-item">
                                <Package size={18} />
                                <span>Pedidos</span>
                            </Link>

                            <Link to="/my-reviews" className="nav-item">
                                <MessageSquare size={18} />
                                <span>Reseñas</span>
                            </Link>

                            <button className="nav-item logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Salir</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-item login-btn">
                            <User size={18} />
                            <span>Iniciar Sesión</span>
                        </Link>
                    )}

                    {/* BOLSA DE COMPRAS (CARRITO) */}
                    <Link to="/cart" className="cart-trigger">
                        <ShoppingBag size={22} />
                        {cartItemsCount > 0 && (
                            <span className="cart-badge">
                {cartItemsCount}
              </span>
                        )}
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
