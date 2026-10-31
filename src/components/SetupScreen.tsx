import React, { useState } from 'react';
import { Users, UserX, Clock, Play, Check, Shuffle } from 'lucide-react';
import { CategoryId, Language, Theme } from '../types/game';
import { CATEGORIES } from '../data/categories';
import { generatePlayerTitles, FIRST_PLAYER_TITLE, TitlePair } from '../data/titles';
import { GameTopBar } from './GameTopBar';
import { sound } from '../utils/audio';

const DEFAULT_NAMES_BN = [
  'তাহসান',
  'সাফা',
  'রোজা',
  'নিহা',
  'হাসিব',
  'সিজান',
  'সিয়াম',
  'তামান্না',
  'শান্ত',
  'স্বাধীন',
  'জারিফ',
  'তাইফ',
];

const DEFAULT_NAMES_EN = [
  'Tahsan',
  'Safa',
  'Roza',
  'Niha',
  'Hasib',
  'Sijan',
  'Siam',
  'Tamanna',
  'Shanto',
  'Swadhin',
  'Zarif',
  'Taif',
];

const FUN_NAMES_BN = [
  'তাহসান', 'সাফা', 'রোজা', 'নিহা', 'হাসিব', 'সিজান',
  'সিয়াম', 'তামান্না', 'শান্ত', 'স্বাধীন', 'জারিফ', 'তাইফ'
];

const FUN_NAMES_EN = [
  'Tahsan', 'Safa', 'Roza', 'Niha', 'Hasib', 'Sijan',
  'Siam', 'Tamanna', 'Shanto', 'Swadhin', 'Zarif', 'Taif'
];

const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
];

