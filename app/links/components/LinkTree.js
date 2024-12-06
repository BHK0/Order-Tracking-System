'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaSnapchat, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  

  export default function LinkTree() {
    const links = [
      {
        name: 'Snapchat',
        icon: <FaSnapchat size={24} />,
        url: 'https://www.snapchat.com/add/harer_sa',
        gradient: 'from-[#FFFC00] to-[#FFE800]'
      },
      {
        name: 'Instagram',
        icon: <FaInstagram size={24} />,
        url: 'https://www.instagram.com/harer.sa/',
        gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
      },
      {
        name: 'WhatsApp',
        icon: <FaWhatsapp size={24} />,
        url: 'https://wa.me/966508956667',
        gradient: 'from-[#25D366] to-[#128C7E]'
      },
      {
        name: 'Our Location',
        icon: <FaMapMarkerAlt size={24} />,
        url: 'https://maps.app.goo.gl/pSsNpoREkL9RWun68?g_st=iw',
        gradient: 'from-[#BB8A3C] to-[#8B6B2E]'
      },
      // {
      //   name: 'Book Appointment', 
      //   icon: <FaCalendarAlt size={24} />,
      //   url: '/booking',
      //   gradient: 'from-[#4CAF50] to-[#388E3C]',
      //   internal: true
      // },
    ];
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
  
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="rounded-full mx-auto shadow-[0_0_20px_rgba(0,0,0,0.3)] w-[150px] h-[65px]">
              <Image
                src="/logo.png"
                alt="HARIR Men's Tailoring"
                width={120}
                height={120}
                className=" m-auto"
              />
            </div>
          </motion.div>
  
          <div className="bg-gradient-to-r from-[#BB8A3C] via-[#D4AF37] to-[#BB8A3C] text-transparent bg-clip-text">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">HARIR</h1>
          </div>
          <p className="text-[#efefef] text-lg md:text-xl font-light">Crafting perfection, one stitch at a time</p>
        </motion.div>
  
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-md space-y-3 md:space-y-4"
        >
          {links.map((link) => (
            <motion.div key={link.name} variants={item}>
              <Link
                href={link.url}
                target={link.internal ? undefined : "_blank"}
                rel={link.internal ? undefined : "noopener noreferrer"}
                prefetch={link.internal ? true : undefined}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-r ${link.gradient} p-[1px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="backdrop-blur-sm bg-[#2a2a2a]/90 rounded-lg p-4 flex items-center justify-between group">
                    <span className="flex items-center gap-3 text-white text-lg font-medium">
                      <motion.span 
                        className="text-white"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {link.icon}
                      </motion.span>
                      {link.name}
                    </span>
                    <motion.span
                      className="text-white transform transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
  
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 md:mt-16 text-[#7c7b7b] text-sm"
        >
          © {new Date().getFullYear()} HARIR Men&apos;s Tailoring
        </motion.div>
      </div>
    );
  }