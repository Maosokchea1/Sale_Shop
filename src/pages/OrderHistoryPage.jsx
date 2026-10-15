import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/order';
import { formatPrice } from '../utils/currency';
import { ORDER_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { 
  EyeIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon,
  XCircleIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  SparklesIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      confirmed: CheckCircleIcon,
      shipped: TruckIcon,
      delivered: CubeIcon,
      cancelled: XCircleIcon,
    };
    return icons[status] || ClockIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
      shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || colors.pending;
  };

  const filteredOrders = orders
    .filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.order_number?.toLowerCase().includes(searchLower) ||
          order.items?.some(item => 
            item.product?.title?.toLowerCase().includes(searchLower)
          )
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price_high':
          return b.total_amount_usd - a.total_amount_usd;
        case 'price_low':
          return a.total_amount_usd - b.total_amount_usd;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-6 text-gray-500 animate-pulse text-lg font-medium">
            កំពុងផ្ទុកការបញ្ជាទិញរបស់អ្នក...
          </p>
        </div>
      </div>
    );
  }

  // Empty State
  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            មិនទាន់មានការបញ្ជាទិញ
          </h1>
          <p className="text-gray-600 mb-8">
            អ្នកមិនទាន់បានបញ្ជាទិញទំនិញនៅឡើយទេ។ ចាប់ផ្តើមទិញឥឡូវនេះដើម្បីមើលប្រវត្តិការបញ្ជាទិញ។
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 bg-[#930712] text-white px-8 py-4 font-semibold hover:bg-[#7a060f] transition-colors no-underline"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>ចាប់ផ្តើមទិញឥឡូវនេះ</span>
            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // Empty Search Results
  if (filteredOrders.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ការបញ្ជាទិញរបស់ខ្ញុំ</h1>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកការបញ្ជាទិញ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:border-[#930712] transition-all"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <ArrowPathIcon className="w-4 h-4" />
                សម្អាត
              </button>
            </div>
          </div>

          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 mb-6">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">រកមិនឃើញការបញ្ជាទិញ</h3>
            <p className="text-gray-500 mb-6">
              គ្មានការបញ្ជាទិញណាត្រូវនឹងលក្ខណៈវិនិច្ឆ័យស្វែងរករបស់អ្នកទេ។ សូមកែតម្រូវតម្រង។
            </p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="inline-flex items-center gap-2 bg-[#930712] text-white px-6 py-3 font-medium hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
            >
              មើលការបញ្ជាទិញទាំងអស់
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                ការបញ្ជាទិញរបស់ខ្ញុំ
              </h1>
              <p className="text-gray-500">
                {orders.length} ការបញ្ជាទិញ
              </p>
            </div>
            
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#930712] text-white px-6 py-3 font-medium hover:bg-[#7a060f] transition-colors no-underline"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              បន្តទិញទំនិញ
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ស្វែងរកការបញ្ជាទិញ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:border-[#930712] transition-all"
                style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-all border-0 cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#930712] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#930712] hover:text-[#930712]'
                }`}
              >
                ទាំងអស់ ({orders.length})
              </button>
              {Object.entries(ORDER_STATUS).map(([key, status]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-4 py-2 text-sm font-medium transition-all border-0 cursor-pointer ${
                    statusFilter === key
                      ? 'bg-[#930712] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#930712] hover:text-[#930712]'
                  }`}
                >
                  {status.label} {statusCounts[key] ? `(${statusCounts[key]})` : ''}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:border-[#930712] cursor-pointer"
              style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
            >
              <option value="newest">ថ្មីបំផុត</option>
              <option value="oldest">ចាស់បំផុត</option>
              <option value="price_high">តម្លៃ: ខ្ពស់ទៅទាប</option>
              <option value="price_low">តម្លៃ: ទាបទៅខ្ពស់</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);
            
            return (
              <div 
                key={order.id} 
                className="bg-white border border-gray-200 overflow-hidden hover:border-[#930712] transition-colors"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          លេខបញ្ជាទិញ #{order.order_number}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {format(new Date(order.created_at), 'MMM dd, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {ORDER_STATUS[order.status]?.label || 'កំពុងរង់ចាំ'}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-[#930712] text-lg">
                        {formatPrice(order.total_amount_usd)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items.length} ទំនិញ
                      </p>
                    </div>

                    <Link
                      to={`/order/${order.id}`}
                      className="group inline-flex items-center gap-2 bg-[#930712] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#7a060f] transition-colors no-underline"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>មើលលម្អិត</span>
                      <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
                
                {/* Order Items Preview */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.image_url || '/placeholder-image.jpg'}
                            alt={item.product?.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.product?.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-[#930712] transition-colors line-clamp-1 no-underline"
                          >
                            {item.product?.title || 'ផលិតផល'}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ចំនួន: {item.quantity} × {formatPrice(item.price_usd)}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.price_usd * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500 text-center font-medium">
                          +{order.items.length - 3} ទំនិញបន្ថែម
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                {order.tracking_number && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <TruckIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">តាមដាន:</span>
                      <span className="font-mono text-gray-900 font-medium">{order.tracking_number}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination (if needed) */}
        {filteredOrders.length > 10 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-0 cursor-pointer">
              មុន
            </button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                className={`w-10 h-10 text-sm font-medium transition-colors border-0 cursor-pointer ${
                  page === 1
                    ? 'bg-[#930712] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-0 cursor-pointer">
              បន្ទាប់
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;