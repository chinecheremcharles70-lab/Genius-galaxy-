import React, { useState } from 'react';
import { ArrowLeft, Star, Volume2, RotateCcw, HelpCircle, Trophy } from 'lucide-react';
import { WorldId, GameDefinition, AgeGroup } from '../../types';
import { WORLDS } from '../../data/learningWorlds';
import { BarnabyOwl } from '../mascot/BarnabyOwl';
import { sound } from '../../services/soundEffects';

// Game implementations
import {
  TraceAlphabetGame,
  FindMissingLetterGame,
  LetterSoundMatchGame,
  BuildSimpleWordsGame,
} from './LetterLandGames';
import {
  CountAnimalsGame,
  NumberMatchingGame,
  MathPuzzleGame,
  NumberSequenceGame,
} from './NumberSafariGames';
import {
  ColourMatchingGame,
  ShapeFinderGame,
  SortColoursGame,
  CompletePatternGame,
} from './ColourShapeTownGames';
import {
  GuessAnimalSoundGame,
  MatchAnimalNamesGame,
  AnimalHabitatGame,
  AnimalPictureQuizGame,
} from './AnimalExplorerGames';
import {
  MemoryCardsGame,
  OddOneOutGame,
  FindDifferenceGame,
  WhatComesNextGame,
} from './PuzzlePlanetGames';

interface GameContainerProps {
  worldId: WorldId;
  gameId: string;
  level: number;
  ageGroup: AgeGroup;
  onFinishGame: (stars: number, score: number) => void;
  onExitGame: () => void;
  onChangeLevel: (newLevel: number) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  worldId,
  gameId,
  level,
  ageGroup,
  onFinishGame,
  onExitGame,
  onChangeLevel,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [completedStars, setCompletedStars] = useState<number | null>(null);
  const [lastScore, setLastScore] = useState(0);

  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  const gameDef: GameDefinition = world.games.find(g => g.id === gameId) || world.games[0];

  const handleGameComplete = (stars: number, score: number) => {
    setCompletedStars(stars);
    setLastScore(score);
    sound.playLevelFanfare();
  };

  const handleNextLevel = () => {
    sound.playPop();
    const nextLvl = Math.min(gameDef.totalLevels, level + 1);
    onFinishGame(completedStars || 3, lastScore);
    setCompletedStars(null);
    onChangeLevel(nextLvl);
  };

  const handleReplay = () => {
    sound.playPop();
    setCompletedStars(null);
  };

  const handleReturnToWorld = () => {
    sound.playPop();
    if (completedStars !== null) {
      onFinishGame(completedStars, lastScore);
    }
    onExitGame();
  };

  const renderActiveGame = () => {
    const props = {
      level,
      ageGroup,
      onComplete: handleGameComplete,
      onExit: onExitGame,
    };

    switch (gameId) {
      // Letter Land
      case 'trace-alphabet':
        return <TraceAlphabetGame {...props} />;
      case 'find-missing-letter':
        return <FindMissingLetterGame {...props} />;
      case 'letter-sound-match':
        return <LetterSoundMatchGame {...props} />;
      case 'build-words':
        return <BuildSimpleWordsGame {...props} />;

      // Number Safari
      case 'count-animals':
        return <CountAnimalsGame {...props} />;
      case 'number-match':
        return <NumberMatchingGame {...props} />;
      case 'math-puzzle':
        return <MathPuzzleGame {...props} />;
      case 'number-sequence':
        return <NumberSequenceGame {...props} />;

      // Colour & Shape Town
      case 'color-matching':
        return <ColourMatchingGame {...props} />;
      case 'shape-finder':
        return <ShapeFinderGame {...props} />;
      case 'sort-colours':
        return <SortColoursGame {...props} />;
      case 'complete-pattern':
        return <CompletePatternGame {...props} />;

      // Animal Explorer
      case 'guess-sound':
        return <GuessAnimalSoundGame {...props} />;
      case 'match-names':
        return <MatchAnimalNamesGame {...props} />;
      case 'animal-habitat':
        return <AnimalHabitatGame {...props} />;
      case 'animal-quiz':
        return <AnimalPictureQuizGame {...props} />;

      // Puzzle Planet
      case 'memory-cards':
        return <MemoryCardsGame {...props} />;
      case 'odd-one-out':
        return <OddOneOutGame {...props} />;
      case 'find-difference':
        return <FindDifferenceGame {...props} />;
      case 'what-comes-next':
        return <WhatComesNextGame {...props} />;

      default:
        return <TraceAlphabetGame {...props} />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-amber-50/40">
      {/* Top Game Bar */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 py-2.5 flex items-center justify-between z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnToWorld}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all cursor-pointer"
            title="Back to Learning World"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{world.name}</span>
            <h2 className="text-base sm:text-lg font-bold font-kid text-slate-900 leading-none">{gameDef.title}</h2>
          </div>
        </div>

        {/* Level Indicator and Stars */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl font-kid text-sm font-bold border border-amber-300">
            <span>Level {level}</span>
            <span className="text-xs text-amber-700">/ {gameDef.totalLevels}</span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setShowInstructions(true);
              sound.speak(gameDef.tagline);
            }}
            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all cursor-pointer"
            title="How to play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {renderActiveGame()}
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-amber-200 shadow-2xl animate-bounce-gentle">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">Game Instructions</span>
                <h3 className="text-2xl font-bold font-kid text-slate-900">{gameDef.title}</h3>
              </div>
              <button
                onClick={() => sound.speak(gameDef.tagline)}
                className="p-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-colors cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-700 text-base mb-4 leading-relaxed">{gameDef.tagline}</p>

            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-6">
              <span className="text-xs font-bold text-amber-900 block mb-1">Skills You Are Practicing:</span>
              <div className="flex flex-wrap gap-1.5">
                {gameDef.skills.map(s => (
                  <span key={s} className="text-xs bg-white text-amber-800 px-2.5 py-1 rounded-lg font-medium border border-amber-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setShowInstructions(false);
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-2xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 shadow-md text-lg cursor-pointer"
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* Win & Star Rewards Modal */}
      {completedStars !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border-4 border-amber-300 shadow-2xl text-center">
            {/* Mascot celebration */}
            <div className="flex justify-center mb-3">
              <BarnabyOwl
                mood="celebrating"
                size="md"
                message="Hoo-hoo! Incredible job, Little Genius! You earned 3 bright stars!"
              />
            </div>

            <h3 className="text-3xl font-bold font-kid text-amber-950 mb-1">Level Complete!</h3>
            <p className="text-sm text-slate-600 mb-6 font-medium">You solved {gameDef.title} Level {level}!</p>

            {/* 3 Sparkling Stars */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transform transition-all duration-300 ${
                    s <= (completedStars || 3)
                      ? 'bg-amber-400 text-amber-950 scale-110 rotate-6'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-6 text-sm font-bold text-amber-800 bg-amber-50 py-2 px-4 rounded-xl border border-amber-200">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>+{lastScore} Genius Points Earned!</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleNextLevel}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-md text-lg cursor-pointer"
              >
                {level < gameDef.totalLevels ? 'Play Next Level 🚀' : 'Finish & Claim Badge 🏆'}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleReplay}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>
                <button
                  onClick={handleReturnToWorld}
                  className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-sm cursor-pointer"
                >
                  Back to World
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
