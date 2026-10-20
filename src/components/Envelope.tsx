import React from 'react';
import { soundEngine } from '../utils/audio';

interface EnvelopeProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen, isOpen }) => {
  const handleClick = () => {
    soundEngine.playLetterOpen();
    onOpen();
  };

  if (isOpen) return null;

  return (
    <div className="fixed right-5 sm:right-7 bottom-12 sm:bottom-14 z-30 select-none">
      {/* Floating Hint tooltip */}
      <div className="text-center mb-2.5 text-[#ffb7d9] text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_0_8px_#ff168b] animate-hint-blink pointer-events-none">
        Chạm vào lá thư nhé 💌
      </div>

      {/* The Envelope */}
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Mở lá thư tình"
        className="relative w-[100px] h-[68px] sm:w-[108px] sm:h-[72px] rounded-[6px] cursor-pointer shadow-[0_0_20px_#ff238e,0_0_35px_rgba(255,35,142,0.45)] hover:shadow-[0_0_30px_#ff238e,0_0_55px_#ff238e] transition-all duration-300 transform hover:scale-105 active:scale-95 animate-envelope-float bg-gradient-to-br from-[#ffb4d9] to-[#ff5ca8]"
      >
        {/* Flap triangle */}
        <div
          className="absolute top-0 left-0 w-0 h-0 z-10"
          style={{
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderTop: '38px solid #ffe0ef',
          }}
        />

        {/* Heart Seal */}
        <div
          className="absolute z-20 text-[26px] drop-shadow-[0_0_6px_#ff0066] animate-seal-beat pointer-events-none"
          style={{
            top: '26px',
            left: '37px',
          }}
        >
          ❤️
        </div>

        {/* Subtle envelope border glow */}
        <div className="absolute inset-0 rounded-[6px] border border-pink-200/50 pointer-events-none" />
      </div>
    </div>
  );
};
