'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SearchForm({ onSearchResult }) {
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState('');

  useEffect(() => {
    setNumber('0503424405');
  }, []);

  const convertToEnglishNumerals = (value) => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = value;
    for (let i = 0; i < arabicNumerals.length; i++) {
      result = result.replace(new RegExp(arabicNumerals[i], 'g'), englishNumerals[i]);
    }
    return result;
  };

  const validatePhoneNumber = (num) => {
    if (num.length === 9 && num.startsWith('5')) {
      return true;
    }
    if (num.length === 10 && num.startsWith('05')) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number) return;

    const englishNumberRegex = /^[0-9]*$/;
    if (!englishNumberRegex.test(number)) {
      alert('Please enter English numbers only (0-9)');
      setNumber('');
      return;
    }

    if (!validatePhoneNumber(number)) {
      alert('Please enter a valid phone number');
      setNumber('');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://38j7q7tilk.execute-api.me-south-1.amazonaws.com/prod/order-status?number=${number}`);
      const data = await response.json();
      onSearchResult(data);
    } catch (error) {
      console.error('Error fetching order status:', error);
      onSearchResult({ customerName: '', steps: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative flex gap-1 items-stretch">
        <motion.input
          type="tel"
          value={number}
          onChange={(e) => setNumber(convertToEnglishNumerals(e.target.value))}
          placeholder="Enter your phone number"
          className="w-[65%] px-4 py-3 text-base rounded-l-2xl
                     bg-white/80 backdrop-blur-sm
                     border-2 border-[#bb8a3c]/20
                     focus:border-[#bb8a3c] focus:ring-2 focus:ring-[#bb8a3c]/20
                     transition-all duration-300
                     text-center placeholder:text-[#7c7b7b]"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        
        <motion.button 
          type="submit"
          disabled={loading || !number}
          className="flex-1 px-6 py-3 text-base font-medium whitespace-nowrap
                   bg-[#bb8a3c] text-white rounded-r-2xl
                   hover:bg-[#bb8a3c]/90
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-[#bb8a3c]/30
                   shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Loading...</span>
            </div>
          ) : (
            'Track Order'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}