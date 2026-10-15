import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { register } from '../../services/auth';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'សូមបញ្ចូលឈ្មោះពេញ';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'ឈ្មោះត្រូវមានយ៉ាងហោចណាស់ ២ តួអក្សរ';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'សូមបញ្ចូលអ៊ីមែល';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ';
    }
    
    if (formData.phone_number && !/^[0-9+\-\s]{8,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ';
    }
    
    if (!formData.password) {
      newErrors.password = 'សូមបញ្ចូលពាក្យសម្ងាត់';
    } else if (formData.password.length < 8) {
      newErrors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'ពាក្យសម្ងាត់ត្រូវមានអក្សរធំ អក្សរតូច និងលេខ';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'សូមបញ្ជាក់ពាក្យសម្ងាត់';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'អ្នកត្រូវតែយល់ព្រមនឹងលក្ខខណ្ឌ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = {
    0: 'bg-gray-200',
    1: 'bg-red-400',
    2: 'bg-orange-400',
    3: 'bg-amber-400',
    4: 'bg-emerald-400',
    5: 'bg-emerald-500',
  };
  const strengthLabels = {
    0: '',
    1: 'ខ្សោយ',
    2: 'មធ្យម',
    3: 'ល្អ',
    4: 'ខ្លាំង',
    5: 'ខ្លាំងណាស់',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await register(formData);
      showSuccess('ការចុះឈ្មោះជោគជ័យ! សូមស្វាគមន៍មកកាន់ សាបហាប់។');
      navigate('/login');
    } catch (error) {
      showError(error.response?.data?.detail || 'ការចុះឈ្មោះបរាជ័យ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group no-underline">
            <div className="w-12 h-12 bg-[#930712] text-white flex items-center justify-center text-xl font-bold">
              S
            </div>
            <span className="text-2xl font-bold text-gray-900">សាបហាប់</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              បង្កើតគណនីរបស់អ្នក
            </h1>
            <p className="text-gray-500">
              ចូលរួមជាមួយ សាបហាប់ ហើយចាប់ផ្តើមទិញទំនិញថ្ងៃនេះ
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ឈ្មោះពេញ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                    errors.full_name 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-gray-200 focus:border-[#930712]'
                  }`}
                  placeholder="ឈ្មោះ នាមត្រកូល"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
              {errors.full_name && (
                <p className="text-xs text-red-500 mt-1.5">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                អ៊ីមែល <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-gray-200 focus:border-[#930712]'
                  }`}
                  placeholder="example@email.com"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                លេខទូរស័ព្ទ <span className="text-gray-400">(ស្រេចចិត្ត)</span>
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                    errors.phone_number 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-gray-200 focus:border-[#930712]'
                  }`}
                  placeholder="(+855) 12345678"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
              {errors.phone_number && (
                <p className="text-xs text-red-500 mt-1.5">{errors.phone_number}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ពាក្យសម្ងាត់ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-gray-200 focus:border-[#930712]'
                  }`}
                  placeholder="បង្កើតពាក្យសម្ងាត់រឹងមាំ"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 transition-all ${
                          level <= passwordStrength 
                            ? strengthColors[passwordStrength]
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength <= 1 ? 'text-red-500' :
                    passwordStrength <= 2 ? 'text-orange-500' :
                    passwordStrength <= 3 ? 'text-amber-500' :
                    'text-emerald-500'
                  }`}>
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
              
              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-400 font-medium">ពាក្យសម្ងាត់ត្រូវមាន:</p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: '៨+ តួអក្សរ', met: formData.password.length >= 8 },
                    { label: 'អក្សរធំ', met: /[A-Z]/.test(formData.password) },
                    { label: 'អក្សរតូច', met: /[a-z]/.test(formData.password) },
                    { label: 'លេខ', met: /\d/.test(formData.password) },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <CheckCircleIcon 
                        className={`w-3.5 h-3.5 ${
                          req.met ? 'text-emerald-500' : 'text-gray-300'
                        }`} 
                      />
                      <span className={`text-xs ${
                        req.met ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                បញ្ជាក់ពាក្យសម្ងាត់ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
                    errors.confirm_password 
                      ? 'border-red-300 focus:border-red-400' 
                      : formData.confirm_password && formData.password === formData.confirm_password
                        ? 'border-emerald-300 focus:border-emerald-400'
                        : 'border-gray-200 focus:border-[#930712]'
                  }`}
                  placeholder="បញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.confirm_password}</p>
              )}
              {formData.confirm_password && formData.password === formData.confirm_password && (
                <p className="text-xs text-emerald-500 mt-1.5 flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  ពាក្យសម្ងាត់ត្រូវគ្នា
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-gray-300 text-[#930712] focus:ring-[#930712]"
                />
                <span className="text-sm text-gray-600">
                  ខ្ញុំយល់ព្រមនឹង{' '}
                  <Link to="/terms" className="text-[#930712] hover:text-[#7a060f] font-medium no-underline">លក្ខខណ្ឌសេវាកម្ម</Link>
                  {' '}និង{' '}
                  <Link to="/privacy" className="text-[#930712] hover:text-[#7a060f] font-medium no-underline">គោលការណ៍ឯកជនភាព</Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1.5">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-[#930712] text-white py-3.5 font-semibold hover:bg-[#7a060f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  កំពុងបង្កើតគណនី...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  បង្កើតគណនី
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          មានគណនីរួចហើយ?{' '}
          <Link 
            to="/login" 
            className="font-semibold text-[#930712] hover:text-[#7a060f] transition-colors no-underline"
          >
            ចូលគណនី
          </Link>
        </p>

        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>ព័ត៌មានរបស់អ្នកមានសុវត្ថិភាព និងត្រូវបានអ៊ិនគ្រីប</span>
        </div>
      </div>
    </div>
  );
};

export default Register;