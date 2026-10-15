import React, { useState, useEffect, useRef } from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import FeaturedProducts from '../components/Home/FeaturedProducts';


import { getBrands, getProducts } from '../services/product';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { 
  SparklesIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const featuredRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, productsData] = await Promise.all([
          getBrands(),
          getProducts({ limit: 8 })
        ]);
        setBrands(brandsData);
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="lg" />
          <p style={{
            marginTop: '24px',
            color: '#666',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payment',
      description: '100% protected',
    },
    {
      icon: ArrowPathIcon,
      title: 'Easy Returns',
      description: '30-day policy',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: '24/7 Support',
      description: 'Always here to help',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Hero Section */}
      <HeroBanner />

      

      {/* Featured Products */}
      <div ref={featuredRef}>
        <FeaturedProducts products={featuredProducts} title="" />
      </div>

      

      

      
      

      
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px',
          background: '#111',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 50,
          opacity: scrollY > 400 ? 1 : 0,
          transform: scrollY > 400 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s',
          pointerEvents: scrollY > 400 ? 'auto' : 'none'
        }}
        aria-label="Scroll to top"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#333';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#111';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .promo-content {
            flex-direction: row !important;
            text-align: left !important;
          }
          .promo-title {
            font-size: 64px !important;
          }
          .section-title {
            font-size: 48px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;