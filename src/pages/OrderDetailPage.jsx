import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrder } from '../services/order';
import { formatPrice } from '../utils/currency';
import { ORDER_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  CubeIcon,
  XCircleIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'កំពុងរង់ចាំការទូទាត់',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: ClockIcon,
        dotColor: 'bg-amber-400',
        progress: 25,
      },
      paid: {
        label: 'បានបញ្ជាក់ការទូទាត់',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: CreditCardIcon,
        dotColor: 'bg-blue-400',
        progress: 50,
      },
      shipped: {
        label: 'បានដឹកជញ្ជូន',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: TruckIcon,
        dotColor: 'bg-purple-400',
        progress: 75,
      },
      delivered: {
        label: 'បានដឹកជញ្ជូនដល់',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CubeIcon,
        dotColor: 'bg-emerald-400',
        progress: 100,
      },
      cancelled: {
        label: 'បានលុបចោល',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircleIcon,
        dotColor: 'bg-red-400',
        progress: 0,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getProgressSteps = () => {
    const steps = [
      { key: 'pending', label: 'បានបញ្ជាទិញ', icon: ClockIcon },
      { key: 'paid', label: 'បានបញ្ជាក់', icon: CheckCircleIcon },
      { key: 'shipped', label: 'កំពុងដឹក', icon: TruckIcon },
      { key: 'delivered', label: 'បានទទួល', icon: CubeIcon },
    ];

    const currentStepIndex = steps.findIndex(step => step.key === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex && order?.status !== 'cancelled',
      current: step.key === order?.status,
    }));
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-6 text-gray-500 animate-pulse text-lg font-medium">
            កំពុងផ្ទុកព័ត៌មានលម្អិត...
          </p>
        </div>
      </div>
    );
  }

  // Order Not Found
  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 mb-6">
            <DocumentTextIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            រកមិនឃើញការបញ្ជាទិញ
          </h1>
          <p className="text-gray-600 mb-8">
            ការបញ្ជាទិញដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬអាចត្រូវបានដកចេញ។
          </p>
          <button 
            onClick={() => navigate('/orders')} 
            className="group inline-flex items-center gap-3 bg-[#930712] text-white px-8 py-4 font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>ត្រឡប់ទៅការបញ្ជាទិញ</span>
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const progressSteps = getProgressSteps();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#930712] transition-colors no-underline">ទំព័រដើម</Link>
            <span className="text-gray-300">/</span>
            <Link to="/orders" className="text-gray-500 hover:text-[#930712] transition-colors no-underline">ការបញ្ជាទិញ</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">#{order.order_number}</span>
          </nav>
          
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            ត្រឡប់ទៅការបញ្ជាទិញ
          </button>
        </div>

        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                លេខបញ្ជាទិញ #{order.order_number}
              </h1>
              <p className="text-gray-500 text-sm">
                បានបញ្ជាទិញនៅថ្ងៃ {format(new Date(order.created_at), 'dd MMMM yyyy \'នៅ\' h:mm a')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border ${statusInfo.color}`}>
                <StatusIcon className="w-4 h-4" />
                {statusInfo.label}
              </span>
            </div>
          </div>

          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBagIcon className="w-5 h-5" />
                ទំនិញក្នុងការបញ្ជាទិញ ({order.items.length})
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <Link to={`/product/${item.product?.id}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 bg-gray-100 overflow-hidden">
                        <img
                          src={item.product?.image_url || '/placeholder-image.jpg'}
                          alt={item.product?.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.product?.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-[#930712] transition-colors line-clamp-1 no-underline"
                      >
                        {item.product?.title || 'ផលិតផល'}
                      </Link>
                      
                      {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {Object.entries(item.selected_options).map(([key, value]) => (
                            <span 
                              key={key} 
                              className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          ចំនួន: {item.quantity}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.price_usd * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              {formatPrice(item.price_usd)} ក្នុងមួយ
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                អាសយដ្ឋានដឹកជញ្ជូន
              </h2>
              <div className="bg-gray-50 p-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {order.shipping_address || 'មិនមានអាសយដ្ឋាន'}
                </p>
              </div>
            </div>

            {/* Tracking Information */}
            {order.tracking_number && (
              <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  ព័ត៌មានតាមដាន
                </h2>
                <div className="bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">លេខតាមដាន</p>
                      <p className="font-mono text-gray-900 font-semibold">{order.tracking_number}</p>
                    </div>
                    <button className="inline-flex items-center gap-2 bg-[#930712] text-white px-4 py-2 text-sm font-medium hover:bg-[#7a060f] transition-colors border-0 cursor-pointer">
                      តាមដានកញ្ចប់
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">សង្ខេបការបញ្ជាទិញ</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">សរុបរង</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(order.total_amount_usd)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ការដឹកជញ្ជូន</span>
                  <span className="text-sm font-medium text-emerald-600">ឥតគិតថ្លៃ</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ពន្ធ</span>
                  <span className="text-sm font-medium text-gray-900">រួមបញ្ចូល</span>
                </div>
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ការបញ្ចុះតម្លៃ</span>
                    <span className="text-sm font-medium text-red-600">
                      -{formatPrice(order.discount_amount)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">សរុប</span>
                    <span className="text-xl font-bold text-[#930712]">
                      {formatPrice(order.total_amount_usd)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                ការទូទាត់
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">វិធីសាស្ត្រ</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {order.payment_method || 'មិនបានបញ្ជាក់'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ស្ថានភាព</span>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                    order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                      ? 'text-emerald-600'
                      : order.status === 'cancelled'
                        ? 'text-red-600'
                        : 'text-amber-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 ${
                      order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                        ? 'bg-emerald-400'
                        : order.status === 'cancelled'
                          ? 'bg-red-400'
                          : 'bg-amber-400'
                    }`}></div>
                    {order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                      ? 'បានបង់ប្រាក់'
                      : order.status === 'cancelled'
                        ? 'បានសងប្រាក់'
                        : 'កំពុងរង់ចាំ'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ព័ត៌មានការបញ្ជាទិញ</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">លេខបញ្ជាទិញ</p>
                  <p className="font-mono text-sm text-gray-900 font-semibold">{order.order_number}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">កាលបរិច្ឆេទ</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(order.created_at), 'dd MMMM yyyy')}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(order.updated_at || order.created_at), 'dd MMM yyyy \'នៅ\' h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-50 border border-gray-200 p-6 md:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white shadow-sm mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ត្រូវការជំនួយ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  មានសំណួរអំពីការបញ្ជាទិញរបស់អ្នក? ក្រុមគាំទ្ររបស់យើងនៅទីនេះដើម្បីជួយ។
                </p>
                <div className="space-y-2">
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-4 py-2.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <EnvelopeIcon className="w-4 h-4" />
                    ទំនាក់ទំនងជំនួយ
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-[#930712] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#7a060f] transition-colors border-0 cursor-pointer">
                    <PhoneIcon className="w-4 h-4" />
                    ហៅទូរស័ព្ទ
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button className="w-full inline-flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-3 text-sm font-medium hover:bg-red-100 transition-colors border border-red-200 cursor-pointer">
                  <XCircleIcon className="w-4 h-4" />
                  លុបចោលការបញ្ជាទិញ
                </button>
              )}
              <button className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-600 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer">
                <DocumentTextIcon className="w-4 h-4" />
                ទាញយកវិក្កយបត្រ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;