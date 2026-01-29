import { Smartphone, Users, School, Shield, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Product() {
  const { t } = useLanguage();

  const products = [
    {
      icon: Smartphone,
      title: t('product.child.title'),
      description: t('product.child.desc'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Users,
      title: t('product.parent.title'),
      description: t('product.parent.desc'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: School,
      title: t('product.school.title'),
      description: t('product.school.desc'),
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
            {t('product.title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('product.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${product.color} rounded-full mb-6`}>
                <product.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {product.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('product.howItWorks.title')}
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{t('product.howItWorks.step1.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('product.howItWorks.step1.desc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{t('product.howItWorks.step2.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('product.howItWorks.step2.desc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{t('product.howItWorks.step3.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('product.howItWorks.step3.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {t('product.privacy.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
            {t('product.privacy.desc')}
          </p>
        </div>
      </div>
    </div>
  );
}
