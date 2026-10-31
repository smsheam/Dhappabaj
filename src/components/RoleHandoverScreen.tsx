import React from 'react';
import { Eye, Shield, ArrowRight } from 'lucide-react';
import { Player, Language, Theme } from '../types/game';
import { sound } from '../utils/audio';

interface RoleHandoverScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  roundNumber: number;
  onProceedToCard: () => void;
  lang: Language;
  theme: Theme;
}

export const RoleHandoverScreen: React.FC<RoleHandoverScreenProps> = ({
  player,
  playerIndex,
  totalPlayers,
  roundNumber,
  onProceedToCard,
  lang,
}) => {
  const isEn = lang === 'en';
  const titleText = isEn ? player.titleEn : player.titleBn;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between py-8 px-4 max-w-md mx-auto transition-colors duration-200">
      {/* Top indicator */}
      <div className="text-center space-y-1">
        <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono font-bold">
          {isEn ? `Round ${roundNumber} · Pass & Play` : `রাউন্ড ${roundNumber} · কার্ড বিতরণ`}
        </span>
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>{isEn ? 'Player' : 'খেলোয়াড়'}</span>
          <span className="font-mono text-slate-900 dark:text-white font-bold">{playerIndex + 1}</span>
          <span>/ {totalPlayers}</span>
        </div>
      </div>

      {/* Main Privacy Shield Card */}
      <div className="my-auto py-8 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xl relative overflow-hidden">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-5 shadow-xs">
          <Shield className="w-10 h-10 text-amber-500" />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">
          {isEn ? 'Pass device to' : 'মোবাইলটি হস্তান্তর করুন'}
        </p>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {player.name}
        </h2>
        <div className="mt-1 mb-5">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-300 font-bold border border-slate-200 dark:border-slate-700 inline-block">
            {titleText}
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-amber-300 mb-2">
          <Eye className="w-3.5 h-3.5" />
          <span>{isEn ? 'Keep screen private' : 'অন্য কেউ যেন স্ক্রিনে না তাকায়'}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            sound.playCardFlip();
            onProceedToCard();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
        >
          <span>{isEn ? `I am ${player.name}, Reveal Card` : `আমি ${player.name}, কার্ড উন্মোচন করুন`}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
