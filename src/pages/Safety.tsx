import { Shield, Lock, Database, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Safety() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('safety.gdpr.title'),
      description: t('safety.gdpr.desc'),
    },
    {
      icon: Lock,
      title: t('safety.encryption.title'),
      description: t('safety.encryption.desc'),
    },
    {
      icon: Database,
      title: t('safety.minimal.title'),
      description: t('safety.minimal.desc'),
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
            {t('safety.title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('safety.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-10 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Welche Daten werden erfasst?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Standortdaten</h3>
                <p className="text-gray-600 leading-relaxed">Nur im Notfall, wenn der SOS-Knopf gedrückt wird</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Kontoinformationen</h3>
                <p className="text-gray-600 leading-relaxed">Name, E-Mail für die Kontoerstellung</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Familien-Verknüpfungen</h3>
                <p className="text-gray-600 leading-relaxed">Verbindung zwischen Eltern und Kindern</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-r-lg mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-3">
                Wichtiger Sicherheitshinweis
              </h3>
              <p className="text-red-700 leading-relaxed">
                {t('safety.disclaimer')} SafeKid ist ein präventives und unterstützendes Werkzeug,
                aber kein Ersatz für professionelle Rettungsdienste und Polizei.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projektkontext</h2>
          <p className="text-gray-600 leading-relaxed">
            SafeKid ist ein Schulprojekt im Rahmen des Fachabiturs in Deutschland.
            Es dient zu Demonstrationszwecken und ist ein Prototyp. Die Sicherheits-
            und Datenschutzprinzipien entsprechen professionellen Standards, aber
            das System ist nicht für den produktiven Einsatz vorgesehen.
          </p>
        </div>
      </div>
    </div>
  );
}
