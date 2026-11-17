import React, { useState, useEffect } from 'react';
import { SHAPES_DATA } from '../../data/learningWorlds';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GameProps {
  level: number;
  ageGroup: '3-5' | '6-8';
  onComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

// ==========================================
// 1. COLOUR MATCHING
// ==========================================
export const ColourMatchingGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [round, setRound] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const colors = [
    { name: 'Red', hex: '#EF4444', item: '🍓', hint: 'Like a sweet strawberry!' },
    { name: 'Blue', hex: '#3B82F6', item: '🫐', hint: 'Like blueberries and the wide ocean!' },
    { name: 'Yellow', hex: '#EAB308', item: '🍋', hint: 'Like a bright sour lemon!' },
    { name: 'Green', hex: '#10B981', item: '🍏', hint: 'Like a crisp green apple!' },
    { name: 'Purple', hex: '#A855F7', item: '🍇', hint: 'Like juicy bunches of grapes!' },
    { name: 'Orange', hex: '#F97316', item: '🍊', hint: 'Like a fresh sweet orange!' },
  ];

  const current = colors[(round + level - 1) % colors.length];
  // 3 color choices including current
  const otherColors = colors.filter(c => c.name !== current.name).sort(() => Math.random() - 0.5);
  const choices = [current, otherColors[0], otherColors[1]].sort(() => Math.random() - 0.5);

  useEffect(() => {
    sound.speak(`Can you find the colour ${current.name}? ${current.hint}`);
    setSelectedColor(null);
  }, [current]);

  const handleSelect = (name: string) => {
    if (selectedColor !== null) return;
    setSelectedColor(name);

    if (name === current.name) {
      sound.playCorrect();
      sound.speak(`Wonderful! That is beautiful ${current.name}!`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (round >= 2) {
          onComplete(3, 300);
        } else {
          setRound(r => r + 1);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Let's look closely at the fruit and try again!`);
      setTimeout(() => setSelectedColor(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-purple-950 mb-1">Colour Matching</h3>
        <p className="text-sm text-purple-800 font-medium">Match the fruit with its correct colour swatch!</p>
      </div>

      {/* Picture Card with Fruit */}
      <div className="w-40 h-40 rounded-3xl bg-white border-4 border-purple-200 shadow-md flex flex-col items-center justify-center mb-8 p-3">
        <span className="text-6xl mb-1">{current.item}</span>
        <span className="font-kid text-lg font-bold text-purple-900">{current.name}</span>
      </div>

      {/* 3 Color swatches to pick from */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {choices.map(c => {
          const isSelected = selectedColor === c.name;
          const isRight = isSelected && c.name === current.name;
          const isWrong = isSelected && c.name !== current.name;

          return (
            <button
              key={c.name}
              onClick={() => handleSelect(c.name)}
              disabled={selectedColor !== null}
              className={`h-24 rounded-2xl flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer p-2 ${
                isRight
                  ? 'ring-4 ring-emerald-400 scale-105'
                  : isWrong
                  ? 'opacity-60 scale-95'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex, borderColor: 'rgba(0,0,0,0.2)' }}
            >
              <span className="text-white font-extrabold text-lg drop-shadow-md">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. FIND THE CORRECT SHAPE
// ==========================================
export const ShapeFinderGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const current = SHAPES_DATA[(idx + level - 1) % SHAPES_DATA.length];
  const others = SHAPES_DATA.filter(s => s.name !== current.name).sort(() => Math.random() - 0.5);
  const choices = [current, others[0], others[1]].sort(() => Math.random() - 0.5);

  useEffect(() => {
    sound.speak(`Can you find the ${current.name}? ${current.clue}`);
    setSelectedShape(null);
  }, [current]);

  const handleSelect = (name: string) => {
    if (selectedShape !== null) return;
    setSelectedShape(name);

    if (name === current.name) {
      sound.playCorrect();
      sound.speak(`Yes! That is a ${current.name}! You're a shape star!`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (idx >= 2) {
          onComplete(3, 350);
        } else {
          setIdx(i => i + 1);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Count the sides and corners!`);
      setTimeout(() => setSelectedShape(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-purple-950 mb-1">Find the Correct Shape</h3>
        <p className="text-sm text-purple-800 font-medium">{current.clue}</p>
      </div>

      {/* Target prompt */}
      <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl px-6 py-3 mb-8 shadow-sm">
        <span className="text-xl sm:text-2xl font-black text-purple-900 font-kid">Find the: {current.name}</span>
      </div>

      {/* 3 Shapes to choose from */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {choices.map(s => {
          const isSelected = selectedShape === s.name;
          const isRight = isSelected && s.name === current.name;
          const isWrong = isSelected && s.name !== current.name;

          return (
            <button
              key={s.name}
              onClick={() => handleSelect(s.name)}
              disabled={selectedShape !== null}
              className={`h-32 rounded-3xl bg-white border-b-4 border-purple-200 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-3 ${
                isRight
                  ? 'bg-emerald-50 border-emerald-500 scale-105'
                  : isWrong
                  ? 'bg-rose-50 border-rose-300 scale-95'
                  : 'hover:bg-purple-50'
              }`}
            >
              <span className="text-5xl mb-2">{s.emoji}</span>
              <span className="text-xs font-bold text-slate-700">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. SORT THE COLOURS
// ==========================================
export const SortColoursGame: React.FC<GameProps> = ({ onComplete }) => {
  // Items to sort into Red, Blue, or Yellow bucket
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', color: 'red', emoji: '🍎' },
    { id: 2, name: 'Blueberry', color: 'blue', emoji: '🫐' },
    { id: 3, name: 'Banana', color: 'yellow', emoji: '🍌' },
    { id: 4, name: 'Heart', color: 'red', emoji: '❤️' },
    { id: 5, name: 'Ocean Drop', color: 'blue', emoji: '💧' },
    { id: 6, name: 'Star', color: 'yellow', emoji: '⭐' },
  ]);

  const [activeItem, setActiveItem] = useState<{ id: number; name: string; color: string; emoji: string } | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setActiveItem(items[0]);
      sound.speak(`Sort this ${items[0].name} into the matching paint bucket!`);
    } else {
      sound.playLevelFanfare();
      sound.speak('Hurray! All colours are sorted into their buckets!');
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => onComplete(3, 400), 1200);
    }
  }, [items, onComplete]);

  const handleBucketDrop = (targetColor: string) => {
    if (!activeItem) return;

    if (activeItem.color === targetColor) {
      sound.playCorrect();
      sound.speak(`Yes! ${activeItem.name} is ${targetColor}!`);
      setItems(prev => prev.filter(i => i.id !== activeItem.id));
    } else {
      sound.playTryAgain();
      sound.speak(`Oops! That's not the matching colour.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-purple-950 mb-1">Sort the Colours</h3>
        <p className="text-sm text-purple-800 font-medium">Tap the matching color bucket for the toy!</p>
      </div>

      {/* Active Item to Sort */}
      {activeItem ? (
        <div className="w-32 h-32 rounded-3xl bg-white border-4 border-purple-300 shadow-lg flex flex-col items-center justify-center mb-8 animate-bounce-gentle">
          <span className="text-6xl">{activeItem.emoji}</span>
          <span className="text-xs font-bold text-slate-700 mt-1">{activeItem.name}</span>
        </div>
      ) : (
        <div className="h-32 mb-8 flex items-center justify-center text-emerald-600 font-bold">
          All sorted!
        </div>
      )}

      {/* 3 Color Buckets */}
      <div className="grid grid-cols-3 gap-4 w-full">
        <button
          onClick={() => handleBucketDrop('red')}
          className="h-28 rounded-3xl bg-red-500 hover:bg-red-400 border-b-6 border-red-700 active:border-b-0 active:translate-y-1 text-white shadow-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all"
        >
          <span className="text-3xl mb-1">🪣</span>
          <span className="font-extrabold text-sm uppercase tracking-wide">Red Bucket</span>
        </button>

        <button
          onClick={() => handleBucketDrop('blue')}
          className="h-28 rounded-3xl bg-blue-500 hover:bg-blue-400 border-b-6 border-blue-700 active:border-b-0 active:translate-y-1 text-white shadow-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all"
        >
          <span className="text-3xl mb-1">🪣</span>
          <span className="font-extrabold text-sm uppercase tracking-wide">Blue Bucket</span>
        </button>

        <button
          onClick={() => handleBucketDrop('yellow')}
          className="h-28 rounded-3xl bg-amber-400 hover:bg-amber-300 border-b-6 border-amber-600 active:border-b-0 active:translate-y-1 text-amber-950 shadow-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all"
        >
          <span className="text-3xl mb-1">🪣</span>
          <span className="font-extrabold text-sm uppercase tracking-wide">Yellow Bucket</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 4. COMPLETE THE PATTERN
// ==========================================
export const CompletePatternGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);

  const patterns = [
    { seq: ['🔴', '🔵', '🔴', '🔵', '?'], ans: '🔴', options: ['🔴', '🔵', '🟢'] },
    { seq: ['🔺', '🟩', '🔺', '🟩', '?'], ans: '🔺', options: ['🟩', '🔺', '⭐'] },
    { seq: ['⭐', '⭐', '💖', '⭐', '⭐', '?'], ans: '💖', options: ['⭐', '💖', '🔷'] },
  ];

  const current = patterns[(step + level - 1) % patterns.length];

  useEffect(() => {
    sound.speak('What comes next in the pattern?');
    setChosen(null);
  }, [current]);

  const handleSelect = (emoji: string) => {
    if (chosen !== null) return;
    setChosen(emoji);

    if (emoji === current.ans) {
      sound.playCorrect();
      sound.speak('Super! You solved the pattern!');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (step >= patterns.length - 1) {
          onComplete(3, 400);
        } else {
          setStep(s => s + 1);
        }
      }, 1100);
    } else {
      sound.playTryAgain();
      sound.speak('Look at the repeating pattern again!');
      setTimeout(() => setChosen(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-purple-950 mb-1">Complete the Pattern</h3>
        <p className="text-sm text-purple-800 font-medium">Which piece comes next in the line?</p>
      </div>

      {/* Pattern row */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 bg-white/80 p-4 rounded-3xl border-2 border-purple-200 shadow-sm">
        {current.seq.map((item, idx) => {
          const isGap = item === '?';
          return (
            <div
              key={idx}
              className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm border-2 ${
                isGap
                  ? 'bg-purple-100 border-dashed border-purple-400 animate-pulse-subtle'
                  : 'bg-white border-purple-100'
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
                : 'bg-white hover:bg-purple-50 border-purple-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
