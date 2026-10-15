import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { StarIcon } from '@heroicons/react/24/solid';

const BrandCarousel = ({ brands = [] }) => {
  if (!brands || brands.length === 0) {
    return (
      <section className="py-16 bg-white border-t-2 border-b-2 border-black font-['Share_Tech',sans-serif]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black mb-4">
            <StarIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2 uppercase tracking-tighter">OUR BRANDS</h2>
          <p className="text-gray-500 font-bold text-sm tracking-wide uppercase">NO BRANDS AVAILABLE</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-20 bg-white overflow-hidden font-['Share_Tech',sans-serif] border-t-2 border-black">
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-black text-white text-sm font-bold px-6 py-3 mb-6 tracking-wider uppercase">
            <StarIcon className="w-5 h-5" />
            <span>TRUSTED PARTNERS</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 uppercase tracking-tighter">
            PREMIUM BRANDS
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-bold tracking-wide uppercase">
            WE PARTNER WITH THE WORLD'S MOST TRUSTED BRANDS
          </p>
        </div>

        {/* Brand Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={2}
          spaceBetween={20}
          autoplay={{ 
            delay: 3000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
          }}
          className="brand-swiper !pb-14"
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <a 
                href={brand.link_url || '#'} 
                className="group flex flex-col items-center p-6 bg-white border-2 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                target={brand.link_url ? '_blank' : '_self'}
                rel={brand.link_url ? 'noopener noreferrer' : ''}
              >
                {/* Brand Logo */}
                <div className="relative w-full aspect-[3/2] mb-4 flex items-center justify-center bg-gray-100 group-hover:bg-white transition-colors border-2 border-gray-200">
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    className="max-w-[80%] max-h-[60%] object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      console.error('Brand image failed to load:', brand.image_url);
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=000000&color=ffffff&size=128&bold=true`;
                    }}
                  />
                </div>
                
                {/* Brand Info */}
                <h3 className="text-sm font-bold text-black text-center uppercase tracking-wider group-hover:underline">
                  {brand.name}
                </h3>
                
                {brand.description && (
                  <p className="text-[10px] font-bold text-gray-500 text-center mt-1.5 line-clamp-2 uppercase tracking-wider">
                    {brand.description}
                  </p>
                )}

                {/* Hover Arrow Indicator */}
                {brand.link_url && (
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1">
                      EXPLORE
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                )}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Pagination Styles */}
      <style>{`
        .brand-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        
        .brand-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 0;
          border: 2px solid #000;
        }
        
        .brand-swiper .swiper-pagination-bullet-active {
          width: 32px;
          background: #000;
          border-color: #000;
        }

        @media (max-width: 640px) {
          .brand-swiper .swiper-pagination {
            bottom: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BrandCarousel;