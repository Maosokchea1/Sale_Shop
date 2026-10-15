import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getBanners } from '../../services/product';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 h-[400px] flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="w-10 h-10 border-[3px] border-gray-200 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  // Default Banner
  if (!banners || banners.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-center text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-lg">
          <span className="inline-block bg-gray-900 text-white text-xs font-medium py-1.5 px-4 mb-5">
            New Collection 2024
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 tracking-tight">
            Welcome to ShopHub
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Discover amazing products at great prices
          </p>
          
          <a 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 no-underline font-medium text-base hover:bg-gray-800"
          >
            Shop Now
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Banner Slider
  return (
    <div className="py-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false 
          }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={banners.length > 1}
          className="w-full overflow-hidden"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full pt-[45%] md:pt-[40%] overflow-hidden">
                <img 
                  src={banner.image_url}
                  alt={banner.title || 'Banner'}
                  className="absolute inset-0 w-full h-full  object-center"
                />
                
                <div className="absolute inset-0  via-black/20 to-transparent" />
                
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Swiper Styles */}
      <style>{`
        /* Swiper Pagination */
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: white !important;
          opacity: 0.5 !important;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: white !important;
          width: 24px !important;
        }

        /* Swiper Navigation */
        .swiper-button-prev,
        .swiper-button-next {
          color: white !important;
          background: rgba(0, 0, 0, 0.3) !important;
          width: 40px !important;
          height: 40px !important;
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: rgba(0, 0, 0, 0.5) !important;
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 16px !important;
          font-weight: bold !important;
        }

        /* Mobile Responsive */
        @media (max-width: 767px) {
          .swiper-slide > div {
            padding-top: 60% !important;
          }
          
          .swiper-button-prev,
          .swiper-button-next {
            width: 36px !important;
            height: 36px !important;
          }
          
          .swiper-button-prev::after,
          .swiper-button-next::after {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;