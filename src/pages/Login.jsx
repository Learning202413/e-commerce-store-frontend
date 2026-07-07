import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import '../App.css'; // Conexión a tus estilos globales de la tienda
import '../estilos.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="storefront-login-wrapper">
        <div className="storefront-login-card">

          {/* Encabezado Comercial */}
          <div className="login-header">
            <h2>Bienvenido</h2>
            <p>Accede a tu cuenta para gestionar tus pedidos, devoluciones y favoritos.</p>
          </div>

          {/* Alerta de Error integrada elegantemente */}
          {error && (
              <div className="storefront-alert">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="flex-col gap-4">

            {/* Campo Usuario/Correo */}
            <div className="form-group">
              <label htmlFor="username">Usuario o Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail className="icon" size={18} />
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="tu@email.com"
                    autoComplete="username"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-with-icon">
                <Lock className="icon" size={18} />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                />
              </div>
            </div>

            {/* Enlace de recuperación (Vital en E-commerce) */}
            <div className="forgot-password">
              <Link to="/recovery">¿Olvidaste tu contraseña?</Link>
            </div>

            {/* Botón Principal (Ancho completo) */}
            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? (
                  <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', margin: '0' }}></div>
              ) : (
                  <>Iniciar Sesión <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer para nuevos clientes */}
          <div className="login-footer">
            <p>¿Aún no tienes una cuenta? <Link to="/register">Crear cuenta</Link></p>
          </div>
        </div>
      </div>
  );
};

export default Login;