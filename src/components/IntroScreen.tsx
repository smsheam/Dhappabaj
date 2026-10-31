import React from 'react';
import { Play, Volume2, VolumeX, Moon, Sun, Globe, ShieldAlert } from 'lucide-react';
import { Language, Theme } from '../types/game';
import { DhappabajLogo } from './DhappabajLogo';
import { sound } from '../utils/audio';

interface IntroScreenProps {
  onStart: () => void;
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
}) => {
  const isEn = lang === 'en';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6 sm:p-10 max-w-xl mx-auto transition-colors duration-200">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-end gap-2.5">
        {/* Language switch */}
        <button
          type="button"
          onClick={() => {
            sound.playKeySound();
            onToggleLang();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-amber-500/50 shadow-xs transition-all cursor-pointer"
          title={isEn ? 'Switch to বাংলা' : 'Switch to English'}
        >
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>{isEn ? 'বাংলা' : 'English'}</span>
        </button>

        {/* Theme switch */}
        <button
          type="button"
          onClick={() => {
            sound.playKeySound();
            onToggleTheme();
          }}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 shadow-xs transition-all cursor-pointer"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={onToggleMute}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 shadow-xs transition-all cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
        </button>
      </div>

      {/* Center Hero: ONLY Logo + Catchy Tagline (No headline text or imposter who edition) */}
      <div className="my-auto text-center space-y-7 py-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Transparent Logo */}
        <div className="relative mx-auto transition-transform duration-300 hover:scale-105">
          <DhappabajLogo theme={theme} size="xl" />
        </div>

        {/* Catchy Tagline */}
        <div className="max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-sm sm:text-base font-bold tracking-tight">
              {isEn
                ? 'Expose the sneaky imposter hiding among you — bring them to justice!'
                : 'আপনার সাথে থাকা ধাপ্পাবাজকে আইনের হাতে তুলে দিন!'}
            </p>
          </div>
        </div>
      </div>

      {/* Entry Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>{isEn ? "Let's Get Started!" : 'চলুন শুরু করা যাক!'}</span>
        </button>
      </div>
    </div>
  );
};
