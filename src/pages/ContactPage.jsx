import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { 
  FaFacebookF, 
  FaTiktok, 
  FaInstagram, 
  FaYoutube,
  FaTelegramPlane
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: MapPinIcon, title: 'អាសយដ្ឋាន', value: 'ផ្ទះលេខ ១២៣ ផ្លូវព្រះនរោត្តម សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន ភ្នំពេញ កម្ពុជា' },
    { icon: PhoneIcon, title: 'ទូរស័ព្ទ', value: '+៨៥៥ ១២ ៣៤៥ ៦៧៨' },
    { icon: EnvelopeIcon, title: 'អ៊ីមែល', value: 'support@shophub.com.kh' },
    { icon: ClockIcon, title: 'ម៉ោងធ្វើការ', value: 'ចន្ទ - សុក្រ: ៨:០០ ព្រឹក - ៦:០០ ល្ងាច | សៅរ៍: ៨:០០ ព្រឹក - ១២:០០ ថ្ងៃត្រង់' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: FaTiktok, href: '#', label: 'TikTok', color: 'hover:bg-black' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-[#E4405F]' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:bg-[#FF0000]' },
    { icon: FaTelegramPlane, href: '#', label: 'Telegram', color: 'hover:bg-[#0088cc]' },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Hero Section */}
      <section className="bg-[#930712] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm mb-4 text-white/70">
              <Link to="/" className="hover:text-white transition-colors no-underline">ទំព័រដើម</Link>
              <span>/</span>
              <span className="text-white">ទំនាក់ទំនង</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              ទំនាក់ទំនងយើង
            </h1>
            <p className="text-lg text-white/90">
              មានសំណួរ ឬយោបល់? យើងចង់ឮពីអ្នក។ ផ្ញើសារមកយើង ហើយយើងនឹងឆ្លើយតបក្នុងពេលឆាប់ៗ។
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ព័ត៌មានទំនាក់ទំនង
                </h2>
                <div className="space-y-5">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="w-10 h-10 bg-[#9307120d] flex items-center justify-center flex-shrink-0 group-hover:bg-[#930712] transition-colors">
                        <info.icon className="w-5 h-5 text-[#930712] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-sm text-gray-500">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  តាមដានយើង
                </h2>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-600 ${social.color} hover:text-white transition-colors`}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ផ្ញើសារមកយើង
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  បំពេញទម្រង់ខាងក្រោម ហើយយើងនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។
                </p>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">សារត្រូវបានផ្ញើ!</h3>
                    <p className="text-gray-600">
                      សូមអរគុណសម្រាប់ការទាក់ទងមកយើង។ យើងនឹងឆ្លើយតបក្នុងពេលឆាប់ៗនេះ។
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          ឈ្មោះពេញ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-colors"
                          style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                          placeholder="ឈ្មោះ នាមត្រកូល"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          អ៊ីមែល <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-colors"
                          style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          លេខទូរស័ព្ទ
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-colors"
                          style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                          placeholder="012 345 678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          ប្រធានបទ <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#930712] transition-colors cursor-pointer bg-white"
                          style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                        >
                          <option value="">ជ្រើសរើសប្រធានបទ</option>
                          <option value="order">សំណួរអំពីការបញ្ជាទិញ</option>
                          <option value="product">សំណួរអំពីផលិតផល</option>
                          <option value="shipping">សំណួរអំពីការដឹកជញ្ជូន</option>
                          <option value="payment">សំណួរអំពីការទូទាត់</option>
                          <option value="return">ការប្រគល់ទំនិញ</option>
                          <option value="other">ផ្សេងៗ</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        សារ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-colors resize-none"
                        style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                        placeholder="សរសេរសាររបស់អ្នកនៅទីនេះ..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-[#930712] text-white px-8 py-3.5 font-semibold hover:bg-[#7a060f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          កំពុងផ្ញើ...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          ផ្ញើសារ
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-gray-200 h-[400px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="w-12 h-12 text-[#930712] mx-auto mb-3" />
              <p className="text-gray-500 font-medium">ទីតាំងហាងរបស់យើង</p>
              <p className="text-sm text-gray-400 mt-1">ភ្នំពេញ, កម្ពុជា</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#9307120d] border border-[#93071233] p-8 text-center">
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-[#930712] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              ត្រូវការជំនួយបន្ទាន់?
            </h2>
            <p className="text-gray-600 mb-4">
              ក្រុមគាំទ្ររបស់យើងរង់ចាំជួយអ្នក។ ឆ្លើយតបក្នុងរយៈពេលតិចជាង ២៤ ម៉ោង។
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a 
                href="tel:+85512345678" 
                className="inline-flex items-center gap-2 bg-[#930712] text-white px-6 py-3 font-semibold hover:bg-[#7a060f] transition-colors no-underline"
              >
                <PhoneIcon className="w-5 h-5" />
                ហៅទូរស័ព្ទឥឡូវនេះ
              </a>
              <a 
                href="mailto:support@shophub.com.kh" 
                className="inline-flex items-center gap-2 border-2 border-[#930712] text-[#930712] px-6 py-3 font-semibold hover:bg-[#930712] hover:text-white transition-colors no-underline"
              >
                <EnvelopeIcon className="w-5 h-5" />
                ផ្ញើអ៊ីមែល
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;