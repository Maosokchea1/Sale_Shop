import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  HeartIcon,
  UsersIcon,
  StarIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const stats = [
    { icon: UsersIcon, value: '10,000+', label: 'អតិថិជនពេញចិត្ត' },
    { icon: ShoppingBagIcon, value: '50,000+', label: 'ផលិតផលបានលក់' },
    { icon: StarIcon, value: '4.8', label: 'ការវាយតម្លៃមធ្យម' },
    { icon: GlobeAltIcon, value: '25', label: 'ខេត្ត/ក្រុង' },
  ];

  const team = [
    { name: 'សុខ ម៉េង', role: 'ស្ថាបនិក & នាយកប្រតិបត្តិ', avatar: 'SM' },
    { name: 'ចាន់ ដារ៉ា', role: 'នាយកបច្ចេកទេស', avatar: 'CD' },
    { name: 'លី ម៉ាលី', role: 'នាយកទីផ្សារ', avatar: 'LM' },
    { name: 'ហេង សុភាព', role: 'នាយកប្រតិបត្តិការ', avatar: 'HS' },
  ];

  const values = [
    { icon: HeartIcon, title: 'គុណភាពជាចម្បង', description: 'យើងជ្រើសរើសតែផលិតផលដែលមានគុណភាពខ្ពស់បំផុតសម្រាប់អតិថិជនរបស់យើង' },
    { icon: TruckIcon, title: 'ដឹកជញ្ជូនលឿន', description: 'ការដឹកជញ្ជូនលឿននិងគួរឱ្យទុកចិត្តទូទាំងប្រទេសកម្ពុជា' },
    { icon: ShieldCheckIcon, title: 'ការទូទាត់សុវត្ថិភាព', description: 'ប្រព័ន្ធទូទាត់ដែលមានសុវត្ថិភាពនិងងាយស្រួលប្រើ' },
    { icon: SparklesIcon, title: 'ការធានាពេញចិត្ត', description: 'ធានាការពេញចិត្ត 100% ឬសងប្រាក់វិញ' },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Hero Section */}
      <section className="bg-[#930712] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sale_Shop
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              យើងជាវេទិកាទិញទំនិញអនឡាញឈានមុខគេនៅកម្ពុជា ដែលផ្តល់ជូននូវផលិតផលគុណភាពខ្ពស់ក្នុងតម្លៃសមរម្យ។ បេសកកម្មរបស់យើងគឺធ្វើឱ្យការទិញទំនិញអនឡាញមានភាពងាយស្រួល សុវត្ថិភាព និងរីករាយសម្រាប់មនុស្សគ្រប់គ្នា។
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-[#930712] px-6 py-3 font-semibold hover:bg-gray-100 transition-colors no-underline"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                ទិញឥឡូវនេះ
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors no-underline"
              >
                ទំនាក់ទំនង
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-[#930712] mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                រឿងរ៉ាវរបស់យើង
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  សាបហាប់ ត្រូវបានបង្កើតឡើងក្នុងឆ្នាំ ២០២០ ដោយមានចក្ខុវិស័យដើម្បីធ្វើបដិវត្តន៍ការទិញទំនិញអនឡាញនៅកម្ពុជា។ យើងចាប់ផ្តើមជាហាងតូចមួយដោយមានផលិតផលតែ ៥០ មុខ ហើយបានរីកចម្រើនទៅជាវេទិកាទិញទំនិញឈានមុខដែលមានផលិតផលរាប់ពាន់មុខ។
                </p>
                <p>
                  យើងធ្វើការដោយផ្ទាល់ជាមួយអ្នកផ្គត់ផ្គង់និងម៉ាកល្បីៗដើម្បីនាំយកផលិតផលដែលមានគុណភាពល្អបំផុតក្នុងតម្លៃប្រកួតប្រជែង។ ក្រុមការងាររបស់យើងមានការប្តេជ្ញាចិត្តក្នុងការផ្តល់នូវបទពិសោធន៍ទិញទំនិញដ៏ល្អបំផុត។
                </p>
              </div>
            </div>
            <div className="bg-[#9307120d] p-8 border border-[#93071233]">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircleIcon className="w-6 h-6 text-[#930712] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">បេសកកម្មរបស់យើង</h3>
                    <p className="text-sm text-gray-600">ផ្តល់ជូននូវបទពិសោធន៍ទិញទំនិញអនឡាញដ៏ល្អបំផុតនៅកម្ពុជា។</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircleIcon className="w-6 h-6 text-[#930712] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">ចក្ខុវិស័យរបស់យើង</h3>
                    <p className="text-sm text-gray-600">ក្លាយជាវេទិកាទិញទំនិញអនឡាញលេខមួយនៅកម្ពុជា។</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              គុណតម្លៃរបស់យើង
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              គោលការណ៍ដែលដឹកនាំអ្វីគ្រប់យ៉ាងដែលយើងធ្វើ
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 hover:border-[#930712] transition-colors group">
                <div className="w-12 h-12 bg-[#9307120d] flex items-center justify-center mb-4 group-hover:bg-[#930712] transition-colors">
                  <value.icon className="w-6 h-6 text-[#930712] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ក្រុមការងាររបស់យើង
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              ជួបជាមួយមនុស្សដែលធ្វើឱ្យអ្វីៗគ្រប់យ៉ាងកើតឡើង
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-[#930712] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:bg-[#7a060f] transition-colors">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#930712] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ត្រៀមខ្លួនចាប់ផ្តើមទិញទំនិញហើយឬនៅ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            ចូលរួមជាមួយអតិថិជនរាប់ពាន់នាក់ដែលទុកចិត្តលើយើងសម្រាប់តម្រូវការទិញទំនិញរបស់ពួកគេ។
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-[#930712] px-8 py-3.5 font-semibold hover:bg-gray-100 transition-colors no-underline"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              ទិញឥឡូវនេះ
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors no-underline"
            >
              <SparklesIcon className="w-5 h-5" />
              បង្កើតគណនី
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;