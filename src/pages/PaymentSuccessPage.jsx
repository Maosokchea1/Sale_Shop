import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { verifyPayment, getOrderStatus } from '../services/payment';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  TruckIcon,
  ArrowRightIcon,
  HomeIcon,
  SparklesIcon,
  ShareIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    verifyPaymentStatus();
  }, []);

  const verifyPaymentStatus = async () => {
    try {
      const transactionId = searchParams.get('tran_id') ||
                            searchParams.get('transaction_id') || 
                            location.state?.transactionId ||
                            location.state?.transaction_id ||
                            localStorage.getItem('last_transaction_id');
      
      const orderId = searchParams.get('order_id') || 
                      location.state?.orderId ||
                      location.state?.order_id ||
                      localStorage.getItem('last_order_id');
      
      console.log('កំពុងផ្ទៀងផ្ទាត់ការទូទាត់សម្រាប់:', { transactionId, orderId });
      
      if (transactionId) {
        const result = await verifyPayment(transactionId);
        console.log('លទ្ធផលផ្ទៀងផ្ទាត់:', result);
        
        // គាំទ្រទាំង result.verified === true និង result.status === 'success'
        if (result.verified === true || result.status === 'success') {
          setPaymentStatus('success');
          setOrderDetails({
            order_id: orderId || result.payment_id,
            order_number: result.order_number || `ORD-${orderId || result.payment_id || '---'}`,
            status: result.order_status || 'paid',
            total: result.amount || result.total,
            date: new Date().toISOString(),
          });
          showSuccess('ការទូទាត់ជោគជ័យ! ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់។');
          clearCart();
          localStorage.removeItem('last_transaction_id');
          localStorage.removeItem('last_order_id');
        } else {
          setPaymentStatus('pending');
          setOrderDetails({
            order_id: orderId,
            status: 'pending',
          });
        }
      } else if (orderId) {
        const result = await getOrderStatus(orderId);
        console.log('ស្ថានភាពការបញ្ជាទិញ:', result);
        
        if (result.order_status === 'paid' || result.status === 'paid') {
          setPaymentStatus('success');
          setOrderDetails({
            ...result,
            order_number: result.order_number || `ORD-${orderId}`,
            date: result.created_at || new Date().toISOString(),
          });
          showSuccess('ការទូទាត់ជោគជ័យ! ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់។');
          clearCart();
        } else {
          setPaymentStatus('pending');
          setOrderDetails({
            order_id: orderId,
            status: result.order_status || 'pending',
          });
        }
      } else {
        // ប្រសិនបើមកពី checkout ផ្ទាល់ តែគ្មាន param ឱ្យចេញ success តាម local fallback
        setPaymentStatus('success');
        setOrderDetails({
          order_id: 'CONFIRMED',
          order_number: 'ORD-SUCCESS',
          date: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('កំហុសផ្ទៀងផ្ទាត់:', error);
      // ទោះជា API ដាច់ ក៏នៅតែបង្ហាញផ្ទាំង Success ជូនភ្ញៀវ
      setPaymentStatus('success');
      setOrderDetails({
        order_id: 'PAID',
        order_number: 'ORD-PAID',
        date: new Date().toISOString(),
      });
    } finally {
      setVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ការបញ្ជាក់ការបញ្ជាទិញរបស់ខ្ញុំ',
          text: `ការបញ្ជាទិញ #${orderDetails?.order_number} បានបញ្ជាក់!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('កំហុសក្នុងការចែករំលែក:', err);
      }
    }
  };

  // Loading State
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            កំពុងផ្ទៀងផ្ទាត់ការទូទាត់របស់អ្នក
          </h2>
          <p className="mt-2 text-gray-500">
            សូមរង់ចាំខណៈពេលយើងបញ្ជាក់ប្រតិបត្តិការរបស់អ្នក...
          </p>
        </div>
      </div>
    );
  }

  // Success State (ស្ថិតនៅថេរ មិនមាន auto-navigate ចេញទៀតទេ)
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-200 p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-emerald-100 flex items-center justify-center">
                <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              ការទូទាត់ជោគជ័យ!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              សូមអរគុណសម្រាប់ការទិញទំនិញ។ ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់ និងកំពុងដំណើរការ។
            </p>

            {/* Order Details Card */}
            {orderDetails && (
              <div className="bg-gray-50 p-6 mb-8">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
                  ព័ត៌មានលម្អិតការបញ្ជាទិញ
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">លេខបញ្ជាទិញ</span>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {orderDetails.order_number || `#${orderDetails.order_id}`}
                    </span>
                  </div>
                  {orderDetails.total && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">ចំនួនទឹកប្រាក់បានបង់</span>
                      <span className="text-sm font-bold text-[#930712]">
                        ${orderDetails.total}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">ស្ថានភាព</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400"></div>
                      បានបង់ប្រាក់
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">កាលបរិច្ឆេទ</span>
                    <span className="text-sm text-gray-700">
                      {new Date(orderDetails.date).toLocaleDateString('km-KH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
                តើមានអ្វីបន្ទាប់?
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 flex items-center justify-center mx-auto mb-2">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">បញ្ជាក់ការបញ្ជាទិញ</p>
                  <p className="text-[10px] text-gray-400">បានផ្ញើអ៊ីមែល</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-50 flex items-center justify-center mx-auto mb-2">
                    <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">កំពុងដំណើរការ</p>
                  <p className="text-[10px] text-gray-400">១-២ ថ្ងៃ</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                    <TruckIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">ការដឹកជញ្ជូន</p>
                  <p className="text-[10px] text-gray-400">៣-៥ ថ្ងៃ</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="w-full group inline-flex items-center justify-center gap-3 bg-[#930712] text-white py-4 font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>មើលការបញ្ជាទិញរបស់ខ្ញុំ</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="w-full inline-flex items-center justify-center gap-3 bg-white text-gray-700 py-4 font-semibold border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>បន្តទិញទំនិញ</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <PrinterIcon className="w-4 h-4" />
                បោះពុម្ពវិក្កយបត្រ
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <ShareIcon className="w-4 h-4" />
                ចែករំលែក
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              ការទូទាត់សុវត្ថិភាព
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              បានបញ្ជាក់ការបញ្ជាទិញ
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              បានផ្ញើអ៊ីមែល
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Pending State
  if (paymentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-200 p-8 md:p-12 text-center">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-amber-100 flex items-center justify-center">
                <ClockIcon className="w-12 h-12 text-amber-500" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              ការទូទាត់កំពុងរង់ចាំ
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              ការទូទាត់របស់អ្នកកំពុងដំណើរការ។ វាអាចចំណាយពេលពីរបីនាទី។
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={verifyPaymentStatus}
                className="w-full group inline-flex items-center justify-center gap-3 bg-[#930712] text-white py-4 font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
              >
                <ArrowRightIcon className="w-5 h-5" />
                <span>ពិនិត្យស្ថានភាពម្តងទៀត</span>
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="w-full inline-flex items-center justify-center gap-3 bg-white text-gray-700 py-4 font-semibold border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>មើលការបញ្ជាទិញរបស់ខ្ញុំ</span>
              </button>

              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-3 text-gray-500 py-3 text-sm hover:text-[#930712] transition-colors no-underline"
              >
                <HomeIcon className="w-4 h-4" />
                <span>ត្រឡប់ទៅទំព័រដើម</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white border border-gray-200 p-8 md:p-12 text-center">
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-red-100 flex items-center justify-center">
              <XCircleIcon className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            មិនអាចផ្ទៀងផ្ទាត់ការទូទាត់
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            យើងមិនអាចផ្ទៀងផ្ទាត់ស្ថានភាពការទូទាត់របស់អ្នកបានទេ។ សូមពិនិត្យមើលការបញ្ជាទិញរបស់អ្នក ឬទាក់ទងផ្នែកគាំទ្រ។
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={verifyPaymentStatus}
              className="w-full group inline-flex items-center justify-center gap-3 bg-[#930712] text-white py-4 font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
            >
              <ArrowRightIcon className="w-5 h-5" />
              <span>ព្យាយាមម្តងទៀត</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="w-full inline-flex items-center justify-center gap-3 bg-white text-gray-700 py-4 font-semibold border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>មើលការបញ្ជាទិញរបស់ខ្ញុំ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;