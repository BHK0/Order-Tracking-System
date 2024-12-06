'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import SearchForm from './components/SearchForm';
import OrderSteps from './components/OrderSteps';
import Footer from './components/Footer';

export default function Home() {
  const [orderSteps, setOrderSteps] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const warmUpLambda = async () => {
      try {
        await fetch('https://38j7q7tilk.execute-api.me-south-1.amazonaws.com/prod/order-status?number=0555555555', {
          cache: 'no-store'
        });
      } catch (error) {
      }
    };

    warmUpLambda();
  }, []);

  const handleSearchResult = (data) => {
    setHasSearched(true);
    let displayName = data.customerName || '';
    if (displayName === 'ابراهيم الدبيان') {
      displayName = 'Ibrahim A.';
    }
    setCustomerName(displayName);
    setOrderSteps(data.steps || []);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#efefef]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="relative w-32 h-32 mx-auto">
            <Image 
              className="object-contain transform hover:scale-105 transition-transform duration-300" 
              src="/logo.png"
              alt="HARIR Logo"
              fill
              priority
            />
          </div>
          <h1 className="text-5xl font-bold text-[#bb8a3c] mb-2">
            Order Status
          </h1>
          <p className="text-[#7c7b7b] text-base">Crafting perfection, one stitch at a time</p>
        </div>

        {/* Search Section */}
        <div className="glass-effect rounded-2xl shadow-lg p-4 mb-6 animate-fadeInUp">
          <SearchForm onSearchResult={handleSearchResult} />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="glass-effect rounded-2xl shadow-lg p-4 animate-fadeInUp">
            {customerName ? (
              <>
                <div className="text-xl font-bold text-[#bb8a3c] mb-6 text-center">
                  Welcome {customerName}
                </div>
                <OrderSteps steps={orderSteps} />
              </>
            ) : (
              <div className="text-center text-[#7c7b7b] py-6 animate-fadeInUp">
                No order found with this number
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
