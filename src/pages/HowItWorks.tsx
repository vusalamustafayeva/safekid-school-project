import { AlertCircle, MapPin, Bell, Phone, School } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: AlertCircle,
      title: t('howItWorks.step1'),
      description: t('howItWorks.step1.desc'),
    },
    {
      icon: MapPin,
      title: t('howItWorks.step2'),
      description: t('howItWorks.step2.desc'),
    },
    {
      icon: Bell,
      title: t('howItWorks.step3'),
      description: t('howItWorks.step3.desc'),
    },
    {
      icon: Phone,
      title: t('howItWorks.step4'),
      description: t('howItWorks.step4.desc'),
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
            {t('howItWorks.title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="relative">
          {steps.map((step, index) => (
            <div key={index} className="relative mb-12 last:mb-0">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-blue-200 -mb-12"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 bg-green-50 border-l-4 border-green-400 p-8 rounded-r-lg">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <School className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                {t('howItWorks.geofencing.title')}
              </h3>
              <p className="text-green-800 leading-relaxed mb-3">
                {t('howItWorks.geofencing.desc')}
              </p>
              <p className="text-green-800 leading-relaxed">
                {t('howItWorks.geofencing.privacy')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-8 rounded-r-lg">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t('howItWorks.disclaimer.title')}
              </h3>
              <p className="text-blue-800 leading-relaxed">
                {t('safety.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
