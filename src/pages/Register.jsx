import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import '../App.css'; // Conexión a tus estilos globales de la tienda
import '../estilos.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        username: formData.username,
        password: formData.password
      };

      await authService.register(payload);
      navigate('/login', { state: { message: 'Registro exitoso. Ya puedes iniciar sesión.' } });
    } catch (err) {
      setError(err.message || 'Hubo un problema al crear tu cuenta. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="storefront-login-wrapper">
        {/* Hacemos la tarjeta un poco más ancha (540px) para acomodar los dos nombres lado a lado */}
        <div className="storefront-login-card" style={{ maxWidth: '540px' }}>

          {/* Encabezado Comercial */}
          <div className="login-header">
            <h2>Crear Cuenta</h2>
            <p>Únete para acceder a ofertas exclusivas, guardar tus favoritos y gestionar tus pedidos.</p>
          </div>

          {/* Alerta de Error Minimalista */}
          {error && (
              <div className="storefront-alert">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="flex-col">

            {/* Fila en Grid para Nombre y Apellido para ahorrar espacio vertical */}
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.75rem' }}>
              <div>
                <label htmlFor="firstName">Nombre</label>
                <div className="input-with-icon">
                  <User className="icon" size={18} />
                  <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Ej. Juan"
                      required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName">Apellido</label>
                <div className="input-with-icon">
                  <User className="icon" size={18} />
                  <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ej. Pérez"
                      required
                  />
                </div>
              </div>
            </div>

            {/* Campo Usuario */}
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <div className="input-with-icon">
                <User className="icon" size={18} />
                <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ej. juanperez123"
                    required
                    minLength={4}
                />
              </div>
            </div>

            {/* Campo Correo */}
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail className="icon" size={18} />
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label htmlFor="password">Contraseña</label>
              <div className="input-with-icon">
                <Lock className="icon" size={18} />
                <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 10 caracteres"
                    required
                    minLength={10}
                />
              </div>
            </div>

            {/* Botón Principal */}
            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? (
                  <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', margin: '0' }}></div>
              ) : (
                  <>Crear Mi Cuenta <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer Comercial */}
          <div className="login-footer">
            <p>
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Register;