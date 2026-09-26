import React, { useState, useEffect } from 'react';
import { useRouter } from './hooks/useRouter';
import { TOOLS } from './data/tools';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { Toast } from './components/common/Toast';

// Pages
import { HomePage } from './components/pages/HomePage';
import { AllToolsPage } from './components/pages/AllToolsPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { DisclaimerPage } from './components/pages/DisclaimerPage';

// The 7 Fully Working Tools
import { WordCounter } from './components/tools/WordCounter';
import { CharacterCounter } from './components/tools/CharacterCounter';
import { CaseConverter } from './components/tools/CaseConverter';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { PercentageCalculator } from './components/tools/PercentageCalculator';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { QrCodeGenerator } from './components/tools/QrCodeGenerator';

// Phase 2 Working Tools
import { JsonFormatter } from './components/tools/JsonFormatter';
import { UrlEncoderDecoder } from './components/tools/UrlEncoderDecoder';
import { Base64EncoderDecoder } from './components/tools/Base64EncoderDecoder';
import { UnitConverter } from './components/tools/UnitConverter';
import { BarcodeGenerator } from './components/tools/BarcodeGenerator';

// Architecture Preview for other tools
import { ToolPreviewPage } from './components/tools/ToolPreviewPage';

export default function App() {
  const { route, navigate } = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (e.key === '/' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render main content area based on current route
  const renderContent = () => {
    switch (route.path) {
      case 'home':
        return (
          <HomePage
            onOpenSearch={() => setSearchOpen(true)}
            onSelectCategory={(cat) => navigate(`/tools?category=${cat}`)}
          />
        );

      case 'tools':
        return <AllToolsPage initialCategory={route.categoryFilter} />;

      case 'tool-detail': {
        const tool = TOOLS.find((t) => t.id === route.toolId);
        if (!tool) {
          return (
            <div className="max-w-xl mx-auto py-24 px-4 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tool Not Found</h2>
              <p className="text-xs text-slate-500 mb-6">
                The requested tool could not be located in our catalog.
              </p>
              <a
                href="#/tools"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Back to All Tools
              </a>
            </div>
          );
        }

        // Render appropriate tool component
        switch (tool.id) {
          case 'word-counter':
            return <WordCounter tool={tool} onToast={showToast} />;
          case 'character-counter':
            return <CharacterCounter tool={tool} onToast={showToast} />;
          case 'case-converter':
            return <CaseConverter tool={tool} onToast={showToast} />;
          case 'age-calculator':
            return <AgeCalculator tool={tool} onToast={showToast} />;
          case 'percentage-calculator':
            return <PercentageCalculator tool={tool} onToast={showToast} />;
          case 'password-generator':
            return <PasswordGenerator tool={tool} onToast={showToast} />;
          case 'qr-code-generator':
            return <QrCodeGenerator tool={tool} onToast={showToast} />;
          case 'json-formatter':
            return <JsonFormatter tool={tool} onToast={showToast} />;
          case 'url-encoder':
            return <UrlEncoderDecoder tool={tool} onToast={showToast} />;
          case 'base64-converter':
            return <Base64EncoderDecoder tool={tool} onToast={showToast} />;
          case 'unit-converter':
            return <UnitConverter tool={tool} onToast={showToast} />;
          case 'barcode-generator':
            return <BarcodeGenerator tool={tool} onToast={showToast} />;
          default:
            return <ToolPreviewPage tool={tool} onToast={showToast} />;
        }
      }

      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'disclaimer':
        return <DisclaimerPage />;

      default:
        return (
          <HomePage
            onOpenSearch={() => setSearchOpen(true)}
            onSelectCategory={(cat) => navigate(`/tools?category=${cat}`)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header onOpenSearch={() => setSearchOpen(true)} currentPath={route.path} />

      <main className="flex-1" id="main-content">
        {renderContent()}
      </main>

      <Footer />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={(toolId) => navigate(`/tools/${toolId}`)}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
