import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { updateProfile } from '../services/auth';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'សូមបញ្ចូលឈ្មោះពេញ';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ';
    }
    
    if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const updateData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const updatedUser = await updateProfile(updateData);
      setUser(updatedUser);
      showSuccess('ប្រវត្តិរូបត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!');
      
      setFormData(prev => ({
        ...prev,
        password: '',
        confirm_password: '',
      }));
    } catch (error) {
      showError(error.response?.data?.detail || 'ការធ្វើបច្ចុប្បន្នភាពបរាជ័យ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-[#930712] transition-colors no-underline">ទំព័រដើម</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">ប្រវត្តិរូប</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#930712] flex items-center justify-center text-white text-2xl font-bold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ប្រវត្តិរូបរបស់ខ្ញុំ</h1>
            <p className="text-gray-500 text-sm mt-1">គ្រប់គ្រងព័ត៌មានគណនីរបស់អ្នក</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 md:p-8 space-y-6">
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
                className={`w-full pl-11 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors ${
                  errors.full_name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#930712]'
                }`}
                style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                placeholder="ឈ្មោះ នាមត្រកូល"
                required
              />
            </div>
            {errors.full_name && (
              <p className="text-xs text-red-500 mt-1.5">{errors.full_name}</p>
            )}
          </div>

          {/* Email (Disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              អ៊ីមែល
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user?.email}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none cursor-not-allowed"
                style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                disabled
              />
              <LockClosedIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">មិនអាចផ្លាស់ប្តូរអ៊ីមែលបានទេ</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              លេខទូរស័ព្ទ
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-colors"
                style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                placeholder="012 345 678"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <KeyIcon className="w-5 h-5 text-[#930712]" />
              <h3 className="text-lg font-semibold text-gray-900">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              ទុកទទេប្រសិនបើអ្នកមិនចង់ផ្លាស់ប្តូរពាក្យសម្ងាត់
            </p>
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ពាក្យសម្ងាត់ថ្មី
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors ${
                      errors.password ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#930712]'
                    }`}
                    style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                    placeholder="ទុកទទេដើម្បីរក្សាពាក្យសម្ងាត់បច្ចុប្បន្ន"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors ${
                      errors.confirm_password 
                        ? 'border-red-300 focus:border-red-400' 
                        : formData.password && formData.confirm_password && formData.password === formData.confirm_password
                          ? 'border-emerald-300 focus:border-emerald-400'
                          : 'border-gray-200 focus:border-[#930712]'
                    }`}
                    style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                    placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.confirm_password}</p>
                )}
                {formData.password && formData.confirm_password && formData.password === formData.confirm_password && (
                  <p className="text-xs text-emerald-500 mt-1.5 flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    ពាក្យសម្ងាត់ត្រូវគ្នា
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#930712] text-white py-3.5 font-semibold hover:bg-[#7a060f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                កំពុងធ្វើបច្ចុប្បន្នភាព...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                ធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប
              </>
            )}
          </button>
        </form>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#930712] transition-colors no-underline group"
          >
            <ShoppingBagIcon className="w-6 h-6 text-gray-400 group-hover:text-[#930712] transition-colors" />
            <div>
              <p className="text-sm font-semibold text-gray-900">ការបញ្ជាទិញរបស់ខ្ញុំ</p>
              <p className="text-xs text-gray-500">មើលប្រវត្តិការបញ្ជាទិញ</p>
            </div>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#930712] transition-colors no-underline group"
          >
            <ShieldCheckIcon className="w-6 h-6 text-gray-400 group-hover:text-[#930712] transition-colors" />
            <div>
              <p className="text-sm font-semibold text-gray-900">ជំនួយ</p>
              <p className="text-xs text-gray-500">ទាក់ទងផ្នែកគាំទ្រ</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;