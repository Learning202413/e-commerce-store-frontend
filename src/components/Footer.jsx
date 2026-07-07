import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react'; // Eliminamos las redes sociales de aquí
import '../App.css';

const Footer = () => {
    return (
        <footer className="storefront-footer">
            <div className="container">

                {/* Suscripción al Newsletter */}
                <div className="newsletter-section">
                    <div className="newsletter-text">
                        <h3>Únete a nuestro club</h3>
                        <p>Recibe acceso anticipado a nuevas colecciones y beneficios exclusivos.</p>
                    </div>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="input-with-icon">
                            <Mail size={18} className="icon" />
                            <input type="email" placeholder="Tu correo electrónico" required />
                        </div>
                        <button type="submit" className="subscribe-btn">
                            Suscribirse <ArrowRight size={16} />
                        </button>
                    </form>
                </div>

                {/* Cuadrícula Principal de Enlaces */}
                <div className="footer-grid">

                    {/* Columna 1: Marca y Redes Sociales Minimalistas */}
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-brand">SISTEMA TEXTIL</Link>
                        <p>Diseño exclusivo y calidad premium. Confeccionando elegancia y versatilidad para tu día a día.</p>

                        {/* Redes Sociales con Tipografía (Estilo Alta Costura) */}
                        <div className="social-links text-socials" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
                            <a href="#" style={{ fontWeight: '600', letterSpacing: '0.1em' }}>IG</a>
                            <a href="#" style={{ fontWeight: '600', letterSpacing: '0.1em' }}>FB</a>
                            <a href="#" style={{ fontWeight: '600', letterSpacing: '0.1em' }}>X</a>
                        </div>
                    </div>

                    {/* Columna 2: Tienda */}
                    <div className="footer-col">
                        <h4>Colecciones</h4>
                        <ul>
                            <li><Link to="/">Novedades</Link></li>
                            <li><Link to="/">Corsetería</Link></li>
                            <li><Link to="/">Básicos Atemporales</Link></li>
                            <li><Link to="/">Ofertas Especiales</Link></li>
                        </ul>
                    </div>

                    {/* Columna 3: Atención al Cliente */}
                    <div className="footer-col">
                        <h4>Ayuda</h4>
                        <ul>
                            <li><Link to="/orders">Seguimiento de Pedido</Link></li>
                            <li><Link to="/">Envíos y Entregas</Link></li>
                            <li><Link to="/">Cambios y Devoluciones</Link></li>
                            <li><Link to="/">Guía de Tallas</Link></li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div className="footer-col">
                        <h4>Contacto</h4>
                        <ul>
                            <li><a href="mailto:contacto@sistematextil.com">contacto@sistematextil.com</a></li>
                            <li><a href="tel:+51123456789">+51 973 456 789</a></li>
                            <li>Lunes a Viernes</li>
                            <li>09:00 AM - 06:00 PM</li>
                        </ul>
                    </div>

                </div>

                {/* Barra Inferior (Legales) */}
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Sistema Textil. Todos los derechos reservados.</p>
                    <div className="legal-links">
                        <Link to="/">Política de Privacidad</Link>
                        <Link to="/">Términos del Servicio</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;