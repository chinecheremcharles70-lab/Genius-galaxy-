/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Star,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  ShieldCheck,
  Play,
  RotateCcw,
  Tablet,
  Maximize2,
  Award,
  Layers,
} from 'lucide-react';
import {
  WorldId,
  ScreenType,
  UserProgress,
  ParentSettings,
  AmazonReceipt,
} from './types';
import { WORLDS, BADGES } from './data/learningWorlds';
import { sound } from './services/soundEffects';
import { BarnabyOwl } from './components/mascot/BarnabyOwl';
import { WorldDetailView } from './components/worlds/WorldDetailView';
import { GameContainer } from './components/games/GameContainer';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentGateModal } from './components/parent/ParentGateModal';
import { PremiumModal } from './components/monetization/PremiumModal';
import { RewardsModal } from './components/rewards/RewardsModal';

const INITIAL_PROGRESS: UserProgress = {
  totalStars: 12,
  currentStreak: 3,
  sessionMinutes: 0,
  todayMinutes: 8,
  lastActiveDate: new Date().toISOString(),
  levelScores: {
    'letter-land_trace-alphabet_1': { stars: 3, completed: true, highScore: 300 },
    'number-safari_count-animals_1': { stars: 3, completed: true, highScore: 300 },
    'colour-shapes_color-matching_1': { stars: 3, completed: true, highScore: 300 },
    'animal-explorer_guess-sound_1': { stars: 3, completed: true, highScore: 350 },
  },
  unlockedBadges: ['first_star', 'abc_master', 'safari_counter'],
  unlockedMascots: ['barnaby_owl'],
  isPremiumUnlocked: false,
  amazonReceipts: [],
};

const INITIAL_SETTINGS: ParentSettings = {
  childName: 'Alex',
  ageGroup: '3-5',
  dailyTimeLimitMinutes: 30,
  soundEffectsVolume: 80,
  musicVolume: 60,
  voiceGuidance: true,
  breakReminders: true,
  tabletModel: 'responsive',
};

