import { Shield, MapPin, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('features.sos.title'),
      description: t('features.sos.desc'),
    },
    {
      icon: MapPin,
      title: t('features.location.title'),
      description: t('features.location.desc'),
    },
    {
      icon: Bell,
      title: t('features.instant.title'),
      description: t('features.instant.desc'),
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('child-app')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                {t('hero.cta.child')}
              </button>
              <button
                onClick={() => onNavigate('parent-app')}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                {t('hero.cta.parent')}
              </button>
              <button
                onClick={() => onNavigate('school-app')}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                {t('hero.cta.school')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-5">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">{t('safety.disclaimer')}</h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            {t('safety.supportTool')}
          </p>
        </div>
      </section>
    </div>
  );
}