interface SetupScreenProps {
  onStartGame: (
    playersData: { name: string; titleBn: string; titleEn: string }[],
    imposterCount: 1 | 2 | 3,
    selectedCategories: CategoryId[],
    timerSeconds: number,
    votingStyle: 'host_input' | 'pass_and_play'
  ) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onStartGame,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  onOpenRules,
}) => {
  const isEn = lang === 'en';
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [imposterCount, setImposterCount] = useState<1 | 2 | 3>(1);
  const [playerNames, setPlayerNames] = useState<string[]>(
    isEn ? DEFAULT_NAMES_EN.slice(0, 5) : DEFAULT_NAMES_BN.slice(0, 5)
  );
  const [playerTitles, setPlayerTitles] = useState<TitlePair[]>(generatePlayerTitles(5));

  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([
    'food',
    'people',
    'object',
    'animal',
  ]);
  const [timerSeconds, setTimerSeconds] = useState<number>(90);
  const [votingStyle, setVotingStyle] = useState<'host_input' | 'pass_and_play'>('host_input');

  const getMaxImposters = (count: number): 1 | 2 | 3 => {
    if (count <= 4) return 1;
    if (count <= 7) return 2;
    return 3;
  };

  const maxAllowedImposters = getMaxImposters(playerCount);

  const handlePlayerCountChange = (count: number) => {
    sound.playClick();
    setPlayerCount(count);

    if (count > playerNames.length) {
      const pool = isEn ? DEFAULT_NAMES_EN : DEFAULT_NAMES_BN;
      const added: string[] = [];
      for (let i = playerNames.length; i < count; i++) {
        added.push(pool[i] || (isEn ? `Player ${i + 1}` : `খেলোয়াড় ${i + 1}`));
      }
      setPlayerNames([...playerNames, ...added]);
    } else {
      setPlayerNames(playerNames.slice(0, count));
    }

    const newTitles = generatePlayerTitles(count);
    newTitles[0] = FIRST_PLAYER_TITLE;
    setPlayerTitles(newTitles);

    const maxImp = getMaxImposters(count);
    if (imposterCount > maxImp) {
      setImposterCount(maxImp);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...playerNames];
    updated[index] = newName;
    setPlayerNames(updated);
  };

  const handleRandomizeNamesAndTitles = () => {
    sound.playClick();
    const namePool = isEn ? FUN_NAMES_EN : FUN_NAMES_BN;
    const shuffled = [...namePool].sort(() => 0.5 - Math.random());
    setPlayerNames(shuffled.slice(0, playerCount));
    setPlayerTitles(generatePlayerTitles(playerCount));
  };

  const toggleCategory = (catId: CategoryId) => {
    sound.playClick();
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) return;
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCardFlip();
    const playersData = playerNames.map((n, i) => ({
      name: n.trim() ? n.trim() : isEn ? `Player ${i + 1}` : `খেলোয়াড় ${i + 1}`,
      titleBn: playerTitles[i]?.bn || FIRST_PLAYER_TITLE.bn,
      titleEn: playerTitles[i]?.en || FIRST_PLAYER_TITLE.en,
    }));
    onStartGame(playersData, imposterCount, selectedCategories, timerSeconds, votingStyle);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between py-6 px-4 md:px-8 max-w-4xl mx-auto transition-colors duration-200">
      <GameTopBar
        lang={lang}
        onToggleLang={onToggleLang}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenRules={onOpenRules}
      />

      {/* Setup Form */}
      <form onSubmit={handleSubmit} className="my-auto py-5 space-y-5">
        {/* Section 1: Player count & Imposter count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Player Count */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>{isEn ? `Players (${playerCount})` : `খেলোয়াড় সংখ্যা (${playerCount} জন)`}</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {isEn ? `${playerCount} Rounds` : `${playerCount}টি রাউন্ড`}
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1.5">
              {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => handlePlayerCountChange(num)}
                  className={`py-2 rounded-xl text-sm font-bold font-mono transition-all cursor-pointer ${
                    playerCount === num
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Imposter Count */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-500" />
                <span>{isEn ? 'Imposters' : 'ধাপ্পাবাজ সংখ্যা'}</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {playerCount <= 4
                  ? isEn ? 'Max 1' : 'সর্বোচ্চ ১ জন'
                  : playerCount <= 7
                  ? isEn ? 'Max 2' : 'সর্বোচ্চ ২ জন'
                  : isEn ? 'Max 3' : 'সর্বোচ্চ ৩ জন'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => {
                const isAllowed = num <= maxAllowedImposters;
                const isSelected = imposterCount === num;

                return (
                  <button
                    type="button"
                    key={num}
                    disabled={!isAllowed}
                    onClick={() => {
                      sound.playClick();
                      setImposterCount(num as 1 | 2 | 3);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-md'
                        : isAllowed
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer'
                        : 'bg-slate-100/50 dark:bg-slate-850/30 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-40'
                    }`}
                  >
                    <span>{isEn ? `${num} Imposter` : `${num} জন`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Player Names & Titles */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isEn ? 'Players & Roles' : 'খেলোয়াড়দের নাম ও পদবী'}
            </label>
            <button
              type="button"
              onClick={handleRandomizeNamesAndTitles}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Randomize' : 'র‍্যান্ডম নাম ও পদবী'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-2">
            {playerNames.map((name, index) => {
              const currentTitle = isEn ? playerTitles[index]?.en : playerTitles[index]?.bn;

              return (
                <div
                  key={index}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        AVATAR_COLORS[index % AVATAR_COLORS.length]
                      } text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0`}
                    >
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={name}
                      maxLength={16}
                      onKeyDown={() => sound.playKeySound()}
                      onChange={(e) => {
                        sound.playKeySound();
                        handleNameChange(index, e.target.value);
                      }}
                      placeholder={isEn ? `Player ${index + 1}` : `খেলোয়াড় ${index + 1}`}
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div className="pl-8 text-xs font-semibold text-amber-600 dark:text-amber-400 truncate">
                    {currentTitle || (isEn ? 'Citizen' : 'নাগরিক')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Word Categories (No counts) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5 block">
            {isEn ? 'Categories' : 'শব্দ ক্যাটাগরি'}
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
              const cat = CATEGORIES[catId];
              const isSelected = selectedCategories.includes(catId);
              return (
                <button
                  type="button"
                  key={catId}
                  onClick={() => toggleCategory(catId)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-slate-900 dark:text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-50'
                  }`}
                >
                  <span className="text-xs font-bold truncate">
                    {isEn ? cat.nameEn : cat.nameBn}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Timer & Voting Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Discussion Timer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>{isEn ? 'Timer' : 'আলোচনার সময়'}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: isEn ? 'Off' : 'সীমাহীন', value: 0 },
                { label: '60s', value: 60 },
                { label: '90s', value: 90 },
                { label: '120s', value: 120 },
              ].map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => {
                    sound.playClick();
                    setTimerSeconds(t.value);
                  }}
                  className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    timerSeconds === t.value
                      ? 'bg-sky-500 text-white font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voting Style */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 block">
              {isEn ? 'Voting Style' : 'ভোট গ্রহণের পদ্ধতি'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setVotingStyle('host_input');
                }}
                className={`p-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                  votingStyle === 'host_input'
                    ? 'bg-amber-500/15 border border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent'
                }`}
              >
                <span>{isEn ? 'Host Input' : '১ম ব্যক্তি ইনপুট'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setVotingStyle('pass_and_play');
                }}
                className={`p-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                  votingStyle === 'pass_and_play'
                    ? 'bg-amber-500/15 border border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent'
                }`}
              >
                <span>{isEn ? 'Pass & Play' : 'পাস-অ্যান্ড-প্লে'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{isEn ? 'Start Match' : 'খেলা শুরু করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
