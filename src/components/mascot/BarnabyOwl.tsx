import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface BarnabyOwlProps {
  message?: string;
  mood?: 'happy' | 'talking' | 'celebrating' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const ENCOURAGING_QUOTES = [
  "Hoo-hoo! You're a brilliant explorer!",
  "Every time you practice, your brain grows stronger!",
  "Great thinkers take their time and have fun!",
  "I believe in you! Let's discover something new!",
  "High five with a feather! You are a Little Genius!"
];

export const BarnabyOwl: React.FC<BarnabyOwlProps> = ({
  message = "Hoo hoo! Welcome to Little Genius Academy! Tap any world to start playing!",
  mood = 'happy',
  size = 'md',
  interactive = true,
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isWaving, setIsWaving] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  const handleTap = () => {
    if (!interactive) return;
    sound.playPop();
    sound.playAnimalSound('owl');
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 900);

    const randomQuote = ENCOURAGING_QUOTES[Math.floor(Math.random() * ENCOURAGING_QUOTES.length)];
    setCurrentMessage(randomQuote);
    sound.speak(`Barnaby says: ${randomQuote}`);
  };

  const handleSpeakSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    sound.speak(`Barnaby says: ${currentMessage}`);
  };

  const scale = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-28 md:h-28';

  return (
    <div className="flex items-center gap-3">
      {/* Interactive Mascot SVG */}
      <button
        onClick={handleTap}
        type="button"
        className={`relative ${scale} shrink-0 focus:outline-none transition-transform active:scale-95 cursor-pointer group`}
        title="Tap Barnaby the Owl for encouragement!"
        aria-label="Barnaby the Owl Mascot"
      >
        <div className={`w-full h-full drop-shadow-md transition-all duration-300 ${mood === 'celebrating' || isWaving ? 'animate-bounce-gentle scale-105' : ''}`}>
          <svg viewBox="0 0 160 160" className="w-full h-full">
            {/* Body base */}
            <defs>
              <linearGradient id="owlBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="owlBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
              <linearGradient id="glassesGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Ear Tufts */}
            <polygon points="45,45 28,18 60,32" fill="#92400E" />
            <polygon points="115,45 132,18 100,32" fill="#92400E" />
            <polygon points="48,43 36,26 58,34" fill="#F59E0B" />
            <polygon points="112,43 124,26 102,34" fill="#F59E0B" />

            {/* Main Round Body */}
            <ellipse cx="80" cy="95" rx="58" ry="52" fill="url(#owlBody)" />

            {/* Soft Cream Belly with Feather Dapples */}
            <ellipse cx="80" cy="104" rx="38" ry="36" fill="url(#owlBelly)" />
            {/* Dapples */}
            <path d="M 68 88 Q 74 96 80 88" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 80 88 Q 86 96 92 88" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 74 102 Q 80 110 86 102" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 68 116 Q 74 124 80 116" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 80 116 Q 86 124 92 116" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wings */}
            {/* Left Wing */}
            <ellipse
              cx="26"
              cy="95"
              rx="14"
              ry="32"
              fill="#78350F"
              transform={isWaving || mood === 'celebrating' ? 'rotate(-20 26 95)' : 'rotate(-8 26 95)'}
              className="transition-transform duration-300 origin-center"
            />
            {/* Right Wing */}
            <ellipse
              cx="134"
              cy="95"
              rx="14"
              ry="32"
              fill="#78350F"
              transform={isWaving || mood === 'celebrating' ? 'rotate(24 134 95)' : 'rotate(8 134 95)'}
              className="transition-transform duration-300 origin-center"
            />

            {/* Big Round Eyes Background */}
            <circle cx="58" cy="62" r="22" fill="#FFFFFF" stroke="#92400E" strokeWidth="2" />
            <circle cx="102" cy="62" r="22" fill="#FFFFFF" stroke="#92400E" strokeWidth="2" />

            {/* Pupils with sparkle */}
            <circle cx="60" cy="62" r="10" fill="#1E293B" />
            <circle cx="100" cy="62" r="10" fill="#1E293B" />
            {/* Catchlight reflections */}
            <circle cx="57" cy="58" r="3.5" fill="#FFFFFF" />
            <circle cx="63" cy="64" r="1.5" fill="#FFFFFF" />
            <circle cx="97" cy="58" r="3.5" fill="#FFFFFF" />
            <circle cx="103" cy="64" r="1.5" fill="#FFFFFF" />

            {/* Scholar Glasses */}
            <circle cx="58" cy="62" r="20" fill="none" stroke="url(#glassesGold)" strokeWidth="3.5" />
            <circle cx="102" cy="62" r="20" fill="none" stroke="url(#glassesGold)" strokeWidth="3.5" />
            <line x1="78" y1="62" x2="82" y2="62" stroke="url(#glassesGold)" strokeWidth="4" strokeLinecap="round" />

            {/* Golden Beak */}
            <polygon points="80,70 70,82 90,82" fill="#F59E0B" />
            <polygon points="80,87 72,82 88,82" fill="#D97706" />

            {/* Graduation Cap / Scholar Mortarboard */}
            <polygon points="80,12 135,28 80,44 25,28" fill="#1E1B4B" />
            <rect x="56" y="32" width="48" height="10" rx="3" fill="#312E81" />
            {/* Tassel Button */}
            <circle cx="80" cy="28" r="3" fill="#FBBF24" />
            {/* Dangling Yellow Tassel */}
            <path d="M 80 28 Q 110 32 118 52" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
            <circle cx="118" cy="53" r="3.5" fill="#F59E0B" />

            {/* Little Feet Claws */}
            <ellipse cx="64" cy="148" rx="8" ry="5" fill="#F59E0B" />
            <ellipse cx="96" cy="148" rx="8" ry="5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Small badge sparkle indicator */}
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-sm text-xs flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
        </span>
      </button>

      {/* Speech Bubble */}
      {currentMessage && (
        <div className="relative bg-white border-2 border-amber-200 shadow-md rounded-2xl px-4 py-3 max-w-sm sm:max-w-md text-slate-800 text-sm md:text-base leading-snug">
          {/* Bubble tail */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-slate-700">{currentMessage}</p>
            <button
              onClick={handleSpeakSpeech}
              type="button"
              className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors shrink-0"
              title="Hear Barnaby read this aloud"
              aria-label="Read message aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
