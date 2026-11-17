import React from 'react';
import { X, Star, Trophy, Award, Lock, Sparkles } from 'lucide-react';
import { BADGES } from '../../data/learningWorlds';
import { UserProgress } from '../../types';
import { sound } from '../../services/soundEffects';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-4 border-amber-300 shadow-2xl relative my-auto">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Trophy Room & Badges</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-kid text-slate-900">Your Genius Achievements</h2>
          <p className="text-xs text-slate-500 mt-1">Play games, solve puzzles, and earn shiny achievement badges!</p>
        </div>

        {/* Stars Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-2xl p-4 text-amber-950 flex items-center justify-around shadow-md mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 fill-current text-amber-900" />
            <div>
              <span className="text-2xl font-black font-mono tabular-nums">{progress.totalStars}</span>
              <span className="text-xs font-bold block opacity-90">Total Stars</span>
            </div>
          </div>
          <div className="h-8 w-px bg-amber-950/20" />
          <div className="flex items-center gap-2">
            <Award className="w-8 h-8 text-amber-900" />
            <div>
              <span className="text-2xl font-black font-mono tabular-nums">{progress.unlockedBadges.length} / {BADGES.length}</span>
              <span className="text-xs font-bold block opacity-90">Badges Unlocked</span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
          {BADGES.map(badge => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id) || progress.totalStars >= 3;

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
                  isUnlocked ? 'bg-amber-300' : 'bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-kid leading-snug">{badge.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-2xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 shadow-md text-base cursor-pointer"
        >
          Keep Learning! 🚀
        </button>
      </div>
    </div>
  );
};
