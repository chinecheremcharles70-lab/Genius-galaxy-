import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Star,
  Award,
  Sliders,
  Shield,
  ShoppingBag,
  Volume2,
  VolumeX,
  FileText,
  Smartphone,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { UserProgress, ParentSettings, AmazonReceipt } from '../../types';
import { WORLDS, BADGES } from '../../data/learningWorlds';
import { sound } from '../../services/soundEffects';

interface ParentDashboardProps {
  progress: UserProgress;
  settings: ParentSettings;
  onUpdateSettings: (newSettings: Partial<ParentSettings>) => void;
  onOpenUpgradeModal: () => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  progress,
  settings,
  onUpdateSettings,
  onOpenUpgradeModal,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'settings' | 'purchases' | 'privacy' | 'amazon-kit'>('progress');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Calculate learning metrics
  const completedCount = Object.values(progress.levelScores).filter(l => l.completed).length;

  return (
    <div className="w-full h-full bg-slate-50 text-slate-800 flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Genius Galaxy</span>
          </button>
          <div>
            <h1 className="text-xl font-bold font-kid text-slate-900 leading-tight">Parent & Teacher Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium">Child Profile: {settings.childName} • Age Group: {settings.ageGroup}</p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => { sound.playPop(); setActiveTab('progress'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'progress' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Learning Progress
          </button>
          <button
            onClick={() => { sound.playPop(); setActiveTab('settings'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Time & Controls
          </button>
          <button
            onClick={() => { sound.playPop(); setActiveTab('purchases'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'purchases' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amazon IAP
          </button>
          <button
            onClick={() => { sound.playPop(); setActiveTab('privacy'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'privacy' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Safety & COPPA
          </button>
          <button
            onClick={() => { sound.playPop(); setActiveTab('amazon-kit'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'amazon-kit' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Appstore Spec
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex sm:hidden overflow-x-auto bg-slate-100 px-4 py-2 border-b border-slate-200 gap-1 shrink-0">
        {(['progress', 'settings', 'purchases', 'privacy', 'amazon-kit'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { sound.playPop(); setActiveTab(tab); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            {tab.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full">
        {/* ==================================================== */}
        {/* TAB 1: LEARNING PROGRESS & SKILL ANALYTICS */}
        {/* ==================================================== */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Stars</span>
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{progress.totalStars}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-xs font-bold text-slate-500 uppercase">Levels Done</span>
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{completedCount}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-xs font-bold text-slate-500 uppercase">Time Today</span>
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{progress.todayMinutes} mins</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold text-slate-500 uppercase">Badges</span>
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{progress.unlockedBadges.length} / {BADGES.length}</span>
              </div>
            </div>

            {/* Cognitive Skills Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-kid">Cognitive Skill Development</h3>
              <p className="text-xs text-slate-500 mb-6">Competency mastery based on gameplay accuracy and activity completion.</p>

              <div className="space-y-4">
                {[
                  { name: 'Early Literacy & Phonics (Letter Land)', val: 82, color: 'bg-indigo-600', domain: 'Letter recognition, tracing, phonemes' },
                  { name: 'Numeracy & Mathematical Logic (Number Safari)', val: 75, color: 'bg-amber-500', domain: 'Counting 1-100, visual addition, sequences' },
                  { name: 'Visual-Spatial & Geometry (Colour & Shape Town)', val: 88, color: 'bg-purple-600', domain: 'Shape attributes, pattern completion, sorting' },
                  { name: 'Nature Science & Biology (Animal Explorer)', val: 90, color: 'bg-emerald-600', domain: 'Acoustic animal recognition, habitats, diets' },
                  { name: 'Working Memory & Problem Solving (Puzzle Planet)', val: 70, color: 'bg-sky-600', domain: 'Cosmic memory recall, anomaly deduction' },
                ].map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-800">{skill.name}</span>
                      <span className="font-mono font-bold text-slate-600 tabular-nums">{skill.val}% Mastery</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className={`${skill.color} h-full rounded-full transition-all duration-500`} style={{ width: `${skill.val}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{skill.domain}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Worlds Overview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 font-kid">Learning Worlds Engagement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {WORLDS.map(w => (
                  <div key={w.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{w.name}</h4>
                      <p className="text-xs text-slate-500">{w.games.length} educational games</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: TIME LIMITS & PARENT CONTROLS */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-kid">Session & Screen Time Controls</h3>
              <p className="text-xs text-slate-500">Promote healthy digital habits with automatic break reminders.</p>
            </div>

            {/* Daily Time Limit */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-2">Daily Learning Limit</label>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 45, 60, 0].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      sound.playPop();
                      onUpdateSettings({ dailyTimeLimitMinutes: mins });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      settings.dailyTimeLimitMinutes === mins
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins === 0 ? 'No Limit' : `${mins} Minutes`}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Age Group */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-sm font-bold text-slate-800 mb-1">Target Age Group</label>
              <p className="text-xs text-slate-500 mb-3">Adapts puzzle complexity, letter casing, and arithmetic range.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    sound.playPop();
                    onUpdateSettings({ ageGroup: '3-5' });
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    settings.ageGroup === '3-5'
                      ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Preschool & Kindergarten (Ages 3–5)
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    onUpdateSettings({ ageGroup: '6-8' });
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    settings.ageGroup === '6-8'
                      ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  Early Elementary (Ages 6–8)
                </button>
              </div>
            </div>

            {/* Audio Settings */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Audio & Voice Guidance</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Voice Instructions (Mascot Spoken Guidance)</span>
                  <span className="text-[11px] text-slate-500">Barnaby reads prompts and cheers your child.</span>
                </div>
                <button
                  onClick={() => {
                    sound.playPop();
                    onUpdateSettings({ voiceGuidance: !settings.voiceGuidance });
                    sound.setVoiceEnabled(!settings.voiceGuidance);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    settings.voiceGuidance ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {settings.voiceGuidance ? 'Enabled' : 'Muted'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: AMAZON IN-APP PURCHASING SANDBOX & STATUS */}
        {/* ==================================================== */}
        {activeTab === 'purchases' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-kid">Amazon In-App Purchasing Management</h3>
                <p className="text-xs text-slate-500">Official Amazon Appstore In-App Purchasing v2.0 entitlement status.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                progress.isPremiumUnlocked
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {progress.isPremiumUnlocked ? 'All-Access Active' : 'Free Tier'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">All-Access Genius Pass</span>
                <span className="text-xs text-slate-500">
                  {progress.isPremiumUnlocked
                    ? 'All 5 worlds and 100+ progressive levels unlocked on this device.'
                    : 'Introductory lessons free. Upgrade to unlock all advanced levels.'}
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenUpgradeModal();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                {progress.isPremiumUnlocked ? 'View Amazon SKUs' : 'Upgrade to All-Access'}
              </button>
            </div>

            {/* Amazon Receipts Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verified Amazon Receipts</h4>
              {progress.amazonReceipts.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No active Amazon receipts. Use the Upgrade button to test purchase simulation.
                </div>
              ) : (
                <div className="space-y-2">
                  {progress.amazonReceipts.map(rcpt => (
                    <div key={rcpt.receiptId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-indigo-900">{rcpt.sku}</span>
                        <p className="text-[11px] text-slate-500 font-mono">Receipt: {rcpt.receiptId}</p>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rcpt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: CHILD SAFETY & COPPA PRIVACY */}
        {/* ==================================================== */}
        {activeTab === 'privacy' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-bold font-kid text-slate-900">Child Safety & COPPA Compliance</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Genius Galaxy is strictly engineered for children's privacy and safety under Amazon Child-Directed App Policies and the Children’s Online Privacy Protection Act (COPPA).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">Zero Third-Party Advertising</span>
                  <span className="text-slate-600">No pop-up ads, banners, or video interstitials ever disrupt learning.</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">Local Device Storage</span>
                  <span className="text-slate-600">All stars, progress and settings stay 100% on the Amazon Fire Tablet.</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">Parental Verification Gate</span>
                  <span className="text-slate-600">Children cannot access purchasing or settings screens without adult verification.</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">No Tracking or Personal Data</span>
                  <span className="text-slate-600">No GPS location, no microphone/camera access, and no account signup required.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: AMAZON APPSTORE SPECIFICATION & CODE */}
        {/* ==================================================== */}
        {activeTab === 'amazon-kit' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-kid">Amazon Appstore Distribution Kit</h3>
              <p className="text-xs text-slate-500">Native Android & Amazon Fire OS configuration, manifest permissions, and store copy.</p>
            </div>

            {/* AndroidManifest.xml */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative font-mono text-xs overflow-x-auto">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-slate-400">
                <span>AndroidManifest.xml (Fire OS Optimized)</span>
                <button
                  onClick={() => handleCopy(`<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.littlegenius.academy">\n  <!-- Zero sensitive permissions required for COPPA compliance -->\n  <uses-feature android:name="android.hardware.touchscreen" android:required="true" />\n  <application android:label="Genius Galaxy" android:icon="@mipmap/ic_launcher" android:isGame="true">\n    <activity android:name=".MainActivity" android:screenOrientation="sensorLandscape" android:exported="true">\n      <intent-filter>\n        <action android:name="android.intent.action.MAIN" />\n        <category android:name="android.intent.category.LAUNCHER" />\n      </intent-filter>\n    </activity>\n  </application>\n</manifest>`, 'manifest')}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  {copiedCode === 'manifest' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'manifest' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre>{`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.littlegenius.academy">
    <!-- Zero sensitive permissions required for COPPA compliance -->
    <uses-feature android:name="android.hardware.touchscreen" android:required="true" />
    <application
        android:label="Genius Galaxy"
        android:icon="@mipmap/ic_launcher"
        android:isGame="true"
        android:theme="@style/Theme.LittleGenius">
        <activity
            android:name=".MainActivity"
            android:screenOrientation="sensorLandscape"
            android:configChanges="orientation|screenSize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`}</pre>
            </div>

            {/* Amazon Appstore Metadata */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Amazon Appstore Metadata:</span>
              <p><strong>Title:</strong> Genius Galaxy: Play, Learn and Grow!</p>
              <p><strong>Category:</strong> Educational Games / Kids</p>
              <p><strong>Target Age:</strong> Ages 3–8</p>
              <p><strong>Short Description:</strong> Five magical interactive learning worlds for children: Alphabet, Numbers, Colours & Shapes, Animals, and Logic Puzzles!</p>
              <p><strong>Keywords:</strong> toddler games, phonics, preschool math, tracing alphabet, animal sounds, shape sorting, kindergarten learning, fire tablet kids</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
