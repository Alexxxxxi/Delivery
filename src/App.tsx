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
  // Grid-based map with horizontal and vertical roads
  const hRoads = [200, 400, 600, 800, 1000];
  const vRoads = [200, 400, 600, 800, 1000];

  return (
    <div className="relative w-full h-full bg-[#E5E7EB] overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        drag
        dragConstraints={{ left: -600, right: 600, top: -600, bottom: 600 }}
        className="absolute w-[1200px] h-[1200px] top-[-600px] left-[-600px]"
        style={{
          backgroundColor: '#F3F4F6',
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      >
        {/* Main Grid Roads */}
        {hRoads.map(y => (
          <div key={`h-${y}`} className="absolute left-0 right-0 h-12 bg-white/80 shadow-sm flex items-center px-20 text-[9px] text-gray-300 font-mono uppercase tracking-widest" style={{ top: y }}>
            Street {y/80}
          </div>
        ))}
        {vRoads.map(x => (
          <div key={`v-${x}`} className="absolute top-0 bottom-0 w-12 bg-white/80 shadow-sm flex flex-col justify-center items-center py-20 text-[9px] text-gray-300 font-mono uppercase tracking-widest [writing-mode:vertical-rl]" style={{ left: x }}>
            Avenue {x/80}
          </div>
        ))}

        {/* User Marker (Fixed at intersection 600, 600) */}
        <div className="absolute top-[600px] left-[600px] -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full scale-[4] animate-pulse" />
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10" />
          </div>
        </div>

        {/* Rider Marker following a route */}
        <motion.div 
          animate={{ 
            x: [200, 400, 400, 600, 600, 580], 
            y: [800, 800, 600, 600, 600, 600]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative group">
            <div className="w-9 h-9 bg-[#00CCBC] rounded-full flex items-center justify-center border-2 border-white shadow-xl">
              <Bike size={18} className="text-white" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00CCBC] rotate-45 border-r border-b border-white" />
          </div>
        </motion.div>

        {/* Destination Marker (Restaurant at 200, 800) */}
        <div className="absolute top-[800px] left-[200px] -translate-x-1/2 -translate-y-1/2">
          <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl">
            <User size={18} className="text-white" />
          </div>
        </div>
      </motion.div>
      
      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50">
          <Navigation size={18} />
        </button>
      </div>

      {/* Google Logo Mock */}
      <div className="absolute bottom-4 left-4">
        <span className="text-gray-400 font-bold text-xs opacity-50 italic">Google</span>
      </div>
    </div>
  );
};

const RiderAvatar = () => (
  <div className="w-full h-full bg-[#E0F7F6] flex items-center justify-center overflow-hidden">
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      {/* Background Circle */}
      <circle cx="32" cy="32" r="32" fill="#00CCBC" fillOpacity="0.1" />
      {/* Body/Shoulders */}
      <path d="M10 64 Q32 40 54 64" fill="#00CCBC" />
      {/* Neck */}
      <rect x="28" y="35" width="8" height="8" fill="#FFD1BA" />
      {/* Face */}
      <path d="M20 28 Q20 12 32 12 Q44 12 44 28 Q44 42 32 42 Q20 42 20 28" fill="#FFD1BA" />
      {/* Helmet */}
      <path d="M18 26 Q18 8 32 8 Q46 8 46 26 L46 30 L18 30 Z" fill="#00CCBC" />
      {/* Helmet Visor */}
      <path d="M20 26 H44 V29 H20 Z" fill="#333" fillOpacity="0.8" />
      {/* Eyes (behind visor) */}
      <circle cx="27" cy="24" r="1.5" fill="#fff" />
      <circle cx="37" cy="24" r="1.5" fill="#fff" />
    </svg>
  </div>
);

const PrizeRevealCard = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute inset-0 flex items-center justify-center p-6 bg-[#F3F4F6] z-40"
    >
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden text-center">
        {/* Simple Confetti Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, 400], 
                rotate: [0, 360],
                x: [0, (i % 2 === 0 ? 50 : -50)]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 2
              }}
              className="absolute w-2 h-2 rounded-sm"
              style={{ 
                backgroundColor: ['#00CCBC', '#FF5E00', '#3B82F6', '#F59E0B'][i % 4],
                left: `${Math.random() * 100}%`,
                top: `-20px`
              }}
            />
          ))}
        </div>

        <p className="text-[#FF5E00] font-black text-xs tracking-[0.2em] mb-4">GAME OVER</p>
        
        {/* Prize Icon */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-full h-full bg-[#E0F7F6] rounded-3xl flex items-center justify-center text-6xl shadow-inner border-4 border-[#00CCBC]/20"
          >
            🥤
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-lg"
          >
            ✨
          </motion.div>
        </div>

        <h2 className="text-2xl font-black leading-tight mb-3">
          Your Rider Won a<br />
          <span className="text-[#00CCBC]">Free Drink Token!</span>
        </h2>
        
        <p className="text-gray-500 text-sm mb-8 px-4">
          The prize has been automatically sent to their account.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full py-4 bg-[#00CCBC] text-white rounded-2xl font-bold shadow-lg shadow-[#00CCBC]/20 hover:bg-[#00B8A9] transition-colors"
        >
          Complete Order
        </motion.button>
      </div>
    </motion.div>
  );
};

const GameInvitationModal = ({ isOpen, onClose, onAccept }: { isOpen: boolean, onClose: () => void, onAccept: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          
          {/* Bottom Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 z-[101] shadow-2xl"
          >
            <div className="max-w-md mx-auto">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              
              <h2 className="text-2xl font-black text-center leading-tight mb-2">
                READY TO PLAY WITH<br />YOUR RIDER?
              </h2>
              <p className="text-gray-500 text-center text-sm mb-6">
                Win a discount or a surprise treat!
              </p>

              {/* Spinning Wheel Placeholder */}
              <div className="relative w-48 h-48 mx-auto mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full border-8 border-[#00CCBC] relative overflow-hidden shadow-inner"
                  style={{
                    background: `conic-gradient(
                      #00CCBC 0deg 30deg,
                      #F3F4F6 30deg 60deg,
                      #00CCBC 60deg 90deg,
                      #F3F4F6 90deg 120deg,
                      #00CCBC 120deg 150deg,
                      #F3F4F6 150deg 180deg,
                      #00CCBC 180deg 210deg,
                      #F3F4F6 210deg 240deg,
                      #00CCBC 240deg 270deg,
                      #F3F4F6 270deg 300deg,
                      #00CCBC 300deg 330deg,
                      #F3F4F6 330deg 360deg
                    )`
                  }}
                >
                </motion.div>
                
                {/* Pointer */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#2E3333] drop-shadow-md" />
                </div>
                
                {/* Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-4 border-[#00CCBC] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#00CCBC] rounded-full" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Pass
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onAccept}
                  className="flex-1 py-4 px-6 bg-[#00CCBC] text-white rounded-2xl font-bold shadow-lg shadow-[#00CCBC]/20 hover:bg-[#00B8A9] transition-colors"
                >
                  YES!
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [progress, setProgress] = useState(4);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isGameStarted && !isDelivered) {
        setIsInvitationOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isGameStarted, isDelivered]);

  const handleAcceptInvitation = () => {
    setIsInvitationOpen(false);
    setIsGameStarted(true);
    console.log("用户接受了游戏邀请，准备开始游戏过渡");
    
    // Start 5 second timer for delivery
    setTimeout(() => {
      setIsDelivered(true);
    }, 5000);
  };

  const handleCompleteOrder = () => {
    window.location.reload(); // Simple reset for demo
  };
  const rider: Rider = {
    name: "Sharokh khan",
    vehicle: "Scooter",
    status: "nearby",
    arrivalMinutes: 2
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-[#2E3333]">
      {/* Game Invitation Modal */}
      <GameInvitationModal 
        isOpen={isInvitationOpen} 
        onClose={() => setIsInvitationOpen(false)} 
        onAccept={handleAcceptInvitation}
      />

      {/* Header Section */}
      <div className="px-5 pt-4 pb-3 bg-white shadow-sm z-30">
        <div className="flex justify-between items-center mb-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-1"
          >
            <ChevronDown size={24} className="text-[#00CCBC]" />
          </motion.button>
          
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-1"
            >
              <Share size={20} className="text-[#00CCBC]" />
            </motion.button>
            <button className="text-[#00CCBC] font-bold text-base">Order help</button>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <AnimatePresence mode="wait">
            {isDelivered ? (
              <motion.div
                key="delivered"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-2"
              >
                <h1 className="text-3xl font-black leading-tight">The food has been<br />delivered.</h1>
              </motion.div>
            ) : (
              <motion.div
                key="tracking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-[#FF5E00] font-bold text-xs uppercase tracking-wide">Updated arrival</p>
                <h1 className="text-2xl font-black mt-0.5">{rider.arrivalMinutes} minutes</h1>
                <p className="text-gray-500 text-sm mt-0.5">{rider.name} is {rider.status}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-[#00CCBC]/10 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <RiderAvatar />
            </motion.div>
          </div>
        </div>

        <ProgressBar progress={isDelivered ? 5 : progress} />
      </div>

      {/* Code Section */}
      <AnimatePresence>
        {!isDelivered && (
          <motion.div 
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            className="px-5 py-3 flex justify-between items-center border-b border-gray-100 bg-white z-20"
          >
            <div>
              <h3 className="font-bold text-base">Give your rider this code</h3>
              <p className="text-gray-500 text-xs">After you've received your order</p>
            </div>
            <div className="flex gap-1.5">
              {['4', '8'].map((num, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-10 h-11 bg-gray-100 rounded-md flex items-center justify-center text-xl font-black"
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Section */}
      <div className="flex-1 relative overflow-hidden">
        <div className={`w-full h-full transition-opacity duration-1000 ${isDelivered ? 'opacity-0' : 'opacity-100'}`}>
          <InteractiveMap />
        </div>
        
        <AnimatePresence>
          {isDelivered && (
            <PrizeRevealCard onComplete={handleCompleteOrder} />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Delivery Info */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl z-30"
      >
        <h2 className="text-xl font-black mb-3">Delivery</h2>
        
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Bike className="text-gray-400" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight">{rider.name}</h4>
              <p className="text-gray-500 text-xs">{rider.vehicle}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#00CCBC] hover:bg-gray-50"
            >
              <Phone size={18} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#00CCBC] hover:bg-gray-50"
            >
              <MessageSquare size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
