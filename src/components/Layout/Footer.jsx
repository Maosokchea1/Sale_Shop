import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  PaperAirplaneIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok 
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 border-t border-gray-200" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Accent Top Bar */}
      <div className="h-1.5 bg-[#930712] w-full"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* 1. Company Info */}
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-3 no-underline group">
                <div className="w-10 h-10 rounded-xl bg-[#930712] flex items-center justify-center shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform">
                  <span className="text-xl font-bold text-white">S</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  Sale_Shop
                </span>
              </Link>
              
              <p className="text-gray-500 leading-relaxed text-sm">
                ទិញទំនិញគុណភាពក្នុងតម្លៃសមរម្យ ជាមួយការដឹកជញ្ជូនលឿន និងសេវាកម្មល្អបំផុតជូនអតិថិជន។
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-[#930712]">
                    <MapPinIcon className="w-4 h-4" />
                  </span>
                  <span>ភ្នំពេញ, កម្ពុជា</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-[#930712]">
                    <PhoneIcon className="w-4 h-4" />
                  </span>
                  <span>+៨៥៥ ១២ ៣៤៥ ៦៧៨</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-[#930712]">
                    <ClockIcon className="w-4 h-4" />
                  </span>
                  <span>ចន្ទ - សុក្រ: ៨:០០ ព្រឹក - ៦:០០ ល្ងាច</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-2 pt-2">
                {[
                  { icon: FaFacebookF, href: '#', label: 'Facebook' },
                  { icon: FaTiktok, href: '#', label: 'TikTok' },
                  { icon: FaInstagram, href: '#', label: 'Instagram' },
                  { icon: FaYoutube, href: '#', label: 'YouTube' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-[#930712] hover:border-[#930712] hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                    aria-label={social.label}
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* 2. Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
                តំណភ្ជាប់រហ័ស
              </h3>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { to: '/shop', label: 'ផលិតផលទាំងអស់' },
                  { to: '/new-arrivals', label: 'មកដល់ថ្មី' },
                  { to: '/deals', label: 'ការបញ្ចុះតម្លៃ' },
                  { to: '/about', label: 'អំពីយើង' },
                  { to: '/contact', label: 'ទំនាក់ទំនង' },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center text-gray-600 hover:text-[#930712] transition-all no-underline text-sm"
                    >
                      <ChevronRightIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-[#930712]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 3. Customer Service */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
                សេវាកម្មអតិថិជន
              </h3>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { to: '/faq', label: 'សំណួរញឹកញាប់' },
                  { to: '/shipping', label: 'ព័ត៌មានដឹកជញ្ជូន' },
                  { to: '/returns', label: 'ការប្រគល់និងដូរទំនិញ' },
                  { to: '/privacy', label: 'គោលការណ៍ឯកជនភាព' },
                  { to: '/terms', label: 'លក្ខខណ្ឌសេវាកម្ម' },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center text-gray-600 hover:text-[#930712] transition-all no-underline text-sm"
                    >
                      <ChevronRightIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-[#930712]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 4. Newsletter & Trust */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
                ព្រឹត្តិបត្រព័ត៌មាន
              </h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                ចុះឈ្មោះដើម្បីទទួលបានដំណឹងប្រូម៉ូសិន និងការផ្តល់ជូនពិសេសមុនគេ។
              </p>
              
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-2.5 mb-6">
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#930712] focus:ring-2 focus:ring-[#930712]/15 shadow-sm transition-all"
                      style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#930712] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#7a060f] active:scale-[0.99] shadow-sm hover:shadow-md transition-all border-0 cursor-pointer"
                  >
                    <span>ជាវឥឡូវនេះ</span>
                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 mb-6 animate-fade-in">
                  <p className="text-[#930712] text-sm font-medium m-0">
                    🎉 អរគុណសម្រាប់ការជាវ! យើងបានផ្ញើសារទៅកាន់អ៊ីមែលរបស់អ្នកហើយ។
                  </p>
                </div>
              )}
              
              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    <span>សុវត្ថិភាព SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <LockClosedIcon className="w-4 h-4 text-[#930712]" />
                    <span>សុវត្ថិភាពទូទាត់</span>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400">ទូទាត់តាម:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Visa', 'MasterCard', 'Amex', 'ABA Pay'].map((method) => (
                      <span 
                        key={method}
                        className="px-2 py-0.5 bg-white text-[11px] font-medium text-gray-600 rounded border border-gray-200 shadow-xs"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs md:text-sm text-center md:text-left m-0">
              &copy; {currentYear} Sale_Shop។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
            
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-[#930712] text-xs md:text-sm no-underline transition-colors">
                គោលការណ៍ឯកជនភាព
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-[#930712] text-xs md:text-sm no-underline transition-colors">
                លក្ខខណ្ឌសេវាកម្ម
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-[#930712] text-xs md:text-sm no-underline transition-colors">
                គោលការណ៍ខូគី
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;