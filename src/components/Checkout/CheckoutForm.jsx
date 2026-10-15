import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { createOrder } from '../../services/order';
import { createKHQRPayment, verifyPayment } from '../../services/payment';
import { PAYMENT_METHODS } from '../../utils/constants';
import { formatPrice } from '../../utils/currency';
import { 
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  TruckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // State សម្រាប់គ្រប់គ្រង Iframe Modal
  const [iframeCheckoutUrl, setIframeCheckoutUrl] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const pollIntervalRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'khqr',
    saveInfo: false,
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
      }));
    }
  }, [user]);

  // សម្អាត Polling Interval ពេល Component unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'សូមបញ្ចូលឈ្មោះពេញ';
      if (!formData.email.trim()) newErrors.email = 'សូមបញ្ចូលអ៊ីមែល';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ';
      if (!formData.phone.trim()) newErrors.phone = 'សូមបញ្ចូលលេខទូរស័ព្ទ';
      else {
        const phoneClean = formData.phone.replace(/[+\s-]/g, '');
        if (!/^[0-9]{9,10}$/.test(phoneClean)) newErrors.phone = 'សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ (9-10 ខ្ទង់)';
      }
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'សូមបញ្ចូលអាសយដ្ឋាន';
      if (!formData.city.trim()) newErrors.city = 'សូមបញ្ចូលទីក្រុង';
    } else if (step === 3) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'សូមជ្រើសរើសវិធីបង់ប្រាក់';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'អ្នកត្រូវតែយល់ព្រមនឹងលក្ខខណ្ឌ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // មុខងារពិនិត្យស្ថានភាពទូទាត់ប្រាក់ស្វ័យប្រវត្តិតាមរយៈ Polling
  const startPaymentPolling = (transactionId, orderId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await verifyPayment(transactionId);
        console.log('Polling payment status:', res);

        if (res && res.verified === true) {
          clearInterval(pollIntervalRef.current);
          setIframeCheckoutUrl(null);
          showSuccess('ការទូទាត់ប្រាក់ទទួលបានជោគជ័យ!');

          // ១. បញ្ជូនភ្ញៀវទៅកាន់ផ្ទាំងជោគជ័យជាមុនសិន
          navigate(`/payment-success?order_id=${orderId}&tran_id=${transactionId}`, {
            state: { orderId, transactionId }
          });

          // ២. ពន្យារពេលសម្អាតកន្ត្រក ៥០០ms ដើម្បីការពារកុំឱ្យទំព័រ /cart លោតចេញមុន
          setTimeout(() => {
            clearCart();
          }, 500);
        }
      } catch (err) {
        console.error('Polling payment error:', err);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    if (cartItems.length === 0) {
      showError('កន្ត្រករបស់អ្នកទទេ');
      return;
    }

    setLoading(true);
    setShowProcessingOverlay(true);
    setProcessingMessage('កំពុងបង្កើតការបញ្ជាទិញ...');

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        selected_options: item.selectedOptions || {}
      }));

      const fullAddress = `${formData.address}, ${formData.city}${
        formData.postalCode ? `, ${formData.postalCode}` : ''
      }`;
      
      const shippingWithDetails = `${fullAddress}\nPhone: ${formData.phone}\nEmail: ${formData.email}${
        formData.notes ? `\nNotes: ${formData.notes}` : ''
      }`;

      const orderData = {
        items: orderItems,
        shipping_address: shippingWithDetails,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
      };

      const order = await createOrder(orderData);
      setCurrentOrderId(order.id);
      showSuccess('ការបញ្ជាទិញបានបង្កើតដោយជោគជ័យ!');

      if (formData.paymentMethod === 'khqr') {
        setProcessingMessage('កំពុងភ្ជាប់ទៅកាន់ ABA KHQR...');
        
        // ប្រើ Public Domain ដើម្បីបញ្ចៀស Private Network Block របស់ Chrome
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const successRedirectUrl = isLocal 
          ? 'https://my-profolio-mao-sokchea.online/payment-success' 
          : `${window.location.origin}/payment-success`;

        const payment = await createKHQRPayment(order.id, successRedirectUrl);
        const targetCheckoutUrl = payment.checkout_url || payment.payment_url || payment.full_url;

        setShowProcessingOverlay(false);

        if (targetCheckoutUrl) {
          // បើក Iframe Modal លើ Web ផ្ទាល់
          setIframeCheckoutUrl(targetCheckoutUrl);

          if (payment.transaction_id) {
            startPaymentPolling(payment.transaction_id, order.id);
          }
        } else {
          navigate(`/payment-success?order_id=${order.id}`);
          setTimeout(() => clearCart(), 500);
        }

      } else if (formData.paymentMethod === 'cash') {
        setShowProcessingOverlay(false);
        navigate(`/payment-success?order_id=${order.id}`);
        setTimeout(() => clearCart(), 500);
        showSuccess('ការបញ្ជាទិញបានដាក់ដោយជោគជ័យ! អ្នកនឹងបង់ប្រាក់ពេលទទួលទំនិញ។');
      } else {
        setShowProcessingOverlay(false);
        navigate(`/payment-success?order_id=${order.id}`);
        setTimeout(() => clearCart(), 500);
      }
    } catch (error) {
      setShowProcessingOverlay(false);
      showError(error.response?.data?.detail || 'មិនអាចបង្កើតការបញ្ជាទិញបានទេ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    const orderId = currentOrderId;
    setIframeCheckoutUrl(null);
    if (orderId) {
      navigate(`/payment-success?order_id=${orderId}`);
      setTimeout(() => clearCart(), 500);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { id: 1, label: 'ទំនាក់ទំនង', icon: UserIcon },
    { id: 2, label: 'ដឹកជញ្ជូន', icon: TruckIcon },
    { id: 3, label: 'ការទូទាត់', icon: CreditCardIcon },
  ];

  return (
    <>
      {/* 1. Processing Overlay */}
      {showProcessingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 md:p-10 max-w-md w-full mx-4 text-center rounded-2xl shadow-xl" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#9307120d] rounded-full mb-6">
              <svg className="animate-spin h-10 w-10 text-[#930712]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">សូមរង់ចាំ</h2>
            <p className="text-gray-600 mb-6 text-sm">{processingMessage}</p>
          </div>
        </div>
      )}

      {/* 2. Official KHQR Iframe Modal */}
      {iframeCheckoutUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] h-[630px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
            {/* Close Button */}
            <button 
              type="button"
              onClick={handleCloseModal}
              className="absolute top-3.5 right-4 z-20 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors border-0 cursor-pointer"
              title="បិទ"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Iframe */}
            <iframe 
              src={iframeCheckoutUrl} 
              className="w-full h-full border-0"
              title="Anajakpay KHQR Checkout"
            />
          </div>
        </div>
      )}

      {/* 3. Checkout Form */}
      <form onSubmit={handleSubmit} style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  className={`flex items-center gap-2 ${
                    currentStep > step.id ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep === step.id
                      ? 'bg-[#930712] text-white'
                      : currentStep > step.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 transition-all ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">ព័ត៌មានទំនាក់ទំនង</h2>
                <p className="text-sm text-gray-500">យើងនឹងប្រើព័ត៌មាននេះដើម្បីផ្ញើព័ត៌មានថ្មីៗ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ឈ្មោះពេញ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                    errors.fullName 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-gray-200 focus:border-[#930712]'
                  }`}
                  placeholder="ឈ្មោះ នាមត្រកូល"
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  អ៊ីមែល <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-gray-200 focus:border-[#930712]'
                    }`}
                    placeholder="example@email.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  លេខទូរស័ព្ទ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                      errors.phone 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-gray-200 focus:border-[#930712]'
                    }`}
                    placeholder="012 345 678"
                  />
                </div>
                {errors.phone ? (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">សម្រាប់ព័ត៌មានដឹកជញ្ជូន</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-[#930712] text-white px-8 py-3.5 font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
              >
                បន្តទៅការដឹកជញ្ជូន
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Shipping Address */}
        {currentStep === 2 && (
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                <TruckIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">អាសយដ្ឋានដឹកជញ្ជូន</h2>
                <p className="text-sm text-gray-500">តើយើងគួរដឹកជញ្ជូនទំនិញទៅកន្លែងណា?</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  អាសយដ្ឋាន <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full pl-10 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-none ${
                      errors.address 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-gray-200 focus:border-[#930712]'
                    }`}
                    placeholder="ផ្ទះលេខ ផ្លូវ"
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    ទីក្រុង <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                      errors.city 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-gray-200 focus:border-[#930712]'
                    }`}
                    placeholder="ភ្នំពេញ"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    លេខប្រៃសណីយ៍ <span className="text-gray-400">(ស្រេចចិត្ត)</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-all"
                    placeholder="12000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  កំណត់ចំណាំ <span className="text-gray-400">(ស្រេចចិត្ត)</span>
                </label>
                <div className="relative">
                  <DocumentTextIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-all resize-none"
                    placeholder="ការណែនាំពិសេសសម្រាប់ការដឹកជញ្ជូន..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors px-4 py-2 border-0 bg-transparent cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ត្រឡប់ក្រោយ
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-[#930712] text-white px-8 py-3.5 font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
              >
                បន្តទៅការទូទាត់
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">វិធីបង់ប្រាក់</h2>
                <p className="text-sm text-gray-500">ជ្រើសរើសរបៀបដែលអ្នកចង់បង់ប្រាក់</p>
              </div>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} 
                  className={`relative flex items-start gap-4 p-4 border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === method.id
                      ? 'border-[#930712] bg-[#9307120d]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-2xl mt-0.5">{method.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{method.name}</p>
                      {formData.paymentMethod === method.id && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5">
                          <CheckCircleIcon className="w-3 h-3" />
                          បានជ្រើសរើស
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                  </div>
                  {formData.paymentMethod === method.id && (
                    <CheckCircleIcon className="w-5 h-5 text-[#930712] absolute top-3 right-3" />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 border-gray-300 text-[#930712] focus:ring-[#930712]"
                />
                <div>
                  <span className="text-sm text-gray-700">
                    ខ្ញុំយល់ព្រមនឹង{' '}
                    <Link to="/terms" className="text-[#930712] hover:text-[#7a060f] font-medium no-underline">លក្ខខណ្ឌសេវាកម្ម</Link>
                    {' '}និង{' '}
                    <Link to="/privacy" className="text-[#930712] hover:text-[#7a060f] font-medium no-underline">គោលការណ៍ឯកជនភាព</Link>
                  </span>
                  {errors.agreeToTerms && <p className="text-xs text-red-500 mt-1">{errors.agreeToTerms}</p>}
                </div>
              </label>
            </div>

            <div className="mt-6 bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">សង្ខេបការបញ្ជាទិញ</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">សរុបរង ({getCartCount()} ទំនិញ)</span>
                  <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ការដឹកជញ្ជូន</span>
                  <span className="text-emerald-600 font-medium">ឥតគិតថ្លៃ</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-gray-900">សរុប</span>
                    <span className="text-lg font-bold text-[#930712]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors px-4 py-2 border-0 bg-transparent cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ត្រឡប់ទៅការដឹកជញ្ជូន
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center gap-3 bg-[#930712] text-white px-10 py-3.5 font-semibold hover:bg-[#7a060f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    កំពុងដំណើរការ...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    បញ្ជាទិញ • {formatPrice(total)}
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LockClosedIcon className="w-4 h-4" />
                <span>ការទូទាត់សុវត្ថិភាព</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default CheckoutForm;