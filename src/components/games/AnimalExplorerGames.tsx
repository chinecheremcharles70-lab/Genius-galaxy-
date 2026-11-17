import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { ANIMALS_DATA } from '../../data/learningWorlds';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface GameProps {
  level: number;
  ageGroup: '3-5' | '6-8';
  onComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

// ==========================================
// 1. GUESS THE ANIMAL SOUND
// ==========================================
export const GuessAnimalSoundGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const testAnimals = [
    ANIMALS_DATA[0], // Lion
    ANIMALS_DATA[2], // Cow
    ANIMALS_DATA[3], // Frog
    ANIMALS_DATA[4], // Bird
    ANIMALS_DATA[6], // Dog
  ];

  const current = testAnimals[(round + level - 1) % testAnimals.length];
  const others = ANIMALS_DATA.filter(a => a.name !== current.name).sort(() => Math.random() - 0.5);
  const choices = [current, others[0], others[1]].sort(() => Math.random() - 0.5);

  const playSoundEffect = () => {
    sound.playAnimalSound(current.soundKey);
  };

  useEffect(() => {
    sound.speak(`Listen closely to this animal sound! Can you guess who makes it?`);
    playSoundEffect();
    setSelected(null);
  }, [current]);

  const handleSelect = (name: string) => {
    if (selected !== null) return;
    setSelected(name);

    if (name === current.name) {
      sound.playCorrect();
      sound.speak(`Bingo! The ${current.name} made that sound! ${current.fact}`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (round >= 2) {
          onComplete(3, 350);
        } else {
          setRound(r => r + 1);
        }
      }, 1300);
    } else {
      sound.playTryAgain();
      sound.speak(`Let's listen to the sound one more time!`);
      setTimeout(() => setSelected(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-emerald-950 mb-1">Guess the Animal Sound</h3>
        <p className="text-sm text-emerald-800 font-medium">Tap the big green speaker to hear the animal!</p>
      </div>

      {/* Speaker Button */}
      <button
        onClick={playSoundEffect}
        className="w-40 h-40 rounded-3xl bg-emerald-500 hover:bg-emerald-400 border-b-6 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg flex flex-col items-center justify-center mb-8 cursor-pointer group transition-all"
      >
        <Volume2 className="w-16 h-16 text-white group-hover:scale-110 transition-transform animate-pulse-subtle" />
        <span className="text-white font-extrabold text-sm uppercase mt-2">Hear Sound</span>
      </button>

      {/* Choices */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {choices.map(a => {
          const isSelected = selected === a.name;
          const isRight = isSelected && a.name === current.name;
          const isWrong = isSelected && a.name !== current.name;

          return (
            <button
              key={a.name}
              onClick={() => handleSelect(a.name)}
              disabled={selected !== null}
              className={`h-28 rounded-3xl bg-white border-b-4 border-emerald-200 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-2 ${
                isRight
                  ? 'bg-emerald-50 border-emerald-500 scale-105'
                  : isWrong
                  ? 'bg-rose-50 border-rose-300 scale-95'
                  : 'hover:bg-emerald-50'
              }`}
            >
              <span className="text-5xl mb-1">{a.emoji}</span>
              <span className="text-xs font-bold text-slate-700">{a.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. MATCH ANIMALS TO THEIR NAMES
// ==========================================
export const MatchAnimalNamesGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [chosenName, setChosenName] = useState<string | null>(null);

  const current = ANIMALS_DATA[(idx + level - 1) % ANIMALS_DATA.length];
  const others = ANIMALS_DATA.filter(a => a.name !== current.name).sort(() => Math.random() - 0.5);
  const nameChoices = [current.name, others[0].name, others[1].name].sort(() => Math.random() - 0.5);

  useEffect(() => {
    sound.speak(`What is the name of this friendly animal?`);
    setChosenName(null);
  }, [current]);

  const handleSelect = (name: string) => {
    if (chosenName !== null) return;
    setChosenName(name);

    if (name === current.name) {
      sound.playCorrect();
      sound.speak(`Yes, that's a ${current.name}!`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (idx >= 2) {
          onComplete(3, 300);
        } else {
          setIdx(i => i + 1);
        }
      }, 1100);
    } else {
      sound.playTryAgain();
      sound.speak(`Take a closer look at the picture!`);
      setTimeout(() => setChosenName(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-emerald-950 mb-1">Match Animal Name</h3>
        <p className="text-sm text-emerald-800 font-medium">Which word matches the portrait?</p>
      </div>

      {/* Animal portrait */}
      <div className="w-40 h-40 rounded-3xl bg-white border-4 border-emerald-300 shadow-md flex items-center justify-center text-7xl mb-8 animate-bounce-gentle">
        {current.emoji}
      </div>

      {/* Name buttons */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {nameChoices.map(name => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            disabled={chosenName !== null}
            className={`h-18 rounded-2xl text-xl sm:text-2xl font-extrabold border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center ${
              chosenName === name && name === current.name
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : chosenName === name && name !== current.name
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-600 border-emerald-900 text-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. WHERE DOES THIS ANIMAL LIVE? (HABITATS)
// ==========================================
export const AnimalHabitatGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [step, setStep] = useState(0);
  const [chosenHabitat, setChosenHabitat] = useState<string | null>(null);

  const habitatAnimals = [
    { name: 'Dolphin', emoji: '🐬', habitat: 'Ocean', icon: '🌊', fact: 'Dolphins swim playfully in deep blue oceans!' },
    { name: 'Polar Bear', emoji: '🐻‍❄️', habitat: 'Arctic', icon: '❄️', fact: 'Polar bears live on icy Arctic sea ice!' },
    { name: 'Cow', emoji: '🐮', habitat: 'Farm', icon: '🚜', fact: 'Cows live on sunny green farms!' },
    { name: 'Lion', emoji: '🦁', habitat: 'Savannah', icon: '🌾', fact: 'Lions roam the wide African savannah!' },
    { name: 'Monkey', emoji: '🐒', habitat: 'Jungle', icon: '🌴', fact: 'Monkeys swing through lush jungle trees!' },
  ];

  const current = habitatAnimals[(step + level - 1) % habitatAnimals.length];
  const allHabitats = [
    { name: 'Ocean', icon: '🌊' },
    { name: 'Arctic', icon: '❄️' },
    { name: 'Farm', icon: '🚜' },
    { name: 'Savannah', icon: '🌾' },
    { name: 'Jungle', icon: '🌴' },
  ];

  // 3 choices including correct
  const otherHabitats = allHabitats.filter(h => h.name !== current.habitat).sort(() => Math.random() - 0.5);
  const habitatOptions = [{ name: current.habitat, icon: current.icon }, otherHabitats[0], otherHabitats[1]].sort(() => Math.random() - 0.5);

  useEffect(() => {
    sound.speak(`Where does the ${current.name} live?`);
    setChosenHabitat(null);
  }, [current]);

  const handleSelect = (habitat: string) => {
    if (chosenHabitat !== null) return;
    setChosenHabitat(habitat);

    if (habitat === current.habitat) {
      sound.playCorrect();
      sound.speak(`Correct! ${current.fact}`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (step >= 2) {
          onComplete(3, 350);
        } else {
          setStep(s => s + 1);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Think about where the ${current.name} finds food and stays safe!`);
      setTimeout(() => setChosenHabitat(null), 900);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-emerald-950 mb-1">Where Does It Live?</h3>
        <p className="text-sm text-emerald-800 font-medium">Find the right home for each creature!</p>
      </div>

      {/* Animal prompt */}
      <div className="w-36 h-36 rounded-3xl bg-white border-4 border-emerald-300 shadow-md flex flex-col items-center justify-center mb-8">
        <span className="text-6xl">{current.emoji}</span>
        <span className="text-sm font-bold text-slate-800 font-kid mt-1">{current.name}</span>
      </div>

      {/* 3 Habitat Choices */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {habitatOptions.map(h => (
          <button
            key={h.name}
            onClick={() => handleSelect(h.name)}
            disabled={chosenHabitat !== null}
            className={`h-24 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-2 ${
              chosenHabitat === h.name && h.name === current.habitat
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : chosenHabitat === h.name && h.name !== current.habitat
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'bg-white hover:bg-emerald-50 border-emerald-200 text-slate-800'
            }`}
          >
            <span className="text-3xl mb-1">{h.icon}</span>
            <span className="text-sm font-bold font-kid">{h.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. ANIMAL PICTURE QUIZ
// ==========================================
export const AnimalPictureQuizGame: React.FC<GameProps> = ({ level, onComplete }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);

  const quiz = [
    {
      question: 'Which tall animal has a very long neck to reach leaves at the tops of trees?',
      ans: 'Giraffe',
      options: [
        { name: 'Giraffe', emoji: '🦒' },
        { name: 'Lion', emoji: '🦁' },
        { name: 'Panda', emoji: '🐼' },
      ],
    },
    {
      question: 'Which animal loves swimming and communicates with friendly whistles and clicks?',
      ans: 'Dolphin',
      options: [
        { name: 'Dolphin', emoji: '🐬' },
        { name: 'Elephant', emoji: '🐘' },
        { name: 'Owl', emoji: '🦉' },
      ],
    },
    {
      question: 'Which clever bird turns its head almost all the way around and hunts at night?',
      ans: 'Owl',
      options: [
        { name: 'Owl', emoji: '🦉' },
        { name: 'Cow', emoji: '🐮' },
        { name: 'Frog', emoji: '🐸' },
      ],
    },
  ];

  const current = quiz[(qIdx + level - 1) % quiz.length];

  useEffect(() => {
    sound.speak(current.question);
    setSelectedAns(null);
  }, [current]);

  const handleSelect = (name: string) => {
    if (selectedAns !== null) return;
    setSelectedAns(name);

    if (name === current.ans) {
      sound.playCorrect();
      sound.speak(`Spot on! The ${current.ans} is the answer!`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        if (qIdx >= quiz.length - 1) {
          onComplete(3, 400);
        } else {
          setQIdx(q => q + 1);
        }
      }, 1200);
    } else {
      sound.playTryAgain();
      sound.speak(`Think about what makes each animal special!`);
      setTimeout(() => setSelectedAns(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 select-none">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold font-kid text-emerald-950 mb-1">Animal Picture Quiz</h3>
        <p className="text-sm text-emerald-800 font-medium">Solve the nature riddle!</p>
      </div>

      {/* Question Card */}
      <div className="w-full bg-white border-3 border-emerald-200 rounded-3xl p-5 shadow-sm text-center mb-8">
        <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">{current.question}</p>
      </div>

      {/* 3 Animal Choice Cards */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {current.options.map(opt => (
          <button
            key={opt.name}
            onClick={() => handleSelect(opt.name)}
            disabled={selectedAns !== null}
            className={`h-28 rounded-3xl bg-white border-b-4 border-emerald-300 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-2 ${
              selectedAns === opt.name && opt.name === current.ans
                ? 'bg-emerald-500 border-emerald-700 text-white'
                : selectedAns === opt.name && opt.name !== current.ans
                ? 'bg-rose-400 border-rose-600 text-white'
                : 'hover:bg-emerald-50'
            }`}
          >
            <span className="text-5xl mb-1">{opt.emoji}</span>
            <span className="text-xs font-bold font-kid">{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
