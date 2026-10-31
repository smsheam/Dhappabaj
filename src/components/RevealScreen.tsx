import React, { useState } from 'react';
import { ShieldAlert, Award, ArrowRight, Sparkles, AlertTriangle, Eye } from 'lucide-react';
import { Player, RoundResult, Language, Theme } from '../types/game';
import { CATEGORIES } from '../data/categories';
import { GameTopBar } from './GameTopBar';
import { sound } from '../utils/audio';

interface RevealScreenProps {
  players: Player[];
  roundResult: RoundResult;
  onProceedToScoreboard: (imposterGuessedWord: boolean) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  players,
  roundResult,
  onProceedToScoreboard,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  onOpenRules,
}) => {
  const isEn = lang === 'en';
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [imposterGuessedWord, setImposterGuessedWord] = useState<boolean>(false);

  const { word, imposterIds, scoreDetails } = roundResult;
  const category = CATEGORIES[word.category];
  const imposters = players.filter((p) => imposterIds.includes(p.id));

  const handleReveal = () => {
    sound.playSuspenseReveal();
    setIsRevealed(true);
  };

  const handleToggleImposterGuess = () => {
    sound.playClick();
    setImposterGuessedWord(!imposterGuessedWord);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between py-6 px-4 md:px-8 max-w-3xl mx-auto transition-colors duration-200">
      <GameTopBar
        lang={lang}
        onToggleLang={onToggleLang}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenRules={onOpenRules}
        roundBadge={isEn ? `Results · Round ${roundResult.roundNumber}` : `ফলাফল · রাউন্ড ${roundResult.roundNumber}`}
      />

      {/* Main Reveal Content */}
      <div className="my-auto py-5 space-y-5">
        {!isRevealed ? (
          /* Pre-reveal suspense card */
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-xl relative overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {isEn ? 'All Votes Are Counted!' : 'ভোট গণনা সম্পন্ন!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                {isEn ? 'Who was the sneaky imposter?' : 'কে ছিল নিরীহদের ছদ্মবেশে আসল Imposter?'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReveal}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-rose-950/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {isEn ? 'Reveal Imposter & Word' : 'ধাপ্পাবাজের পরিচয় দেখুন!'}
              </span>
            </button>
          </div>
        ) : (
          /* Post-reveal breakdown */
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Imposter Spotlight Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-50 dark:from-rose-950/70 via-white dark:via-slate-900 to-white dark:to-slate-950 border border-rose-300 dark:border-rose-500/50 shadow-xl text-center space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>{isEn ? 'The Imposter' : 'এই রাউন্ডের Imposter'}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {imposters.map((imp) => {
                  const iTitle = isEn ? imp.titleEn : imp.titleBn;
                  return (
                    <div key={imp.id} className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-2xl shadow-xs mb-1.5">
                        {imp.name.charAt(0)}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{imp.name}</h3>
                      <span className="text-xs text-rose-600 dark:text-rose-300 font-semibold">{iTitle}</span>
                    </div>
                  );
                })}
              </div>

              {/* Secret Word Reveal */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                  {isEn ? `Secret Word (${category?.nameEn})` : `আসল গোপন শব্দ (${category?.nameBn})`}
                </span>
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-wide">
                  {isEn ? word.wordEn : word.wordBn}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {isEn ? word.wordBn : word.wordEn}
                </p>

                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left max-w-md mx-auto">
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block">
                    {isEn ? 'Imposter Hint was:' : 'Imposter-কে দেওয়া ইঙ্গিত (Hint):'}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                    &ldquo;{isEn ? word.hintEn || word.hintBn : word.hintBn}&rdquo;
                  </p>
                </div>
              </div>

              {/* Imposter Word Guess Bonus Interactive Check */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleToggleImposterGuess}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    imposterGuessedWord
                      ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>{isEn ? 'Did the Imposter guess the secret word?' : 'Imposter কি আসল শব্দটি সঠিকভাবে অনুমান করতে পেরেছে?'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">
                    {imposterGuessedWord
                      ? (isEn ? 'Yes (+3 Bonus)' : 'হ্যাঁ (+৩ বোনাস)')
                      : (isEn ? 'No (Click to award)' : 'না (ক্লিক করে যুক্ত করুন)')}
                  </span>
                </button>
              </div>
            </div>

            {/* Voting Details & Practical Points Delta */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{isEn ? 'Round Points Breakdown' : 'ভোটের ফলাফল ও পয়েন্ট সমন্বয়'}</span>
              </h4>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {scoreDetails.map((detail) => {
                  const votedPlayer = players.find((p) => p.id === detail.votedForId);
                  const extraBonus = detail.isImposter && imposterGuessedWord ? 3 : 0;
                  const totalDelta = detail.pointsDelta + extraBonus;
                  const isPositive = totalDelta > 0;
                  const isZero = totalDelta === 0;
                  const dTitle = isEn ? detail.playerTitleEn : detail.playerTitleBn;

                  const reasonTexts = detail.reasons.map((r) => (isEn ? r.en : r.bn));
                  if (extraBonus > 0) {
                    reasonTexts.push(isEn ? 'Word guess (+3)' : 'শব্দ অনুমান (+৩)');
                  }

                  return (
                    <div key={detail.playerId} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            detail.isImposter
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {detail.isImposter ? '🕵️' : '🛡️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{detail.playerName}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">({dTitle})</span>
                            {detail.isImposter && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold">
                                Imposter
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {isEn ? 'Voted for: ' : 'ভোট দিয়েছে: '}
                            <strong className="text-slate-700 dark:text-slate-300">
                              {votedPlayer ? votedPlayer.name : (isEn ? 'None' : 'কোনোটি নয়')}
                            </strong>
                            {' · '}
                            {isEn ? `Votes received: ${detail.votesReceived}` : `পাওয়া ভোট: ${detail.votesReceived}টি`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span
                          className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                            isPositive
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                              : isZero
                              ? 'text-slate-500 bg-slate-100 dark:bg-slate-800'
                              : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {isPositive ? `+${totalDelta}` : totalDelta}
                        </span>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[150px] truncate">
                          {reasonTexts.join(', ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Practical Scoring Rules Table */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                {isEn ? 'Practical Scoring Rules' : 'ব্যবহারিক স্কোরিং নিয়মাবলি'}
              </span>
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300 font-mono">
                  <tr>
                    <td className="py-1 font-sans">{isEn ? 'Correct Imposter vote' : 'সঠিক Imposter শনাক্ত'}</td>
                    <td className="py-1 text-right text-emerald-600 dark:text-emerald-400 font-bold">+৪</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">{isEn ? 'Mistaken vote' : 'ভুল ব্যক্তিকে ভোট'}</td>
                    <td className="py-1 text-right text-rose-600 dark:text-rose-400 font-bold">-১</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">{isEn ? 'Imposter survived undetected' : 'Imposter সফলভাবে আত্মগোপন'}</td>
                    <td className="py-1 text-right text-amber-600 dark:text-amber-400 font-bold">Imposter +৫</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">{isEn ? 'Imposter received 0 votes' : 'Imposter শূন্য ভোট পাওয়া'}</td>
                    <td className="py-1 text-right text-sky-600 dark:text-sky-400 font-bold">+৩ {isEn ? 'Bonus' : 'বোনাস'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">{isEn ? 'Imposter guessed secret word' : 'Imposter সঠিক শব্দ অনুমান'}</td>
                    <td className="py-1 text-right text-purple-600 dark:text-purple-400 font-bold">+৩ {isEn ? 'Bonus' : 'বোনাস'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-sans">{isEn ? 'Imposter unanimously caught' : 'Imposter সবার ভোটে শনাক্ত'}</td>
                    <td className="py-1 text-right text-rose-600 dark:text-rose-400 font-bold">Imposter -২</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      {isRevealed && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onProceedToScoreboard(imposterGuessedWord);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <span>{isEn ? 'View Scoreboard' : 'চলতি স্কোরবোর্ড দেখুন'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
