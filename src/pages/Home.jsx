import React, { useEffect, useState } from 'react';
import { catalogService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, AlertCircle, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import '../App.css';
import '../estilos.css';
import '../home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Imágenes gratuitas de alta calidad de Unsplash relacionadas con moda y textiles
  const bannerSlides = [
    {
      id: 1,
      title: "Nueva Colección de Corsets",
      subtitle: "Diseños exclusivos confeccionados en Lima con acabados premium y ajuste perfecto.",
      align: "center",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Calidad Textil Garantizada",
      subtitle: "Materiales seleccionados y un estricto control en cada hilo de nuestra producción.",
      align: "left",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 3,
      title: "Básicos Atemporales",
      subtitle: "Prendas esenciales que combinan versatilidad y elegancia para tu día a día.",
      align: "right",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => setCurrentSlide(currentSlide === bannerSlides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? bannerSlides.length - 1 : currentSlide - 1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogService.getAllProducts();
        setProducts(data || []);
      } catch (err) {
        setError(err.message || 'Lo sentimos, no pudimos cargar el catálogo en este momento.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="storefront-wrapper">

        {/* CARRUSEL PROMOCIONAL CON IMÁGENES */}
        <section className="storefront-carousel-container">
          <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {bannerSlides.map((slide) => (
                <div
                    key={slide.id}
                    className="carousel-slide"
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                  {/* Capa oscura para que el texto sea siempre legible */}
                  <div className="carousel-overlay"></div>

                  <div className={`slide-content text-${slide.align}`}>
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <button className="carousel-btn">Ver Colección</button>
                  </div>
                </div>
            ))}
          </div>

          {/* Controles del Carrusel */}
          <button className="carousel-control prev" onClick={prevSlide}>
            <ChevronLeft size={32} />
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            <ChevronRight size={32} />
          </button>

          {/* Indicadores (Puntos) */}
          <div className="carousel-indicators">
            {bannerSlides.map((_, index) => (
                <button
                    key={index}
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                />
            ))}
          </div>
        </section>

        {/* BARRA DE BÚSQUEDA FLOTANTE (MEJORADA) */}
        <div className="catalog-search-wrapper">
          <div className="catalog-search">
            <div className="input-with-icon">
              <Search className="icon" size={22} />
              <input
                  type="text"
                  placeholder="Buscar prendas... (Ej. Corset Negro)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CATÁLOGO DE PRODUCTOS */}
        <main className="container" style={{ paddingBottom: '5rem' }}>
          {loading ? (
              <div className="catalog-status">
                <div className="spinner"></div>
              </div>
          ) : error ? (
              <div className="catalog-status error">
                <AlertCircle size={32} />
                <h3>Ocurrió un inconveniente</h3>
                <p>{error}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="catalog-status empty">
                <ShoppingBag size={48} />
                <h3>Próximamente</h3>
                <p>Estamos preparando la nueva temporada. Vuelve pronto.</p>
              </div>
          ) : (
              <>
                <div className="catalog-header">
                  <span>{filteredProducts.length} artículo(s)</span>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="catalog-status empty">
                      <Search size={32} />
                      <h3>No hay coincidencias</h3>
                      <p>No pudimos encontrar prendas que coincidan con "{searchTerm}".</p>
                    </div>
                )}
              </>
          )}
        </main>
      </div>
  );
};

export default Home;