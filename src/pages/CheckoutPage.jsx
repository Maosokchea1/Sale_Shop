import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon, 
  ShieldCheckIcon,
  LockClosedIcon,
  CreditCardIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const CheckoutPage = () => {
  const { cartItems, getCartCount, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    document.title = 'ការទូទាត់ | សាបហាប់';
    return () => {
      document.title = 'សាបហាប់';
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
  }, [user, navigate]);

  if (!user) {
    return <LoadingSpinner />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            កន្ត្រករបស់អ្នកទទេ
          </h1>
          <p className="text-gray-600 mb-8">
            អ្នកត្រូវបន្ថែមទំនិញចូលកន្ត្រកមុនពេលទូទាត់។
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 bg-[#930712] text-white px-8 py-4 font-semibold hover:bg-[#7a060f] transition-colors no-underline"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>បន្តទិញទំនិញ</span>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-gray-500 hover:text-[#930712] transition-colors no-underline">ទំព័រដើម</Link>
            <span className="text-gray-300">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-[#930712] transition-colors no-underline">កន្ត្រក</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">ការទូទាត់</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                ការទូទាត់
              </h1>
              <p className="text-gray-500">
                {getCartCount()} ទំនិញក្នុងការបញ្ជាទិញរបស់អ្នក
              </p>
            </div>
            
            <Link
              to="/cart"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors no-underline"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              ត្រឡប់ទៅកន្ត្រក
            </Link>
          </div>
        </div>

        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 text-white flex items-center justify-center text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">កន្ត្រកទំនិញ</span>
            </div>
            <div className="w-12 h-0.5 bg-emerald-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#930712] text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-semibold text-gray-900">ការទូទាត់</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">ការបញ្ជាក់</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <CheckoutForm />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary */}
              <div className="bg-white border border-gray-200 p-6 md:p-8">
                <OrderSummary />
              </div>

              {/* Payment Methods */}
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4" />
                  យើងទទួលយក
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Visa', color: 'bg-[#1a1f71]' },
                    { name: 'Mastercard', color: 'bg-[#eb001b]' },
                    { name: 'Amex', color: 'bg-[#2e77bb]' },
                    { name: 'KHQR', color: 'bg-emerald-500' },
                  ].map((method) => (
                    <span
                      key={method.name}
                      className={`${method.color} text-white text-xs font-semibold px-3 py-1.5`}
                    >
                      {method.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gray-50 border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">ការទូទាត់សុវត្ថិភាព</p>
                      <p className="text-xs text-gray-500">ទិន្នន័យរបស់អ្នកត្រូវបានការពារ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">ជម្រើសទូទាត់ច្រើន</p>
                      <p className="text-xs text-gray-500">Visa, MC, Amex, KHQR</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="text-center p-4">
                <p className="text-sm text-gray-500">
                  ត្រូវការជំនួយ?{' '}
                  <Link to="/contact" className="text-[#930712] hover:text-[#7a060f] font-medium no-underline">
                    ទំនាក់ទំនងជំនួយ
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;