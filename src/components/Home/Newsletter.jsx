import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { 
  EnvelopeIcon, 
  PaperAirplaneIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showError('PLEASE ENTER YOUR EMAIL ADDRESS');
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError('PLEASE ENTER A VALID EMAIL ADDRESS');
      return;
    }
    
    // Simulate API call
    showSuccess('WELCOME ABOARD! CHECK YOUR INBOX.');
    setIsSubscribed(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden font-['Share_Tech',sans-serif]">
      {/* Background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Bold geometric shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 border-2 border-white/10"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 border-2 border-white/10 rotate-45"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white mb-8">
            <EnvelopeIcon className="w-8 h-8 text-black" />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white text-black text-sm font-bold px-6 py-3 mb-6 tracking-wider uppercase">
            <SparklesIcon className="w-5 h-5" />
            <span>STAY IN THE LOOP</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 uppercase tracking-tighter leading-none">
            SUBSCRIBE TO OUR<br/>NEWSLETTER
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto font-bold tracking-wide uppercase">
            GET THE LATEST UPDATES ON NEW PRODUCTS, EXCLUSIVE DEALS, AND UPCOMING SALES.
          </p>
          
          {/* Subscription Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-white text-black placeholder:text-gray-400 border-2 border-white font-bold tracking-wider uppercase text-sm focus:outline-none focus:border-gray-300 transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-5 font-bold tracking-wider uppercase hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  <span>SUBSCRIBE</span>
                  <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-wider uppercase">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                  <span>NO SPAM</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-wider uppercase">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                  <span>WEEKLY UPDATES</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-wider uppercase">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                  <span>UNSUBSCRIBE ANYTIME</span>
                </div>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="max-w-lg mx-auto">
              <div className="bg-white p-8 border-2 border-white animate-[fadeInUp_0.5s_ease]">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-tighter">
                  YOU'RE SUBSCRIBED!
                </h3>
                <p className="text-gray-500 text-sm font-bold tracking-wide uppercase">
                  CHECK YOUR INBOX FOR CONFIRMATION.
                </p>
              </div>
            </div>
          )}
          
          {/* Stats/Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-12 pt-8 border-t-2 border-white/20">
            {[
              { value: '10K+', label: 'SUBSCRIBERS' },
              { value: 'WEEKLY', label: 'UPDATES' },
              { value: '50+', label: 'EXCLUSIVE DEALS' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-400 tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom decorative line */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="w-16 h-0.5 bg-white/30"></div>
            <div className="w-2 h-2 bg-white"></div>
            <div className="w-16 h-0.5 bg-white/30"></div>
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Newsletter;