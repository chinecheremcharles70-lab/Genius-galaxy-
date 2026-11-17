import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GameProps {
  level: number;
  ageGroup: '3-5' | '6-8';
  onComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

// ==========================================
// 1. MEMORY CARDS
// ==========================================
interface CardItem {
  id: number;
  pairId: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryCardsGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState(0);

  const iconsPool = ['🚀', '🪐', '⭐', '🛸', '☄️', '🌕', '👾', '🌈'];
  const pairCount = level === 1 ? 3 : 4; // 6 or 8 cards

  useEffect(() => {
    sound.speak('Find the matching pairs of cosmic cards!');
    const selectedIcons = iconsPool.slice(0, pairCount);
    const initialDeck: CardItem[] = [];

    selectedIcons.forEach((icon, idx) => {
      initialDeck.push({ id: idx * 2, pairId: idx, icon, isFlipped: false, isMatched: false });
      initialDeck.push({ id: idx * 2 + 1, pairId: idx, icon, isFlipped: false, isMatched: false });
    });

    setCards(initialDeck.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setMatchesFound(0);
  }, [level, pairCount]);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || flippedIds.length >= 2) return;
    sound.playPop();

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    // Update flip state
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.pairId === secondCard.pairId) {
        sound.playCorrect();
        sound.speak('A match!');

        setCards(prev => prev.map(c => (c.pairId === secondCard.pairId ? { ...c, isMatched: true } : c)));
        setFlippedIds([]);
        const updatedMatches = matchesFound + 1;
        setMatchesFound(updatedMatches);

        if (updatedMatches === pairCount) {
          sound.playLevelFanfare();
          sound.speak('You matched all the cosmic cards! Outstanding!');
          confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 } });
          setTimeout(() => onComplete(3, 350), 1200);
        }
      } else {
        sound.playTryAgain();
        setTimeout(() => {
          setCards(prev => prev.map(c => (newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c)));
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-sky-950 mb-1">Cosmic Memory Cards</h3>
        <p className="text-sm text-sky-800 font-medium">Matches: {matchesFound} / {pairCount}</p>
      </div>

      {/* Grid of Cards */}
      <div className={`grid gap-3 sm:gap-4 w-full max-w-md ${pairCount === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {cards.map(card => {
          const showFront = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={showFront}
              className={`h-24 sm:h-28 rounded-2xl flex items-center justify-center text-4xl shadow-md border-b-4 transition-all duration-300 cursor-pointer ${
                showFront
                  ? 'bg-white border-sky-300 scale-100 rotate-0'
                  : 'bg-sky-600 hover:bg-sky-500 border-sky-800 text-sky-200'
              }`}
            >
              {showFront ? (
                <span className="animate-bounce-gentle">{card.icon}</span>
              ) : (
                <Sparkles className="w-6 h-6 text-sky-300 animate-pulse-subtle" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. ODD ONE OUT
// ==========================================
export const OddOneOutGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [step, setStep] = useState(0);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);

  const puzzles = [
    {
      items: [
        { name: 'Apple', emoji: '🍎', isOdd: false },
        { name: 'Banana', emoji: '🍌', isOdd: false },
        { name: 'Car', emoji: '🚗', isOdd: true },
        { name: 'Orange', emoji: '🍊', isOdd: false },
      ],
      reason: 'A car is a vehicle! All the others are delicious fruits!',
    },
    {
      items: [
        { name: 'Dog', emoji: '🐶', isOdd: false },
        { name: 'Cat', emoji: '🐱', isOdd: false },
        { name: 'Pencil', emoji: '✏️', isOdd: true },
        { name: 'Rabbit', emoji: '🐰', isOdd: false },
      ],
      reason: 'A pencil is a school tool! All the others are furry animals!',
    },
    {
      items: [
        { name: 'Circle', emoji: '🔴', isOdd: false },
        { name: 'Star', emoji: '⭐', isOdd: false },
        { name: 'Triangle', emoji: '🔺', isOdd: false },
        { name: 'Cookie', emoji: '🍪', isOdd: true },
      ],
      reason: 'A cookie is a yummy snack! All the others are geometric shapes!',
    },
  ];

  const current = puzzles[(step + level - 1) % puzzles.length];

  useEffect(() => {
    sound.speak('Which one of these does not belong with the others? Spot the odd one out!');
    setChosenIdx(null);
  }, [current]);

  const handleSelect = (idx: number, isOdd: boolean) => {
    if (chosenIdx !== null) return;
    setChosenIdx(idx);

    if (isOdd) {
      sound.playCorrect();
      sound.speak(`Brilliant deduction! ${current.reason}`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (step >= puzzles.length - 1) {
          onComplete(3, 350);
        } else {
          setStep(s => s + 1);
        }
      }, 1300);
    } else {
      sound.playTryAgain();
      sound.speak('Think about what the items are used for!');
      setTimeout(() => setChosenIdx(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-sky-950 mb-1">Odd One Out</h3>
        <p className="text-sm text-sky-800 font-medium">Which one does not belong in this group?</p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
        {current.items.map((item, idx) => {
          const isChosen = chosenIdx === idx;
          const isRight = isChosen && item.isOdd;
          const isWrong = isChosen && !item.isOdd;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx, item.isOdd)}
              disabled={chosenIdx !== null}
              className={`h-32 rounded-3xl bg-white border-b-4 border-sky-200 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-3 ${
                isRight
                  ? 'bg-emerald-50 border-emerald-500 scale-105'
                  : isWrong
                  ? 'bg-rose-50 border-rose-300 scale-95'
                  : 'hover:bg-sky-50'
              }`}
            >
              <span className="text-6xl mb-1">{item.emoji}</span>
              <span className="text-xs font-bold text-slate-700">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. FIND THE DIFFERENCE
// ==========================================
export const FindDifferenceGame: React.FC<GameProps> = ({ onComplete }) => {
  const [foundDiffs, setFoundDiffs] = useState<number[]>([]);

  // 3 distinct interactive hot-spots on scene B
  const differences = [
    { id: 1, name: 'Sun Sunglasses', x: '50%', y: '25%', hint: 'Look at the happy sun!' },
    { id: 2, name: 'Rainbow Star', x: '78%', y: '65%', hint: 'Check the flower garden!' },
    { id: 3, name: 'Flying Bird', x: '20%', y: '30%', hint: 'Notice anything in the sky?' },
  ];

  useEffect(() => {
    sound.speak('Look carefully at both pictures! Tap the hidden differences on the right picture!');
  }, []);

  const handleSpotDiff = (id: number) => {
    if (foundDiffs.includes(id)) return;
    sound.playCorrect();
    const updated = [...foundDiffs, id];
    setFoundDiffs(updated);

    if (updated.length === differences.length) {
      sound.playLevelFanfare();
      sound.speak('Incredible detective work! You found all the differences!');
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 } });
      setTimeout(() => onComplete(3, 400), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-sky-950 mb-1">Find the Differences</h3>
        <p className="text-sm text-sky-800 font-medium">Found: {foundDiffs.length} / {differences.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Scene 1 (Original) */}
        <div className="relative bg-gradient-to-b from-sky-200 to-emerald-200 border-4 border-sky-300 rounded-3xl p-4 h-56 flex flex-col justify-between overflow-hidden shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-5xl">☀️</span>
            <span className="text-3xl">🕊️</span>
          </div>
          <div className="text-center">
            <span className="text-4xl">🏡</span>
          </div>
          <div className="flex justify-around items-end">
            <span className="text-3xl">🌷</span>
            <span className="text-3xl">🌼</span>
            <span className="text-3xl">🌸</span>
          </div>
          <span className="absolute top-2 left-3 text-xs font-bold text-sky-900 bg-white/70 px-2 py-0.5 rounded-full">Picture A</span>
        </div>

        {/* Scene 2 (Spot Differences Here) */}
        <div className="relative bg-gradient-to-b from-sky-200 to-emerald-200 border-4 border-amber-300 rounded-3xl p-4 h-56 flex flex-col justify-between overflow-hidden shadow-md">
          <div className="flex justify-between items-start">
            {/* Diff 1: Sunglasses on Sun */}
            <button
              onClick={() => handleSpotDiff(1)}
              className={`text-5xl cursor-pointer transition-transform hover:scale-110 ${foundDiffs.includes(1) ? 'ring-4 ring-amber-400 rounded-full' : ''}`}
            >
              😎
            </button>
            {/* Diff 3: Flying Rocket instead of Bird */}
            <button
              onClick={() => handleSpotDiff(3)}
              className={`text-3xl cursor-pointer transition-transform hover:scale-110 ${foundDiffs.includes(3) ? 'ring-4 ring-amber-400 rounded-full' : ''}`}
            >
              🚀
            </button>
          </div>
          <div className="text-center">
            <span className="text-4xl">🏡</span>
          </div>
          <div className="flex justify-around items-end">
            <span className="text-3xl">🌷</span>
            {/* Diff 2: Golden Star instead of Flower */}
            <button
              onClick={() => handleSpotDiff(2)}
              className={`text-3xl cursor-pointer transition-transform hover:scale-110 ${foundDiffs.includes(2) ? 'ring-4 ring-amber-400 rounded-full' : ''}`}
            >
              ⭐
            </button>
            <span className="text-3xl">🌸</span>
          </div>
          <span className="absolute top-2 left-3 text-xs font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full">Picture B (Tap Changes!)</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. WHAT COMES NEXT?
// ==========================================
export const WhatComesNextGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);

  const puzzles = [
    { seq: ['🌙', '⭐', '🌙', '⭐', '?'], ans: '🌙', options: ['🌙', '☀️', '🪐'] },
    { seq: ['1', '3', '5', '7', '?'], ans: '9', options: ['8', '9', '10'] },
    { seq: ['🔴', '🔺', '🔴', '🔺', '?'], ans: '🔴', options: ['🔺', '🔴', '🟩'] },
  ];

  const current = puzzles[(step + level - 1) % puzzles.length];

  useEffect(() => {
    sound.speak('What comes next in the logic chain?');
    setChosen(null);
  }, [current]);

  const handleSelect = (ans: string) => {
    if (chosen !== null) return;
    setChosen(ans);

    if (ans === current.ans) {
      sound.playCorrect();
      sound.speak('Genius! You solved the mystery!');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (step >= puzzles.length - 1) {
          onComplete(3, 400);
        } else {
          setStep(s => s + 1);
        }
      }, 1100);
    } else {
      sound.playTryAgain();
      sound.speak('Check the pattern steps carefully!');
      setTimeout(() => setChosen(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-sky-950 mb-1">What Comes Next?</h3>
        <p className="text-sm text-sky-800 font-medium">Find the missing logic piece!</p>
      </div>

      {/* Sequence */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 bg-white/80 p-4 rounded-3xl border-2 border-sky-200 shadow-sm">
        {current.seq.map((item, idx) => {
          const isGap = item === '?';
          return (
            <div
              key={idx}
              className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold shadow-sm border-2 ${
                isGap ? 'bg-sky-100 border-dashed border-sky-400 text-sky-600 animate-pulse-subtle' : 'bg-white border-sky-100 text-sky-950'
              }`}
            >
              {isGap ? (chosen === current.ans ? current.ans : '?') : item}
            </div>
          );
        })}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {current.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={chosen !== null}
            className={`h-20 rounded-2xl text-4xl border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
              chosen === opt && opt === current.ans
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : chosen === opt && opt !== current.ans
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'bg-white hover:bg-sky-50 border-sky-200 text-sky-950'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
