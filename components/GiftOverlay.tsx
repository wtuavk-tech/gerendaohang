
import React, { useEffect, useState } from 'react';
import { GiftEvent } from '../types.ts';

interface GiftOverlayProps {
  event: GiftEvent | null;
  onComplete: () => void;
}

export const GiftOverlay: React.FC<GiftOverlayProps> = ({ event, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setVisible(true);
      // Animation duration matches the longest CSS animation
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 500); // Wait for fade out
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [event, onComplete]);

  if (!event || !visible) return null;

  const { gift, senderName, message } = event;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-black/20 backdrop-blur-[2px] animate-fade-in">
        
        {/* Text Overlay */}
        <div className="absolute top-[15%] animate-bounce-in z-20 text-center w-full px-4">
            <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-3 rounded-full shadow-2xl border-4 border-white/30 transform -rotate-2 mb-4">
                <h2 className="text-2xl md:text-3xl font-extrabold drop-shadow-md tracking-wider">{senderName} 送出 {gift.name}</h2>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl max-w-md mx-auto">
                 <p className="text-xl font-bold text-slate-800 leading-relaxed">“{message}”</p>
            </div>
        </div>

        {/* Gift Animations */}
        
        {/* Rocket: Bottom to Top */}
        {gift.type === 'rocket' && (
            <div className="absolute bottom-0 animate-rocket-fly">
                <div className="text-[150px] md:text-[200px] filter drop-shadow-[0_0_50px_rgba(255,100,0,0.8)] transform rotate-[-45deg]">🚀</div>
                <div className="absolute top-[140px] left-[50px] w-10 h-60 bg-gradient-to-b from-orange-500 to-transparent opacity-80 blur-xl animate-pulse"></div>
            </div>
        )}

        {/* Car: Left to Right */}
        {gift.type === 'car' && (
            <div className="absolute bottom-[10%] left-[-20%] animate-car-drive">
                 <div className="text-[120px] md:text-[180px] transform scale-x-[-1] filter drop-shadow-[10px_10px_20px_rgba(0,0,0,0.5)]">🏎️</div>
                 <div className="absolute bottom-2 right-0 w-full h-4 bg-black/20 blur-md rounded-full"></div>
            </div>
        )}

        {/* Yacht: Slow Float */}
        {gift.type === 'yacht' && (
             <div className="absolute bottom-[20%] animate-ship-float w-full flex justify-center">
                 <div className="text-[150px] md:text-[200px] animate-wave-bob filter drop-shadow-2xl">🚢</div>
                 <div className="absolute bottom-[-20px] w-[150%] h-20 bg-blue-500/30 blur-3xl rounded-full"></div>
            </div>
        )}

        {/* Cake: Center Pop */}
        {gift.type === 'cake' && (
            <div className="animate-pop-center relative">
                 <div className="text-[200px] md:text-[250px] filter drop-shadow-2xl z-10 relative">🎂</div>
                 <div className="absolute inset-0 flex items-center justify-center z-0">
                      <div className="w-[500px] h-[500px] bg-gradient-to-r from-pink-200 to-purple-200 rounded-full animate-ping opacity-30"></div>
                 </div>
            </div>
        )}

         {/* Lollipop: Spin & Rain */}
         {gift.type === 'lollipop' && (
            <div className="animate-spin-in relative">
                 <div className="text-[150px] md:text-[200px] filter drop-shadow-2xl">🍭</div>
            </div>
        )}

        {/* Confetti Canvas (CSS approximation) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {[...Array(20)].map((_, i) => (
                 <div 
                    key={i} 
                    className="absolute top-[-10%] text-4xl animate-fall" 
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                    }}
                 >
                    {['🎉', '✨', '🎈', '🎊'][i % 4]}
                 </div>
             ))}
        </div>

        <style>{`
            @keyframes rocket-fly {
                0% { bottom: -20%; transform: translateX(0) scale(1); opacity: 1; }
                20% { transform: translateX(-50px) scale(1.1); }
                80% { opacity: 1; }
                100% { bottom: 150%; transform: translateX(100px) scale(0.5); opacity: 0; }
            }
            .animate-rocket-fly { animation: rocket-fly 4s ease-in forwards; }

            @keyframes car-drive {
                0% { left: -30%; transform: skewX(20deg); }
                40% { left: 40%; transform: skewX(-10deg); }
                60% { left: 50%; transform: skewX(0); }
                100% { left: 120%; transform: skewX(20deg); }
            }
            .animate-car-drive { animation: car-drive 3s ease-in-out forwards; }

            @keyframes ship-float {
                0% { transform: translateX(-120%); }
                100% { transform: translateX(120%); }
            }
            .animate-ship-float { animation: ship-float 8s linear forwards; }

            @keyframes wave-bob {
                0%, 100% { transform: translateY(0) rotate(0); }
                50% { transform: translateY(-20px) rotate(2deg); }
            }
            .animate-wave-bob { animation: wave-bob 2s ease-in-out infinite; }

            @keyframes pop-center {
                0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
                70% { transform: scale(0.9) rotate(-5deg); }
                100% { transform: scale(1) rotate(0); opacity: 0; transition: opacity 1s; }
            }
            .animate-pop-center { animation: pop-center 4s ease-out forwards; }

             @keyframes spin-in {
                0% { transform: scale(0) rotate(0); opacity: 0; }
                50% { transform: scale(1.5) rotate(360deg); opacity: 1; }
                100% { transform: scale(0) rotate(720deg); opacity: 0; }
            }
            .animate-spin-in { animation: spin-in 4s ease-in-out forwards; }

            @keyframes fall {
                0% { top: -10%; transform: rotate(0); }
                100% { top: 110%; transform: rotate(360deg); }
            }
            .animate-fall { animation: fall linear forwards; }
            
            @keyframes bounce-in {
                0% { transform: translateY(-100px); opacity: 0; }
                60% { transform: translateY(20px); opacity: 1; }
                100% { transform: translateY(0); }
            }
            .animate-bounce-in { animation: bounce-in 0.8s ease-out forwards; }

            @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};
