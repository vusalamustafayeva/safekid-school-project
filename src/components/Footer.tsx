import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('product')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.product')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.howItWorks')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.safety')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav.safety')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 BBS Cora Berliner Schulprojekt</p>
        </div>
      </div>
    </footer>
  );
}