export default function App() {
  // Navigation & Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId>('letter-land');
  const [selectedGameId, setSelectedGameId] = useState<string>('trace-alphabet');
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // App Data & Persistence
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lga_progress');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_PROGRESS;
  });

  const [settings, setSettings] = useState<ParentSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lga_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_SETTINGS;
  });

  // Modals & Protection gates
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [parentGateTarget, setParentGateTarget] = useState<'dashboard' | 'premium'>('dashboard');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Tablet frame simulator setting: 'responsive' | 'fire-hd-10' | 'fire-hd-8'
  const [tabletMode, setTabletMode] = useState<'responsive' | 'fire-hd-10' | 'fire-hd-8'>('responsive');

  // Save to LocalStorage on progress/settings changes
  useEffect(() => {
    try {
      localStorage.setItem('lga_progress', JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem('lga_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Session time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        sessionMinutes: prev.sessionMinutes + 1,
        todayMinutes: prev.todayMinutes + 1,
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle Mute Toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (nextMuted) {
      sound.stopBgMusic();
      setIsMusicPlaying(false);
    } else {
      sound.startBgMusic();
      setIsMusicPlaying(true);
    }
  };

  // Open Parent Zone with math verification
  const handleOpenParentDashboard = () => {
    sound.playPop();
    setParentGateTarget('dashboard');
    setIsParentGateOpen(true);
  };

  const handleOpenUpgradeModal = () => {
    sound.playPop();
    setParentGateTarget('premium');
    setIsParentGateOpen(true);
  };

  const handleParentGateSuccess = () => {
    setIsParentGateOpen(false);
    if (parentGateTarget === 'dashboard') {
      setCurrentScreen('parent-dashboard');
    } else {
      setIsPremiumModalOpen(true);
    }
  };

  // Handle Level Win & Progress recording
  const handleFinishGame = (stars: number, scoreBonus: number) => {
    const key = `${selectedWorldId}_${selectedGameId}_${currentLevel}`;
    const previous = progress.levelScores[key];
    const previousStars = previous?.stars || 0;
    const starDelta = Math.max(0, stars - previousStars);

    setProgress(prev => {
      const updatedScores = {
        ...prev.levelScores,
        [key]: {
          stars: Math.max(previousStars, stars),
          completed: true,
          highScore: Math.max(previous?.highScore || 0, scoreBonus),
          lastPlayed: new Date().toISOString(),
        },
      };

      // Check unlockable badges
      const newBadges = [...prev.unlockedBadges];
      if (prev.totalStars + starDelta >= 15 && !newBadges.includes('wildlife_expert')) {
        newBadges.push('wildlife_expert');
      }

      return {
        ...prev,
        totalStars: prev.totalStars + starDelta,
        levelScores: updatedScores,
        unlockedBadges: newBadges,
      };
    });
  };

  // Handle Amazon IAP purchase success
  const handlePurchaseSuccess = (receipt: AmazonReceipt) => {
    setProgress(prev => ({
      ...prev,
      isPremiumUnlocked: true,
      amazonReceipts: [...prev.amazonReceipts, receipt],
    }));
  };

  // Handle Restore Purchases
  const handleRestorePurchases = () => {
    if (progress.amazonReceipts.length > 0) {
      setProgress(prev => ({ ...prev, isPremiumUnlocked: true }));
      return true;
    }
    return false;
  };

  // Tablet frame wrapper sizing
  const getFrameClasses = () => {
    switch (tabletMode) {
      case 'fire-hd-10':
        // Amazon Fire HD 10 is 16:10 aspect ratio (1920x1200)
        return 'max-w-[1180px] w-full max-h-[86vh] aspect-[16/10] rounded-[36px] shadow-2xl border-[16px] border-slate-900 ring-4 ring-slate-800 bg-white overflow-hidden relative my-auto';
      case 'fire-hd-8':
        // Amazon Fire HD 8 is 16:10 (1280x800)
        return 'max-w-[960px] w-full max-h-[86vh] aspect-[16/10] rounded-[32px] shadow-2xl border-[14px] border-slate-900 ring-4 ring-slate-800 bg-white overflow-hidden relative my-auto';
      default:
        return 'w-full h-screen bg-white flex flex-col overflow-hidden';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 md:p-3 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial from-amber-600/20 via-slate-900/90 to-slate-950 pointer-events-none" />

      {/* Top Tablet Simulator Control Bar (Desktop Only) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-5xl px-4 py-2 z-30 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Tablet className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200">Device Simulator:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setTabletMode('responsive')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                tabletMode === 'responsive' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
              }`}
            >
              Browser Fill
            </button>
            <button
              onClick={() => setTabletMode('fire-hd-10')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                tabletMode === 'fire-hd-10' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
              }`}
            >
              Fire HD 10 (16:10)
            </button>
            <button
              onClick={() => setTabletMode('fire-hd-8')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                tabletMode === 'fire-hd-8' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:text-white'
              }`}
            >
              Fire HD 8 (16:10)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Target: Amazon Fire Tablets & Android</span>
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>
        </div>
      </div>

      {/* Main Tablet Display Shell */}
      <div className={getFrameClasses()}>
        {/* ==================================================== */}
        {/* SCREEN 1: WELCOME SCREEN */}
        {/* ==================================================== */}
        {currentScreen === 'welcome' && (
          <div className="w-full h-full relative flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-600 text-white overflow-hidden select-none">
            {/* Top Bar for Welcome */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse-subtle" />
                <span className="text-xs font-bold uppercase tracking-wider">Ages 3–8 Academy</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md text-white transition-all cursor-pointer"
                  title="Toggle Music & Sound"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
                </button>
                <button
                  onClick={handleOpenParentDashboard}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Parents Area"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Parents</span>
                </button>
              </div>
            </div>

            {/* Center Lockup & Mascot */}
            <div className="flex flex-col items-center justify-center text-center my-auto z-10 max-w-xl mx-auto">
              {/* Mascot Centerpiece */}
              <div className="mb-4">
                <BarnabyOwl
                  mood="talking"
                  size="lg"
                  message="Hoo-hoo! I'm Barnaby the Owl! Are you ready to play, learn, and grow today?"
                />
              </div>

              {/* Title Lockup */}
              <h1 className="text-4xl sm:text-6xl font-black font-kid text-white drop-shadow-lg tracking-wide uppercase leading-none mb-2">
                Little Genius <span className="text-amber-300">Academy</span>
              </h1>
              <p className="text-sm sm:text-base font-bold text-amber-100 drop-shadow mb-6">
                Play, Learn and Grow! • Explore 5 Magical Educational Worlds
              </p>

              {/* Age Selector */}
              <div className="flex items-center gap-2 p-1 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 mb-8">
                <button
                  onClick={() => {
                    sound.playPop();
                    setSettings(s => ({ ...s, ageGroup: '3-5' }));
                    sound.speak('Preschool and Kindergarten mode selected!');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    settings.ageGroup === '3-5'
                      ? 'bg-amber-400 text-amber-950 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Preschool (Ages 3–5)
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setSettings(s => ({ ...s, ageGroup: '6-8' }));
                    sound.speak('Early Elementary mode selected!');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    settings.ageGroup === '6-8'
                      ? 'bg-amber-400 text-amber-950 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Elementary (Ages 6–8)
                </button>
              </div>

              {/* Big Play CTA Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  if (!isMusicPlaying && !isMuted) {
                    sound.startBgMusic();
                    setIsMusicPlaying(true);
                  }
                  setCurrentScreen('home');
                }}
                className="w-full max-w-xs py-4 px-8 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black font-kid text-2xl rounded-3xl border-b-6 border-amber-600 active:border-b-0 active:translate-y-1.5 shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Play className="w-7 h-7 fill-current group-hover:scale-110 transition-transform" />
                <span>START ADVENTURE</span>
              </button>
            </div>

            {/* Bottom Safe Footer */}
            <div className="text-center z-10 text-[11px] text-white/80 font-medium flex items-center justify-center gap-4">
              <span>100% Kid Safe & COPPA Compliant</span>
              <span>•</span>
              <span>Zero Ads</span>
              <span>•</span>
              <span>Offline Ready</span>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SCREEN 2: HOME / WORLD SELECTION DASHBOARD */}
        {/* ==================================================== */}
        {currentScreen === 'home' && (
          <div className="w-full h-full flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-sky-50 via-amber-50/40 to-indigo-50/40">
            {/* Top Navigation Bar */}
            <div className="bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sound.playPop();
                    setCurrentScreen('welcome');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Home
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-kid text-slate-900 leading-none">
                    Little Genius <span className="text-indigo-600">Academy</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">Hello, {settings.childName}! Pick a learning world.</p>
                </div>
              </div>

              {/* Status Clusters */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Daily Streak */}
                <button
                  onClick={() => {
                    sound.playPop();
                    sound.playAnimalSound('owl');
                    sound.speak(`Hoo-hoo! You are on a ${progress.currentStreak}-day learning streak! Fantastic job practicing every day!`);
                  }}
                  className="flex items-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-orange-950 px-3 py-1.5 rounded-xl font-bold text-xs border border-orange-300 transition-colors cursor-pointer shadow-xs group"
                  title={`${progress.currentStreak}-day daily learning streak! Tap to hear Barnaby cheer!`}
                >
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-600 group-hover:scale-110 transition-transform animate-pulse-subtle" />
                  <span className="font-mono tabular-nums font-black text-sm">{progress.currentStreak}</span>
                  <span className="hidden md:inline text-[11px] font-semibold text-orange-800">Day Streak</span>
                </button>

                {/* Stars earned */}
                <button
                  onClick={() => {
                    sound.playPop();
                    setIsRewardsModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold text-xs border border-amber-300 transition-colors cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                  <span className="font-mono tabular-nums">{progress.totalStars}</span>
                </button>

                {/* Trophy Room */}
                <button
                  onClick={() => {
                    sound.playPop();
                    setIsRewardsModalOpen(true);
                  }}
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all cursor-pointer"
                  title="Achievements & Trophies"
                >
                  <Trophy className="w-4 h-4" />
                </button>

                {/* Parent Gate Button */}
                <button
                  onClick={handleOpenParentDashboard}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Parents</span>
                </button>
              </div>
            </div>

            {/* Mascot Advisor Banner */}
            <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full flex-1 space-y-6">
              <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-sm flex items-center justify-between">
                <BarnabyOwl
                  mood="happy"
                  size="md"
                  message="Look at all 5 learning worlds! Which adventure would you like to explore first?"
                />

                <div className="hidden sm:flex flex-col items-end shrink-0 pl-4 border-l border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Learning Mode</span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md mt-0.5">
                    Ages {settings.ageGroup}
                  </span>
                </div>
              </div>

              {/* Worlds Grid (5 Beautiful Learning Worlds) */}
              <div>
                <h3 className="text-xl font-bold font-kid text-slate-900 mb-3">5 Learning Worlds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WORLDS.map(world => (
                    <div
                      key={world.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedWorldId(world.id);
                        setCurrentScreen('world-select');
                      }}
                      className="group bg-white rounded-3xl overflow-hidden border-3 border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      {/* Banner Image Thumbnail */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        <img
                          src={world.bannerImage}
                          alt={world.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                          <span className="text-white font-kid text-lg font-bold drop-shadow">
                            {world.name}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {world.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-indigo-600">
                            {world.games.length} Games Inside
                          </span>
                          <span className="px-3 py-1 bg-amber-400 group-hover:bg-amber-300 text-amber-950 text-xs font-bold rounded-xl transition-colors">
                            Explore →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SCREEN 3: WORLD DETAIL VIEW */}
        {/* ==================================================== */}
        {currentScreen === 'world-select' && (
          <WorldDetailView
            world={WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0]}
            progress={progress}
            onSelectGame={(gameId, level) => {
              setSelectedGameId(gameId);
              setCurrentLevel(level);
              setCurrentScreen('game-play');
            }}
            onBack={() => setCurrentScreen('home')}
            onOpenUpgradeModal={handleOpenUpgradeModal}
          />
        )}

        {/* ==================================================== */}
        {/* SCREEN 4: GAME PLAY SCREEN */}
        {/* ==================================================== */}
        {currentScreen === 'game-play' && (
          <GameContainer
            worldId={selectedWorldId}
            gameId={selectedGameId}
            level={currentLevel}
            ageGroup={settings.ageGroup}
            onFinishGame={handleFinishGame}
            onExitGame={() => setCurrentScreen('world-select')}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {/* ==================================================== */}
        {/* SCREEN 5: PARENT & TEACHER DASHBOARD */}
        {/* ==================================================== */}
        {currentScreen === 'parent-dashboard' && (
          <ParentDashboard
            progress={progress}
            settings={settings}
            onUpdateSettings={newS => setSettings(s => ({ ...s, ...newS }))}
            onOpenUpgradeModal={() => setIsPremiumModalOpen(true)}
            onClose={() => setCurrentScreen('home')}
          />
        )}
      </div>

      {/* Parental Gate Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onSuccess={handleParentGateSuccess}
        onCancel={() => setIsParentGateOpen(false)}
        title="Grown-Ups Verification"
        subtitle="Solve this math problem to enter the Parent Dashboard or Purchases area."
      />

      {/* Amazon Appstore Premium Purchase Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
        onRestorePurchases={handleRestorePurchases}
        isAlreadyPremium={progress.isPremiumUnlocked}
      />

      {/* Rewards & Trophy Room Modal */}
      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        progress={progress}
      />
    </div>
  );
}
