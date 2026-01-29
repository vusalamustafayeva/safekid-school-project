import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ChildApp from './pages/ChildApp';
import ParentApp from './pages/ParentApp';
import SchoolApp from './pages/SchoolApp';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'product':
        return <Product />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'safety':
        return <Safety />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <Contact />;
      case 'child-app':
        return <ChildApp />;
      case 'parent-app':
        return <ParentApp />;
      case 'school-app':
        return <SchoolApp />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  const isAppView = currentPage === 'child-app' || currentPage === 'parent-app' || currentPage === 'school-app';

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col">
          {!isAppView && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
          <main className={isAppView ? '' : 'flex-1'}>
            {renderPage()}
          </main>
          {!isAppView && <Footer onNavigate={setCurrentPage} />}
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
