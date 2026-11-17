import React from 'react';
import { ArrowLeft, Play, Lock, Star, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { WorldDefinition, GameDefinition, UserProgress } from '../../types';
import { BarnabyOwl } from '../mascot/BarnabyOwl';
import { sound } from '../../services/soundEffects';

interface WorldDetailViewProps {
  world: WorldDefinition;
  progress: UserProgress;
  onSelectGame: (gameId: string, level: number) => void;
  onBack: () => void;
  onOpenUpgradeModal: () => void;
}

export const WorldDetailView: React.FC<WorldDetailViewProps> = ({
  world,
  progress,
  onSelectGame,
  onBack,
  onOpenUpgradeModal,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto bg-amber-50/30">
      {/* Top Navigation */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Worlds</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Learning World</span>
          <h2 className="text-lg sm:text-xl font-bold font-kid text-slate-900 leading-tight">{world.name}</h2>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            sound.playAnimalSound('owl');
            sound.speak(`You are on a ${progress.currentStreak}-day learning streak! Keep learning every day!`);
          }}
          className="flex items-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-orange-950 px-2.5 py-1.5 rounded-xl font-bold text-xs border border-orange-300 transition-colors cursor-pointer shadow-xs"
          title={`${progress.currentStreak}-day learning streak`}
        >
          <Flame className="w-4 h-4 fill-orange-500 text-orange-600 animate-pulse-subtle" />
          <span className="font-mono tabular-nums font-black">{progress.currentStreak}d</span>
        </button>
      </div>

      {/* World Banner & Mascot Greeting */}
      <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full flex-1 space-y-6">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-[21/9] sm:aspect-[24/8] max-h-56">
          <img
            src={world.bannerImage}
            alt={world.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 sm:p-6">
            <div>
              <span className="bg-amber-400 text-amber-950 font-bold text-xs px-2.5 py-0.5 rounded-full inline-block mb-1">
                Ages 3–8 Learning Curriculum
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-kid drop-shadow-md">{world.name}</h1>
              <p className="text-xs sm:text-sm text-amber-100 max-w-xl line-clamp-2">{world.description}</p>
            </div>
          </div>
        </div>

        {/* Barnaby Greeting Bar */}
        <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-sm flex items-center justify-between">
          <BarnabyOwl
            mood="talking"
            size="md"
            message={world.mascotGreeting}
          />
        </div>

        {/* Games Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold font-kid text-slate-900">Choose a Game</h3>
            <span className="text-xs font-semibold text-slate-500">{world.games.length} Playable Activities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {world.games.map((game, idx) => {
              const isLocked = game.isPremiumOnly && !progress.isPremiumUnlocked;
              // Check completed stars for this game level 1
              const levelKey = `${world.id}_${game.id}_1`;
              const scoreData = progress.levelScores[levelKey];
              const stars = scoreData?.stars || 0;

              return (
                <div
                  key={game.id}
                  className={`bg-white rounded-3xl p-5 border-3 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden ${
                    isLocked
                      ? 'border-slate-200 opacity-80'
                      : 'border-amber-200 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Activity {idx + 1}
                        </span>
                        {isLocked && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lock className="w-3 h-3" /> All-Access Pass
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold font-kid text-slate-900 leading-tight">{game.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{game.tagline}</p>
                    </div>

                    {/* Star display */}
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 shrink-0">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {game.skills.map(skill => (
                      <span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Play / Unlock Button */}
                  {isLocked ? (
                    <button
                      onClick={() => {
                        sound.playPop();
                        onOpenUpgradeModal();
                      }}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock with All-Access Pass</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playPop();
                        onSelectGame(game.id, 1);
                      }}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-b-3 border-emerald-700 active:border-b-0 active:translate-y-0.5"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Level 1</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
