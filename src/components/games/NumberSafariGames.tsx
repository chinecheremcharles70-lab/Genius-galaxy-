import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GameProps {
  level: number;
  ageGroup: '3-5' | '6-8';
  onComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

// ==========================================
// 1. COUNT THE ANIMALS
// ==========================================
export const CountAnimalsGame: React.FC<GameProps> = ({ level, ageGroup, onComplete }) => {
  // Number of animals to count scales by level
  const targetCount = ageGroup === '3-5' ? Math.min(8, level + 2) : Math.min(15, level * 3 + 3);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);

  // Position animals casually across the sunny field
  const animalIcons = ['🦒', '🦁', '🦓', '🐘', '🐒', '🦛'];
  const currentIcon = animalIcons[(level - 1) % animalIcons.length];

  useEffect(() => {
    sound.speak(`Tap every ${currentIcon} to count them, then choose how many there are!`);
    setTappedIndices([]);
    setSelectedTotal(null);
  }, [currentIcon, level]);

  const handleTapAnimal = (idx: number) => {
    if (tappedIndices.includes(idx)) return;
    sound.playPop();
    const newTapped = [...tappedIndices, idx];
    setTappedIndices(newTapped);
    sound.speak(`${newTapped.length}`);
  };

  const options = [targetCount - 1, targetCount, targetCount + 1].sort(() => Math.random() - 0.5);

  const handleSelectOption = (num: number) => {
    if (selectedTotal !== null) return;
    setSelectedTotal(num);

    if (num === targetCount) {
      sound.playCorrect();
      sound.speak(`Bingo! There are ${targetCount} animals!`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        onComplete(3, 300);
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Not quite! Let's count them again.`);
      setTimeout(() => setSelectedTotal(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-amber-950 mb-1">Count the Safari Animals</h3>
        <p className="text-sm text-amber-800 font-medium">Tap each animal to count! Counted: {tappedIndices.length} / {targetCount}</p>
      </div>

      {/* Safari Savanna Pen */}
      <div className="w-full bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-300 rounded-3xl p-6 shadow-inner min-h-[220px] flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
        {Array.from({ length: targetCount }).map((_, idx) => {
          const isTapped = tappedIndices.includes(idx);
          const tapOrder = tappedIndices.indexOf(idx) + 1;

          return (
            <button
              key={idx}
              onClick={() => handleTapAnimal(idx)}
              className={`relative text-5xl sm:text-6xl p-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                isTapped ? 'scale-105 bg-amber-300/60 shadow-sm' : 'hover:scale-110'
              }`}
            >
              <span>{currentIcon}</span>
              {isTapped && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow">
                  {tapOrder}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Number Selection */}
      <div className="w-full max-w-md">
        <p className="text-center text-sm font-bold text-amber-900 mb-2">How many did you count?</p>
        <div className="grid grid-cols-3 gap-4">
          {options.map(num => (
            <button
              key={num}
              onClick={() => handleSelectOption(num)}
              disabled={selectedTotal !== null}
              className={`h-16 rounded-2xl text-3xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
                selectedTotal === num && num === targetCount
                  ? 'bg-emerald-500 border-emerald-700 text-white'
                  : selectedTotal === num && num !== targetCount
                  ? 'bg-rose-400 border-rose-600 text-white'
                  : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. NUMBER MATCHING
// ==========================================
export const NumberMatchingGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [round, setRound] = useState(0);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

  const rounds = [
    { target: 4, item: '🥥', text: 'Four Coconuts', options: [2, 4, 5] },
    { target: 6, item: '🍌', text: 'Six Bananas', options: [6, 3, 7] },
    { target: 8, item: '🍍', text: 'Eight Pineapples', options: [5, 8, 9] },
    { target: 5, item: '🥭', text: 'Five Mangoes', options: [4, 5, 6] },
  ];

  const current = rounds[(round + level - 1) % rounds.length];

  useEffect(() => {
    sound.speak(`Count the fruit treats and choose the matching number!`);
    setSelectedDigit(null);
  }, [current]);

  const handleSelect = (digit: number) => {
    if (selectedDigit !== null) return;
    setSelectedDigit(digit);

    if (digit === current.target) {
      sound.playCorrect();
      sound.speak(`That's right! Exactly ${current.target}!`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (round >= 2) {
          onComplete(3, 300);
        } else {
          setRound(r => r + 1);
        }
      }, 1100);
    } else {
      sound.playTryAgain();
      sound.speak(`Count again with me!`);
      setTimeout(() => setSelectedDigit(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-amber-950 mb-1">Number Matching</h3>
        <p className="text-sm text-amber-800 font-medium">Match the fruit basket to the right number!</p>
      </div>

      {/* Visual Item Cluster */}
      <div className="w-full bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-md mb-8 flex flex-wrap items-center justify-center gap-3 min-h-[160px]">
        {Array.from({ length: current.target }).map((_, idx) => (
          <span key={idx} className="text-5xl animate-bounce-gentle" style={{ animationDelay: `${idx * 0.1}s` }}>
            {current.item}
          </span>
        ))}
      </div>

      {/* Digit choices */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {current.options.map(digit => (
          <button
            key={digit}
            onClick={() => handleSelect(digit)}
            disabled={selectedDigit !== null}
            className={`h-20 rounded-2xl text-4xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
              selectedDigit === digit && digit === current.target
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : selectedDigit === digit && digit !== current.target
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 border-amber-700 text-white'
            }`}
          >
            {digit}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. SOLVE MATH PUZZLE
// ==========================================
export const MathPuzzleGame: React.FC<GameProps> = ({ level, ageGroup, onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Simple visual arithmetic
  const puzzles = ageGroup === '3-5'
    ? [
        { a: 2, b: 1, op: '+', ans: 3, item: '🍎', options: [2, 3, 4] },
        { a: 3, b: 2, op: '+', ans: 5, item: '🍌', options: [4, 5, 6] },
        { a: 4, b: 1, op: '-', ans: 3, item: '🍉', options: [2, 3, 5] },
      ]
    : [
        { a: 5, b: 3, op: '+', ans: 8, item: '🍓', options: [7, 8, 9] },
        { a: 9, b: 4, op: '-', ans: 5, item: '🍊', options: [4, 5, 6] },
        { a: 6, b: 6, op: '+', ans: 12, item: '🍇', options: [10, 11, 12] },
      ];

  const current = puzzles[(step + level - 1) % puzzles.length];

  useEffect(() => {
    const text = current.op === '+'
      ? `What is ${current.a} plus ${current.b}?`
      : `What is ${current.a} take away ${current.b}?`;
    sound.speak(text);
    setSelectedAnswer(null);
  }, [current]);

  const handleSelect = (val: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(val);

    if (val === current.ans) {
      sound.playCorrect();
      sound.speak(`Terrific! ${current.a} ${current.op === '+' ? 'plus' : 'minus'} ${current.b} equals ${current.ans}!`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (step >= puzzles.length - 1) {
          onComplete(3, 400);
        } else {
          setStep(s => s + 1);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Let's count the items together!`);
      setTimeout(() => setSelectedAnswer(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-amber-950 mb-1">Solve the Math Puzzle</h3>
        <p className="text-sm text-amber-800 font-medium">Use the counters to add or subtract!</p>
      </div>

      {/* Visual equation card */}
      <div className="w-full bg-white border-3 border-amber-300 rounded-3xl p-6 shadow-md mb-8">
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-3xl sm:text-4xl font-extrabold text-amber-950">
          {/* First group */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: current.a }).map((_, i) => (
                <span key={i} className="text-2xl sm:text-3xl">{current.item}</span>
              ))}
            </div>
            <span>{current.a}</span>
          </div>

          <span className="text-4xl text-amber-600 font-black">{current.op}</span>

          {/* Second group */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: current.b }).map((_, i) => (
                <span key={i} className="text-2xl sm:text-3xl">{current.item}</span>
              ))}
            </div>
            <span>{current.b}</span>
          </div>

          <span className="text-4xl text-amber-600 font-black">=</span>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center text-3xl sm:text-4xl font-black text-amber-700 animate-pulse-subtle">
            {selectedAnswer !== null && selectedAnswer === current.ans ? current.ans : '?'}
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {current.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={selectedAnswer !== null}
            className={`h-20 rounded-2xl text-4xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
              selectedAnswer === opt && opt === current.ans
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : selectedAnswer === opt && opt !== current.ans
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 border-amber-800 text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. COMPLETE NUMBER SEQUENCE
// ==========================================
export const NumberSequenceGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [seqIdx, setSeqIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);

  const sequences = [
    { seq: [1, 2, '?', 4], ans: 3, options: [3, 5, 2] },
    { seq: [2, 4, 6, '?'], ans: 8, options: [7, 8, 10] },
    { seq: [5, 10, '?', 20], ans: 15, options: [12, 15, 18] },
    { seq: [10, 9, 8, '?'], ans: 7, options: [6, 7, 5] },
  ];

  const current = sequences[(seqIdx + level - 1) % sequences.length];

  useEffect(() => {
    sound.speak('Which number completes the stepping stone sequence?');
    setChosen(null);
  }, [current]);

  const handleSelect = (val: number) => {
    if (chosen !== null) return;
    setChosen(val);

    if (val === current.ans) {
      sound.playCorrect();
      sound.speak(`Awesome! ${val} completes the path!`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (seqIdx >= 2) {
          onComplete(3, 350);
        } else {
          setSeqIdx(s => s + 1);
        }
      }, 1100);
    } else {
      sound.playTryAgain();
      sound.speak(`Look closely at the pattern!`);
      setTimeout(() => setChosen(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-amber-950 mb-1">Complete the Number Sequence</h3>
        <p className="text-sm text-amber-800 font-medium">Hop from stone to stone in order!</p>
      </div>

      {/* Stepping stone river path */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {current.seq.map((item, idx) => {
          const isGap = item === '?';
          return (
            <div
              key={idx}
              className={`w-18 h-20 sm:w-22 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold border-3 shadow-md ${
                isGap
                  ? 'bg-amber-100 border-dashed border-amber-500 text-amber-700 animate-pulse-subtle'
                  : 'bg-white border-amber-300 text-amber-950'
              }`}
            >
              {isGap ? (chosen === current.ans ? current.ans : '?') : item}
            </div>
          );
        })}
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {current.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={chosen !== null}
            className={`h-20 rounded-2xl text-4xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
              chosen === opt && opt === current.ans
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : chosen === opt && opt !== current.ans
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 border-amber-700 text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
