/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Share, 
  Phone, 
  MessageSquare, 
  Bike, 
  User, 
  MapPin,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Rider {
  name: string;
  vehicle: string;
  status: string;
  arrivalMinutes: number;
}

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => {
  const segments = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1 w-full h-1.5 mt-4">
      {segments.map((s, i) => {
        const isFilled = i < progress;
        const isCurrent = i === progress - 1;
        
        return (
          <div key={s} className="flex-1 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isFilled ? '100%' : '0%' }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: i * 0.1 }}
              className="h-full bg-[#00CCBC]"
            />
            {isCurrent && (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-[#00CCBC]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const InteractiveMap = () => {
  // Simple simulated map using a draggable container
  return (
    <div className="relative w-full h-full bg-[#E5E7EB] overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        drag
        dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
        className="absolute w-[1200px] h-[1200px] top-[-400px] left-[-400px]"
        style={{
          backgroundImage: `radial-gradient(#D1D5DB 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundColor: '#F3F4F6'
        }}
      >
        {/* Simulated Streets */}
        <div className="absolute top-[500px] left-0 w-full h-24 bg-white/50 -rotate-12 flex items-center px-20">
          <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Radstock St</span>
        </div>
        <div className="absolute top-0 left-[600px] w-24 h-full bg-white/50 rotate-12 flex flex-col justify-center items-center py-20">
          <span className="text-gray-400 font-mono text-xs uppercase tracking-widest [writing-mode:vertical-rl]">High St</span>
        </div>

        {/* User Marker */}
        <div className="absolute top-[600px] left-[600px] -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full scale-[3] animate-pulse" />
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10" />
          </div>
        </div>

        {/* Rider Marker */}
        <motion.div 
          animate={{ 
            x: [550, 580, 570],
            y: [650, 620, 630]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "linear"
          }}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative group">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Sharokh is here
            </div>
            <div className="w-10 h-10 bg-[#00CCBC] rounded-full flex items-center justify-center border-2 border-white shadow-xl">
              <Bike size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00CCBC] rotate-45 border-r border-b border-white" />
          </div>
        </motion.div>

        {/* Destination Marker */}
        <div className="absolute top-[550px] left-[650px] -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl">
            <User size={20} className="text-white" />
          </div>
        </div>
      </motion.div>
      
      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50">
          <Navigation size={20} />
        </button>
      </div>

      {/* Google Logo Mock */}
      <div className="absolute bottom-4 left-4">
        <span className="text-gray-400 font-bold text-lg opacity-50 italic">Google</span>
      </div>
    </div>
  );
};

export default function App() {
  const [progress, setProgress] = useState(4);
  const rider: Rider = {
    name: "Sharokh khan",
    vehicle: "Scooter",
    status: "nearby",
    arrivalMinutes: 2
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-[#2E3333]">
      {/* Header Section */}
      <div className="px-5 pt-12 pb-4 bg-white shadow-sm z-30">
        <div className="flex justify-between items-center mb-6">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-1"
          >
            <ChevronDown size={28} className="text-[#00CCBC]" />
          </motion.button>
          
          <div className="flex items-center gap-6">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-1"
            >
              <Share size={24} className="text-[#00CCBC]" />
            </motion.button>
            <button className="text-[#00CCBC] font-bold text-lg">Order help</button>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#FF5E00] font-bold text-sm uppercase tracking-wide">Updated arrival</p>
            <h1 className="text-4xl font-black mt-1">{rider.arrivalMinutes} minutes</h1>
            <p className="text-gray-500 text-lg mt-1">{rider.name} is {rider.status}</p>
          </div>
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-[#00CCBC]/10 rounded-xl flex items-center justify-center overflow-hidden"
            >
              <img 
                src="https://picsum.photos/seed/delivery/200/200" 
                alt="Avatar" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>

        <ProgressBar progress={progress} />
      </div>

      {/* Code Section */}
      <div className="px-5 py-5 flex justify-between items-center border-b border-gray-100 bg-white z-20">
        <div>
          <h3 className="font-bold text-lg">Give your rider this code</h3>
          <p className="text-gray-500">After you've received your order</p>
        </div>
        <div className="flex gap-2">
          {['4', '8'].map((num, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="w-12 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-3xl font-black"
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
        <InteractiveMap />
      </div>

      {/* Bottom Delivery Info */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white p-5 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl z-30"
      >
        <h2 className="text-2xl font-black mb-4">Delivery</h2>
        
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Bike className="text-gray-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">{rider.name}</h4>
              <p className="text-gray-500">{rider.vehicle}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#00CCBC] hover:bg-gray-50"
            >
              <Phone size={22} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#00CCBC] hover:bg-gray-50"
            >
              <MessageSquare size={22} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
