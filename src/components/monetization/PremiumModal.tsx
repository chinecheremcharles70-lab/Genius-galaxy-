import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, RefreshCw, ShoppingBag, AlertCircle } from 'lucide-react';
import { AmazonReceipt } from '../../types';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (receipt: AmazonReceipt) => void;
  onRestorePurchases: () => boolean;
  isAlreadyPremium: boolean;
}

interface AmazonProductSku {
  sku: string;
  title: string;
  term: string;
  price: string;
  priceAmountMicros: number;
  itemType: 'SUBSCRIPTION' | 'ENTITLED';
  description: string;
  badge?: string;
}

const AMAZON_SKUS: AmazonProductSku[] = [
  {
    sku: 'com.littlegenius.academy.annual_genius',
    title: 'Super Genius Annual Pass',
    term: 'per year',
    price: '$29.99',
    priceAmountMicros: 29990000,
    itemType: 'SUBSCRIPTION',
    description: 'Billed annually ($2.49/mo). Includes all 5 learning worlds, future content & offline packs.',
    badge: 'Most Popular',
  },
  {
    sku: 'com.littlegenius.academy.monthly_pass',
    title: 'Monthly Explorer Pass',
    term: 'per month',
    price: '$3.99',
    priceAmountMicros: 3990000,
    itemType: 'SUBSCRIPTION',
    description: 'Flexible monthly billing. Cancel anytime in your Amazon Appstore Subscriptions.',
  },
  {
    sku: 'com.littlegenius.academy.lifetime_family',
    title: 'Lifetime Family All-Access',
    term: 'one-time purchase',
    price: '$49.99',
    priceAmountMicros: 49990000,
    itemType: 'ENTITLED',
    description: 'Pay once, keep forever. Share with all child profiles on your Amazon Fire Tablet.',
    badge: 'Best Family Value',
  },
];

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onPurchaseSuccess,
  onRestorePurchases,
  isAlreadyPremium,
}) => {
  const [selectedSku, setSelectedSku] = useState<string>('com.littlegenius.academy.annual_genius');
  const [purchaseState, setPurchaseState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const handlePurchase = () => {
    sound.playPop();
    setPurchaseState('PROCESSING');
    setStatusMessage('Connecting to Amazon Appstore In-App Purchasing service...');

    // Simulate Amazon Appstore IAP v2.0 purchase flow
    setTimeout(() => {
      const chosen = AMAZON_SKUS.find(s => s.sku === selectedSku);
      if (!chosen) {
        setPurchaseState('ERROR');
        setStatusMessage('Amazon IAP Error: Product SKU not found.');
        return;
      }

      // Generate authentic Amazon Receipt structure
      const newReceipt: AmazonReceipt = {
        receiptId: `amzn.rcpt.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`,
        sku: chosen.sku,
        itemType: chosen.itemType,
        purchaseDate: new Date().toISOString(),
        status: 'FULFILLED',
      };

      setPurchaseState('SUCCESS');
      setStatusMessage(`Purchase fulfilled! Entitlement granted for ${chosen.title}.`);
      sound.playLevelFanfare();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });

      setTimeout(() => {
        onPurchaseSuccess(newReceipt);
        setPurchaseState('IDLE');
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleRestore = () => {
    sound.playPop();
    setPurchaseState('PROCESSING');
    setStatusMessage('Querying Amazon Appstore receipt history...');

    setTimeout(() => {
      const restored = onRestorePurchases();
      if (restored) {
        setPurchaseState('SUCCESS');
        setStatusMessage('Active Amazon subscription restored successfully!');
        sound.playCorrect();
      } else {
        setPurchaseState('IDLE');
        setStatusMessage('No previous Amazon Appstore purchases found for this Amazon ID.');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-4 border-amber-300 shadow-2xl relative my-auto">
        {/* Close Button */}
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
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Little Genius Academy • All-Access Pass</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-kid text-slate-900">Unlock Full Learning Access</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Give your child unmetered access to all 5 learning worlds, 100+ progressive levels, and rich cognitive games.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-700">
          <div className="flex items-center gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All 5 Learning Worlds Unlocked</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Advanced Levels (2, 3, 4)</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Offline Access</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Third-Party Ads</span>
          </div>
        </div>

        {/* SKU Options (Amazon Appstore pricing) */}
        <div className="flex flex-col gap-3 mb-6">
          {AMAZON_SKUS.map(item => {
            const isSelected = selectedSku === item.sku;

            return (
              <div
                key={item.sku}
                onClick={() => setSelectedSku(item.sku)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    {item.badge && (
                      <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-slate-900">{item.price}</span>
                  <span className="text-[10px] text-slate-500 block">{item.term}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status notice */}
        {statusMessage && (
          <div className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
            purchaseState === 'ERROR'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : purchaseState === 'SUCCESS'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePurchase}
          disabled={purchaseState === 'PROCESSING' || isAlreadyPremium}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-extrabold rounded-2xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 shadow-lg text-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{isAlreadyPremium ? 'All-Access Active' : 'Subscribe with Amazon Appstore'}</span>
        </button>

        {/* Amazon Appstore Footer & Restore Link */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Amazon In-App Purchasing v2.0</span>
          </div>
          <button
            onClick={handleRestore}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restore Purchases</span>
          </button>
        </div>
      </div>
    </div>
  );
};
