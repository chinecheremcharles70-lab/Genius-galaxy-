import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = "Grown-Ups Only",
  subtitle = "Please solve this math question to enter the Parent Dashboard or Purchases area.",
}) => {
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(8);
  const [operator, setOperator] = useState<'x' | '+'>('x');
  const [userInput, setUserInput] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate randomized adult-level arithmetic that young children 3-8 cannot accidentally solve
      const n1 = Math.floor(Math.random() * 5) + 6; // 6 to 10
      const n2 = Math.floor(Math.random() * 6) + 4; // 4 to 9
      setNum1(n1);
      setNum2(n2);
      setOperator(Math.random() > 0.4 ? 'x' : '+');
      setUserInput('');
      setHasError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const correctAnswer = operator === 'x' ? num1 * num2 : num1 + num2;

  const handleKeypadPress = (val: string) => {
    sound.playPop();
    setHasError(false);
    if (userInput.length < 4) {
      setUserInput(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    sound.playPop();
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userInput, 10) === correctAnswer) {
      sound.playCorrect();
      onSuccess();
    } else {
      sound.playTryAgain();
      setHasError(true);
      setUserInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-slate-300 shadow-2xl relative">
        <button
          onClick={() => {
            sound.playPop();
            onCancel();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-kid text-slate-900 leading-tight">{title}</h3>
            <span className="text-xs text-slate-500 font-medium">Child Safety Protection</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">{subtitle}</p>

        {/* Math Challenge Box */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-center mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Parent Verification Challenge</p>
          <p className="text-3xl font-extrabold text-slate-800 tracking-wider">
            {num1} {operator === 'x' ? '×' : '+'} {num2} = ?
          </p>
        </div>

        {/* Input display */}
        <div className={`h-12 bg-white border-2 rounded-xl mb-4 flex items-center justify-center text-2xl font-bold tracking-widest ${
          hasError ? 'border-rose-500 text-rose-600 bg-rose-50' : 'border-indigo-400 text-slate-900'
        }`}>
          {userInput || <span className="text-slate-300 text-base font-normal">Enter answer</span>}
        </div>

        {hasError && (
          <p className="text-xs text-rose-600 text-center font-bold mb-3">
            Incorrect answer. Please calculate {num1} {operator === 'x' ? '×' : '+'} {num2}.
          </p>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => (
            <button
              key={k}
              type="button"
              onClick={() => handleKeypadPress(k)}
              className="h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold rounded-xl text-lg transition-colors cursor-pointer"
            >
              {k}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm cursor-pointer"
          >
            Del
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-12 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-lg cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow cursor-pointer"
          >
            Verify
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-tight">
          This parental verification gate prevents accidental child purchases and secures settings in compliance with COPPA guidelines.
        </p>
      </div>
    </div>
  );
};
