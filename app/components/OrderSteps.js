import { motion } from 'framer-motion';
import { FaCheck, FaFileInvoice, FaHandScissors, FaBox, FaHandshake, FaHourglass } from 'react-icons/fa';

export default function OrderSteps({ steps }) {
  const getStepIcon = (stepName, isDone, isActive) => {
    if (isDone) {
      return <FaCheck className="w-6 h-6 text-white" />;
    }
    if (!isDone && !isActive) {
      return (
        <motion.div
          animate={{ rotateX: 180 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            repeatDelay: 3 
          }}
        >
          <FaHourglass className="w-6 h-6 text-white" />
        </motion.div>
      );
    }

    switch (stepName) {
      case 'تم إنشاء الفاتورة':
        return <FaFileInvoice className="w-5 h-5 text-white" />;
      case 'جارِ الخياطة':
        return <FaHandScissors className="w-5 h-5 text-white" />;
      case 'جاهز للاستلام':
        return <FaBox className="w-5 h-5 text-white" />;
      case 'تم الاستلام':
        return <FaHandshake className="w-5 h-5 text-white" />;
      default:
        return <FaHourglass className="w-5 h-5 text-white" />;
    }
  };

  let activeStepIndex = steps.length - 1;
  for (; activeStepIndex >= 0; activeStepIndex--) {
    if (steps[activeStepIndex].date) break;
  }

  return (
    <div className="relative pt-4">
      <motion.div 
        className="absolute top-0 left-8 w-1 bg-gradient-to-b from-[#bb8a3c] to-[#bb8a3c]/20 rounded-full"
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {steps.map((step, index) => {
        const isActive = index === activeStepIndex;
        const isDone = index < activeStepIndex;
        const isCompletedDelivery = step.name === 'تم الاستلام' && (isActive || isDone);
        
        // Translate Arabic to English
        const getEnglishName = (arabicName) => {
          switch(arabicName) {
            case 'تم إنشاء الفاتورة':
              return 'Invoice Created';
            case 'جارِ الخياطة':
              return 'Tailoring in Progress';
            case 'جاهز للاستلام':
              return 'Ready for Pickup';
            case 'تم الاستلام':
              return 'Picked Up';
            default:
              return arabicName;
          }
        };

        return (
          <motion.div
            key={step.name}
            className="relative flex items-start mb-4 last:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex-1 bg-white/95 shadow-sm rounded-2xl p-3 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-5">
                <motion.div 
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.2 + 0.1 }}
                >
                  <div className={`
                    relative z-10 flex-shrink-0 w-12 h-12 rounded-full 
                    flex items-center justify-center
                    ${isCompletedDelivery ? 'bg-green-500' : isDone ? 'bg-green-500' : isActive ? 'bg-[#bb8a3c]' : 'bg-[#7c7b7b]'}
                    transition-all duration-300 transform hover:scale-110
                  `}>
                    {getStepIcon(step.name, isDone, isActive)}
                  </div>
                </motion.div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2
                    ${isCompletedDelivery ? 'text-green-600' : isActive ? 'text-[#bb8a3c]' : isDone ? 'text-green-600' : 'text-[#2a2a2a]'}`}>
                    {getEnglishName(step.name)}
                  </h3>
                  {step.date && (
                    <p className="text-sm text-[#7c7b7b] font-medium bg-black/5 px-3 py-1 rounded-full inline-block">
                      {step.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 