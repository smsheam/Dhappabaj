import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Player, WordItem, Language, Theme } from '../types/game';
import { getHardHint, getShortExplanation } from '../utils/hintHelper';
import { sound } from '../utils/audio';
import { PlayerAvatar } from './PlayerAvatar';

interface RoleCardScreenProps {
  player: Player;
  isImposter: boolean;
  word: WordItem;
  playerIndex: number;
  totalPlayers: number;
  onNextPlayer: () => void;
  lang: Language;
  theme: Theme;
}

export const RoleCardScreen: React.FC<RoleCardScreenProps> = ({
  player,
  isImposter,
  word,
  playerIndex,
  totalPlayers,
  onNextPlayer,
  lang,
}) => {
  const isEn = lang === 'en';
  const [isRevealed, setIsRevealed] = useState<boolean>(true);

  const handleToggleReveal = () => {
    sound.playCardFlip();
    setIsRevealed(!isRevealed);
  };

  const hardHint = getHardHint(word);
  const explanation = getShortExplanation(word);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between py-8 px-4 max-w-md mx-auto transition-colors duration-200">
      {/* Top Bar with Hide/Show */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <PlayerAvatar
            avatar={player.avatar || '🕵️'}
            color={player.avatarColor || 'bg-amber-500'}
            size="sm"
            badge={playerIndex + 1}
          />
          <div>
            <span className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono font-bold block">
              {isEn ? `Player ${playerIndex + 1}` : `খেলোয়াড় ${playerIndex + 1}`}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{player.name}</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleReveal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors shadow-xs cursor-pointer"
        >
          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isRevealed ? (isEn ? 'Hide' : 'লুকান') : (isEn ? 'Show' : 'দেখুন')}</span>
        </button>
      </div>

      {/* The Pure Minimal Flash Card */}
      <div className="my-auto py-6">
        <div
          className={`relative rounded-3xl p-8 sm:p-10 text-center transition-all duration-300 shadow-xl border ${
            !isRevealed
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              : isImposter
              ? 'bg-gradient-to-b from-rose-50 dark:from-rose-950/70 via-white dark:via-slate-900 to-white dark:to-slate-950 border-rose-300 dark:border-rose-500/50'
              : 'bg-gradient-to-b from-amber-50/50 dark:from-slate-900 via-white dark:via-slate-900 to-white dark:to-slate-950 border-amber-200 dark:border-amber-500/40'
          }`}
        >
          {!isRevealed ? (
            <div className="py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <EyeOff className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {isEn ? 'Card is Hidden' : 'কার্ডটি গোপন রাখা হয়েছে'}
              </p>
              <button
                type="button"
                onClick={handleToggleReveal}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-amber-400 cursor-pointer"
              >
                {isEn ? 'Tap to Reveal' : 'দেখতে ট্যাপ করুন'}
              </button>
            </div>
          ) : isImposter ? (
            /* IMPOSTER: Shows "আপনি একজন ধাপ্পাবাজ", "আপনার জন্য Hints:", and Hard Cryptic Hint in LARGE text with English at bottom */
            <div className="py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                {isEn ? 'You are an Imposter' : 'আপনি একজন ধাপ্পাবাজ'}
              </p>

              <div className="pt-2 space-y-3">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {isEn ? 'Your Hint:' : 'আপনার জন্য Hint:'}
                </p>
                <p className="text-4xl sm:text-5xl font-black text-amber-500 dark:text-amber-400 tracking-wide leading-tight">
                  {isEn ? hardHint.en : hardHint.bn}
                </p>

                {/* English hint at bottom as requested */}
                <div className="pt-2">
                  <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 py-1.5 px-3 rounded-lg inline-block">
                    {isEn ? `Bangla Hint: ${hardHint.bn}` : `Hint in English: ${hardHint.en}`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* CITIZEN: Only shows player no, player name, and the word in large with (short english explanation) */
            <div className="py-6 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-wide leading-tight">
                {isEn ? word.wordEn : word.wordBn}
              </p>

              <p className="text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 font-mono">
                ({explanation})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNextPlayer();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
        >
          <span>
            {playerIndex + 1 < totalPlayers
              ? isEn ? 'Next Player' : 'পরবর্তী খেলোয়াড়'
              : isEn ? 'Start Discussion' : 'আলোচনা শুরু করুন'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
