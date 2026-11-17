import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, RotateCcw, Check, Sparkles, Star } from 'lucide-react';
import { sound } from '../../services/soundEffects';
import { ALPHABET_DATA } from '../../data/learningWorlds';
import confetti from 'canvas-confetti';

interface GameProps {
  level: number;
  ageGroup: '3-5' | '6-8';
  onComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

// ==========================================
// 1. TRACE THE ALPHABET
// ==========================================
export const TraceAlphabetGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLetterIdx, setCurrentLetterIdx] = useState((level - 1) * 3 % ALPHABET_DATA.length);
  const [tracedRatio, setTracedRatio] = useState(0);
  const letterItem = ALPHABET_DATA[currentLetterIdx];

  const drawLetterTemplate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guide background lines (Kindergarten handwriting rule paper)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(30, canvas.height * 0.25);
    ctx.lineTo(canvas.width - 30, canvas.height * 0.25);
    ctx.moveTo(30, canvas.height * 0.5);
    ctx.lineTo(canvas.width - 30, canvas.height * 0.5);
    ctx.moveTo(30, canvas.height * 0.75);
    ctx.lineTo(canvas.width - 30, canvas.height * 0.75);
    ctx.stroke();
    ctx.setLineDash([]);

    // Letter outline template in dotted light blue
    ctx.font = 'bold 220px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#EEF2F6';
    ctx.fillText(letterItem.letter, canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 6;
    ctx.setLineDash([12, 10]);
    ctx.strokeText(letterItem.letter, canvas.width / 2, canvas.height / 2);
    ctx.setLineDash([]);
  }, [letterItem.letter]);

  useEffect(() => {
    drawLetterTemplate();
    sound.speak(`Can you trace the letter ${letterItem.letter}? ${letterItem.letter} is for ${letterItem.name}!`);
    setTracedRatio(0);
  }, [currentLetterIdx, drawLetterTemplate, letterItem.letter, letterItem.name]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    sound.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#F59E0B'; // Bright golden ink
    ctx.lineWidth = 24;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();

    setTracedRatio(prev => Math.min(100, prev + 2.5));
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    if (tracedRatio >= 55) {
      sound.playCorrect();
      sound.speak(`Awesome! That's the letter ${letterItem.letter}!`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });

      if (currentLetterIdx % 3 === 2 || currentLetterIdx === ALPHABET_DATA.length - 1) {
        setTimeout(() => {
          onComplete(3, 300);
        }, 1200);
      } else {
        setTimeout(() => {
          setCurrentLetterIdx(prev => prev + 1);
        }, 1200);
      }
    }
  };

  const resetTrace = () => {
    sound.playPop();
    drawLetterTemplate();
    setTracedRatio(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 select-none">
      <div className="flex items-center justify-between w-full mb-3 bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{letterItem.emoji}</span>
          <div>
            <h3 className="text-xl font-bold font-kid text-indigo-950">Trace Letter: {letterItem.letter}</h3>
            <p className="text-xs text-indigo-600 font-medium">{letterItem.name} • Sound: "{letterItem.sound}"</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => sound.speak(`Letter ${letterItem.letter}. Sound: ${letterItem.sound}. ${letterItem.name}!`)}
            className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all cursor-pointer"
            title="Listen to phonics"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={resetTrace}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
            title="Erase and try again"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tracing Canvas */}
      <div className="relative bg-white rounded-3xl p-2 border-4 border-dashed border-indigo-200 shadow-lg touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={380}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full max-w-[360px] sm:max-w-[400px] h-[340px] rounded-2xl cursor-crosshair bg-white"
        />

        {/* Tracing guide tip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow pointer-events-none flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Follow the dotted lines with your finger!</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-4 flex items-center gap-3">
        <span className="text-xs font-bold text-indigo-900 shrink-0">Coverage:</span>
        <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-200"
            style={{ width: `${Math.min(100, (tracedRatio / 60) * 100)}%` }}
          />
        </div>
        {tracedRatio >= 55 && (
          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
            <Check className="w-4 h-4" /> Ready!
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. FIND MISSING LETTER
// ==========================================
export const FindMissingLetterGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Progressive questions based on level
  const questions = [
    { seq: ['A', 'B', '?', 'D'], answer: 'C', options: ['C', 'E', 'B'], sound: 'Can you find the missing letter between B and D?' },
    { seq: ['E', 'F', '?', 'H'], answer: 'G', options: ['J', 'G', 'M'], sound: 'What comes after F?' },
    { seq: ['L', 'M', 'N', '?'], answer: 'O', options: ['P', 'O', 'K'], sound: 'What letter completes the sequence?' },
    { seq: ['S', '?', 'U', 'V'], answer: 'T', options: ['R', 'T', 'W'], sound: 'Which letter comes between S and U?' },
    { seq: ['W', 'X', 'Y', '?'], answer: 'Z', options: ['Z', 'A', 'V'], sound: 'What is the very last letter of the alphabet?' },
  ];

  const currentQ = questions[(questionIdx + (level - 1)) % questions.length];

  useEffect(() => {
    sound.speak(currentQ.sound);
    setSelectedLetter(null);
  }, [currentQ]);

  const handleSelect = (letter: string) => {
    if (selectedLetter) return;
    setSelectedLetter(letter);

    if (letter === currentQ.answer) {
      sound.playCorrect();
      sound.speak(`Yes! ${letter} is correct!`);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (questionIdx >= 2) {
          onComplete(3, 350);
        } else {
          setQuestionIdx(prev => prev + 1);
        }
      }, 1100);
    } else {
      sound.playTryAgain();
      sound.speak(`Almost! Let's try again!`);
      setTimeout(() => setSelectedLetter(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 select-none">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold font-kid text-indigo-950 mb-1">Find the Missing Letter</h3>
        <p className="text-sm text-indigo-600 font-medium">Which letter fits into the empty star?</p>
      </div>

      {/* Train / Stepping Stones sequence */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
        {currentQ.seq.map((item, idx) => {
          const isGap = item === '?';
          return (
            <div
              key={idx}
              className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold shadow-md border-3 transition-transform ${
                isGap
                  ? 'bg-amber-100 border-dashed border-amber-400 text-amber-600 animate-pulse-subtle'
                  : 'bg-white border-indigo-200 text-indigo-900'
              }`}
            >
              {isGap ? (selectedLetter && selectedLetter === currentQ.answer ? selectedLetter : '?') : item}
            </div>
          );
        })}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {currentQ.options.map(option => {
          const isCorrectChoice = selectedLetter === option && option === currentQ.answer;
          const isWrongChoice = selectedLetter === option && option !== currentQ.answer;

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selectedLetter !== null}
              className={`h-20 sm:h-24 rounded-2xl text-4xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
                isCorrectChoice
                  ? 'bg-emerald-500 border-emerald-700 text-white scale-105'
                  : isWrongChoice
                  ? 'bg-rose-400 border-rose-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-800 text-white'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. MATCH LETTER & SOUND
// ==========================================
export const LetterSoundMatchGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const rounds = [
    { target: 'B', sound: 'buh', word: 'Bear', emoji: '🐻', options: ['B', 'D', 'P'] },
    { target: 'M', sound: 'muh', word: 'Monkey', emoji: '🐵', options: ['W', 'M', 'N'] },
    { target: 'S', sound: 'suh', word: 'Sun', emoji: '☀️', options: ['C', 'S', 'Z'] },
    { target: 'T', sound: 'tuh', word: 'Tiger', emoji: '🐯', options: ['T', 'F', 'L'] },
    { target: 'A', sound: 'ah', word: 'Apple', emoji: '🍎', options: ['O', 'E', 'A'] },
  ];

  const current = rounds[(round + level - 1) % rounds.length];

  const playPrompt = useCallback(() => {
    sound.speak(`Which letter makes the sound ${current.sound}, as in ${current.word}?`);
  }, [current.sound, current.word]);

  useEffect(() => {
    playPrompt();
    setSelected(null);
  }, [current, playPrompt]);

  const handleChoice = (letter: string) => {
    if (selected) return;
    setSelected(letter);

    if (letter === current.target) {
      sound.playCorrect();
      sound.speak(`Super! ${letter} makes the ${current.sound} sound for ${current.word}!`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (round >= 2) {
          onComplete(3, 300);
        } else {
          setRound(r => r + 1);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Good try! Listen again.`);
      setTimeout(() => setSelected(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-indigo-950 mb-1">Match Letter to Sound</h3>
        <p className="text-sm text-indigo-600 font-medium">Tap the speaker to hear the sound!</p>
      </div>

      {/* Target Word & Audio Prompt Card */}
      <button
        onClick={playPrompt}
        className="w-44 h-44 rounded-3xl bg-amber-100 border-4 border-amber-300 shadow-md flex flex-col items-center justify-center mb-8 p-3 cursor-pointer hover:scale-105 transition-transform group"
      >
        <span className="text-6xl mb-2 group-hover:scale-110 transition-transform">{current.emoji}</span>
        <span className="text-lg font-bold text-amber-900 font-kid flex items-center gap-1.5">
          <Volume2 className="w-5 h-5 text-amber-700 animate-bounce-gentle" />
          "{current.sound}"
        </span>
      </button>

      {/* 3 Letter Choices */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {current.options.map(letter => {
          const isCorrect = selected === letter && letter === current.target;
          const isWrong = selected === letter && letter !== current.target;

          return (
            <button
              key={letter}
              onClick={() => handleChoice(letter)}
              disabled={selected !== null}
              className={`h-24 rounded-2xl text-4xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
                isCorrect
                  ? 'bg-emerald-500 border-emerald-700 text-white scale-105'
                  : isWrong
                  ? 'bg-rose-400 border-rose-600 text-white'
                  : 'bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. BUILD SIMPLE WORDS
// ==========================================
export const BuildSimpleWordsGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);

  const words = [
    { word: 'CAT', emoji: '🐱', hint: 'A friendly furry pet that says meow!' },
    { word: 'SUN', emoji: '☀️', hint: 'Bright and warm in the sunny sky!' },
    { word: 'DOG', emoji: '🐶', hint: 'A playful puppy with a wagging tail!' },
    { word: 'FOX', emoji: '🦊', hint: 'A clever animal in the forest!' },
    { word: 'PIG', emoji: '🐷', hint: 'An adorable pink farm animal!' },
  ];

  const current = words[(wordIdx + level - 1) % words.length];
  // Scramble letters with 1 distractor
  const [scrambled, setScrambled] = useState<string[]>([]);

  useEffect(() => {
    const letters = current.word.split('');
    const distractors = ['R', 'M', 'T', 'P', 'S'].filter(l => !letters.includes(l));
    const pool = [...letters, distractors[0]].sort(() => Math.random() - 0.5);
    setScrambled(pool);
    setPlacedLetters([]);
    sound.speak(`Can you spell ${current.word}? ${current.hint}`);
  }, [current]);

  const handlePickLetter = (letter: string, index: number) => {
    sound.playPop();
    const nextSlot = placedLetters.length;
    if (nextSlot >= current.word.length) return;

    const newPlaced = [...placedLetters, letter];
    setPlacedLetters(newPlaced);

    // Remove from scrambled pool
    const newPool = [...scrambled];
    newPool.splice(index, 1);
    setScrambled(newPool);

    // Check completion
    if (newPlaced.length === current.word.length) {
      const spelled = newPlaced.join('');
      if (spelled === current.word) {
        sound.playCorrect();
        sound.speak(`Brilliant! You spelled ${current.word}!`);
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

        setTimeout(() => {
          if (wordIdx >= 2) {
            onComplete(3, 400);
          } else {
            setWordIdx(i => i + 1);
          }
        }, 1200);
      } else {
        sound.playTryAgain();
        sound.speak(`Almost! Let's clear and try again.`);
        setTimeout(() => {
          const letters = current.word.split('');
          const distractors = ['R', 'M', 'T', 'P', 'S'].filter(l => !letters.includes(l));
          setScrambled([...letters, distractors[0]].sort(() => Math.random() - 0.5));
          setPlacedLetters([]);
        }, 1000);
      }
    }
  };

  const handleClear = () => {
    sound.playPop();
    const letters = current.word.split('');
    const distractors = ['R', 'M', 'T', 'P', 'S'].filter(l => !letters.includes(l));
    setScrambled([...letters, distractors[0]].sort(() => Math.random() - 0.5));
    setPlacedLetters([]);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-indigo-950 mb-1">Build Simple Words</h3>
        <p className="text-sm text-indigo-600 font-medium">Snap the letter blocks into place!</p>
      </div>

      {/* Picture Clue */}
      <div className="w-32 h-32 rounded-3xl bg-amber-50 border-3 border-amber-200 shadow-md flex items-center justify-center text-6xl mb-6">
        {current.emoji}
      </div>

      {/* Target Word Slots */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {current.word.split('').map((_, idx) => {
          const filled = placedLetters[idx];
          return (
            <div
              key={idx}
              className={`w-16 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold border-2 shadow-inner transition-all ${
                filled
                  ? 'bg-indigo-600 border-indigo-700 text-white'
                  : 'bg-white border-dashed border-indigo-300 text-transparent'
              }`}
            >
              {filled || '_'}
            </div>
          );
        })}
      </div>

      {/* Letter Bank to Pick */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {scrambled.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => handlePickLetter(letter, idx)}
            className="w-14 h-16 sm:w-16 sm:h-18 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 text-amber-950 text-2xl sm:text-3xl font-extrabold shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            {letter}
          </button>
        ))}
      </div>

      <button
        onClick={handleClear}
        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
      >
        Clear and try again
      </button>
    </div>
  );
};
