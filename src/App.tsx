import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ExplorePage } from './pages/ExplorePage';
import { DealsPage } from './pages/DealsPage';
import { SmartFinderPage } from './pages/SmartFinderPage';
import { StoresPage } from './pages/StoresPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { AddProductModal } from './components/forms/AddProductModal';
import { AddPriceModal } from './components/forms/AddPriceModal';
import { AddStoreModal } from './components/stores/AddStoreModal';
import { RateProductModal } from './components/forms/RateProductModal';
import { AuthModal } from './pages/AuthModal';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('explore');
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    modalTargetProduct,
    isAddProductOpen,
    setIsAddProductOpen,
    isAddPriceOpen,
    setIsAddPriceOpen,
    isAddStoreOpen,
    setIsAddStoreOpen,
    isRateProductOpen,
    setIsRateProductOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    setSelectedStoreId,
  } = useAppData();

  const handleSelectStoreFilter = (storeId: string) => {
    setSelectedStoreId(storeId);
    setCurrentTab('explore');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Header for Desktop and Mobile */}
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {currentTab === 'explore' && (
          <ExplorePage
            onNavigateToDeals={() => setCurrentTab('deals')}
            onNavigateToSmartFinder={() => setCurrentTab('smart_finder')}
          />
        )}

        {currentTab === 'deals' && <DealsPage />}

        {currentTab === 'smart_finder' && (
          <SmartFinderPage onSelectStoreFilter={handleSelectStoreFilter} />
        )}

        {currentTab === 'stores' && (
          <StoresPage onSelectStoreFilter={handleSelectStoreFilter} />
        )}

        {currentTab === 'profile' && <ProfilePage />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* GLOBAL MODALS */}
      {selectedProductForDetail && (
        <ProductDetailModal
          stats={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onSelectStoreFilter={handleSelectStoreFilter}
        />
      )}

      {isAddProductOpen && (
        <AddProductModal
          onClose={() => setIsAddProductOpen(false)}
          onProductCreated={() => {
            // Can trigger add price automatically
          }}
        />
      )}

      {isAddPriceOpen && (
        <AddPriceModal
          initialProduct={modalTargetProduct}
          onClose={() => setIsAddPriceOpen(false)}
        />
      )}

      {isAddStoreOpen && (
        <AddStoreModal onClose={() => setIsAddStoreOpen(false)} />
      )}

      {isRateProductOpen && modalTargetProduct && (
        <RateProductModal
          product={modalTargetProduct}
          onClose={() => setIsRateProductOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <AppContent />
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
