import React, { useState, useEffect } from 'react';
import { GamePhase, GameSettings, Player, RoundResult, WordItem, CategoryId, Language, Theme } from './types/game';
import { IntroScreen } from './components/IntroScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleHandoverScreen } from './components/RoleHandoverScreen';
import { RoleCardScreen } from './components/RoleCardScreen';
import { DiscussionScreen } from './components/DiscussionScreen';
import { VotingScreen } from './components/VotingScreen';
import { RevealScreen } from './components/RevealScreen';
import { ScoreboardScreen } from './components/ScoreboardScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { RulesModal } from './components/RulesModal';
import { pickRandomWord } from './data/words';
import { calculateRoundScores } from './utils/scoring';
import { sound } from './utils/audio';

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

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('INTRO');
  const [lang, setLang] = useState<Language>('bn');
  const [theme, setTheme] = useState<Theme>('dark');
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    playerCount: 5,
    imposterCount: 1,
    timerSeconds: 90,
    votingStyle: 'host_input',
    allowCategorySelection: true,
    selectedCategories: ['food', 'people', 'object', 'animal'],
  });

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(5);
  const [usedWordIds, setUsedWordIds] = useState<number[]>([]);

  // Round state
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [imposterIds, setImposterIds] = useState<string[]>([]);
  const [inspectingPlayerIndex, setInspectingPlayerIndex] = useState<number>(0);
  const [currentVotes, setCurrentVotes] = useState<Record<string, string>>({});
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(null);

  // Global settings
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Intro -> Setup
  const handleIntroStart = () => {
    setPhase('SETUP');
  };

  // Start new game from setup
  const handleStartGame = (
    playersData: { name: string; titleBn: string; titleEn: string }[],
    imposterCount: 1 | 2 | 3,
    selectedCategories: CategoryId[],
    timerSeconds: number,
    votingStyle: 'host_input' | 'pass_and_play'
  ) => {
    const initializedPlayers: Player[] = playersData.map((data, index) => ({
      id: `p-${index + 1}-${Date.now()}`,
      name: data.name.trim(),
      titleBn: data.titleBn,
      titleEn: data.titleEn,
      score: 0,
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    }));

    setPlayers(initializedPlayers);
    setSettings({
      playerCount: initializedPlayers.length,
      imposterCount,
      timerSeconds,
      votingStyle,
      allowCategorySelection: true,
      selectedCategories,
    });

    setCurrentRound(1);
    setTotalRounds(initializedPlayers.length);
    setUsedWordIds([]);
    setRoundResults([]);
    setLastRoundResult(null);

    // Initialize round 1
    initRound(1, initializedPlayers, selectedCategories, imposterCount, []);
  };

  // Helper to start or advance a round
  const initRound = (
    roundNum: number,
    currentPlayers: Player[],
    categories: CategoryId[],
    numImposters: 1 | 2 | 3,
    prevUsedIds: number[]
  ) => {
    const word = pickRandomWord(prevUsedIds, categories);
    setCurrentWord(word);
    setUsedWordIds([...prevUsedIds, word.id]);

    // Assign random imposter(s)
    const shuffledPlayerIds = [...currentPlayers.map((p) => p.id)].sort(() => 0.5 - Math.random());
    const assignedImposters = shuffledPlayerIds.slice(0, numImposters);
    setImposterIds(assignedImposters);

    setCurrentRound(roundNum);
    setInspectingPlayerIndex(0);
    setCurrentVotes({});
    setPhase('ROLE_HANDOVER');
  };

  const handleProceedToCard = () => {
    setPhase('ROLE_REVEAL');
  };

  const handleNextPlayerCard = () => {
    if (inspectingPlayerIndex + 1 < players.length) {
      setInspectingPlayerIndex(inspectingPlayerIndex + 1);
      setPhase('ROLE_HANDOVER');
    } else {
      sound.playClick();
      setPhase('DISCUSSION');
    }
  };

  const handleProceedToVoting = () => {
    setPhase('VOTING');
  };

  const handleSubmitVotes = (votes: Record<string, string>) => {
    if (!currentWord) return;

    setCurrentVotes(votes);

    const scoreDetails = calculateRoundScores({
      players,
      imposterIds,
      votes,
      word: currentWord,
      imposterGuessedWord: false,
    });

    const result: RoundResult = {
      roundNumber: currentRound,
      word: currentWord,
      imposterIds,
      votes,
      scoreDetails,
      imposterGuessedWord: false,
    };

    setLastRoundResult(result);
    setPhase('ROUND_REVEAL');
  };

  const handleProceedToScoreboard = (imposterGuessedWord: boolean) => {
    if (!currentWord) return;

    const finalScoreDetails = calculateRoundScores({
      players,
      imposterIds,
      votes: currentVotes,
      word: currentWord,
      imposterGuessedWord,
    });

    const updatedPlayers = players.map((p) => {
      const detail = finalScoreDetails.find((d) => d.playerId === p.id);
      const delta = detail?.pointsDelta ?? 0;
      return {
        ...p,
        score: p.score + delta,
      };
    });

    setPlayers(updatedPlayers);

    const finalResult: RoundResult = {
      roundNumber: currentRound,
      word: currentWord,
      imposterIds,
      votes: currentVotes,
      scoreDetails: finalScoreDetails,
      imposterGuessedWord,
    };

    setLastRoundResult(finalResult);
    setRoundResults((prev) => [...prev, finalResult]);
    setPhase('ROUND_SCOREBOARD');
  };

  const handleStartNextRound = () => {
    initRound(
      currentRound + 1,
      players,
      settings.selectedCategories,
      settings.imposterCount,
      usedWordIds
    );
  };

  const handleFinishGame = () => {
    setPhase('GAME_OVER');
  };

  const handlePlayAgainSamePlayers = () => {
    const resetPlayers = players.map((p) => ({ ...p, score: 0 }));
    setPlayers(resetPlayers);
    setCurrentRound(1);
    setUsedWordIds([]);
    setRoundResults([]);
    setLastRoundResult(null);
    initRound(1, resetPlayers, settings.selectedCategories, settings.imposterCount, []);
  };

  const handleResetToSetup = () => {
    setPhase('SETUP');
  };

  const currentPlayer = players[inspectingPlayerIndex];
  const isCurrentPlayerImposter = currentPlayer ? imposterIds.includes(currentPlayer.id) : false;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 selection:bg-amber-500/30 transition-colors duration-200">
      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} lang={lang} />

      {/* Screen Router */}
      {phase === 'INTRO' && (
        <IntroScreen
          onStart={handleIntroStart}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {phase === 'SETUP' && (
        <SetupScreen
          onStartGame={handleStartGame}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {phase === 'ROLE_HANDOVER' && currentPlayer && (
        <RoleHandoverScreen
          player={currentPlayer}
          playerIndex={inspectingPlayerIndex}
          totalPlayers={players.length}
          roundNumber={currentRound}
          onProceedToCard={handleProceedToCard}
          lang={lang}
          theme={theme}
        />
      )}

      {phase === 'ROLE_REVEAL' && currentPlayer && currentWord && (
        <RoleCardScreen
          player={currentPlayer}
          isImposter={isCurrentPlayerImposter}
          word={currentWord}
          playerIndex={inspectingPlayerIndex}
          totalPlayers={players.length}
          onNextPlayer={handleNextPlayerCard}
          lang={lang}
          theme={theme}
        />
      )}

      {phase === 'DISCUSSION' && currentWord && (
        <DiscussionScreen
          players={players}
          roundNumber={currentRound}
          totalRounds={totalRounds}
          word={currentWord}
          timerSeconds={settings.timerSeconds}
          onProceedToVoting={handleProceedToVoting}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {phase === 'VOTING' && (
        <VotingScreen
          players={players}
          roundNumber={currentRound}
          initialVotingStyle={settings.votingStyle}
          onSubmitVotes={handleSubmitVotes}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {phase === 'ROUND_REVEAL' && lastRoundResult && (
        <RevealScreen
          players={players}
          roundResult={lastRoundResult}
          onProceedToScoreboard={handleProceedToScoreboard}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {phase === 'ROUND_SCOREBOARD' && (
        <ScoreboardScreen
          players={players}
          currentRound={currentRound}
          totalRounds={totalRounds}
          lastRoundResult={lastRoundResult}
          onStartNextRound={handleStartNextRound}
          onFinishGame={handleFinishGame}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {phase === 'GAME_OVER' && (
        <GameOverScreen
          players={players}
          roundResults={roundResults}
          onPlayAgainSamePlayers={handlePlayAgainSamePlayers}
          onResetToSetup={handleResetToSetup}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}
    </div>
  );
}
