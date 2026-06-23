/* ============================================================
   FOOTBALL QUIZ PLATFORM — Score Engine & Stats
   ============================================================
   localStorage key: "fqp_stats"
   ============================================================ */

const FQP = (function () {
  const STORAGE_KEY = 'fqp_stats';

  const DEFAULTS = {
    totalGames: 0,
    totalWins: 0,
    totalScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    byDifficulty: {
      easy: { played: 0, won: 0 },
      mid:  { played: 0, won: 0 },
      hard: { played: 0, won: 0 }
    },
    history: []
  };

  const BASE_POINTS = { easy: 100, mid: 200, hard: 300 };
  const GUESS_MULTIPLIER = [3, 2, 1];       // index = guessCount (0,1,2)
  const HINT_BONUS = [100, 75, 50, 0];      // index = hintLevel (0,1,2,3)
  const MAX_HISTORY = 50;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULTS);
      const parsed = JSON.parse(raw);
      return { ...structuredClone(DEFAULTS), ...parsed,
        byDifficulty: { ...structuredClone(DEFAULTS.byDifficulty), ...(parsed.byDifficulty || {}) }
      };
    } catch { return structuredClone(DEFAULTS); }
  }

  function save(stats) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch {}
  }

  function calcScore(difficulty, guessCount, hintLevel, won) {
    if (!won) return 0;
    const base = BASE_POINTS[difficulty] || 100;
    const mult = GUESS_MULTIPLIER[Math.min(guessCount, 2)];
    const bonus = HINT_BONUS[Math.min(hintLevel, 3)];
    return (base * mult) + bonus;
  }

  function record(result) {
    const { difficulty, guessCount, hintLevel, won, playerName } = result;
    const score = calcScore(difficulty, guessCount, hintLevel, won);
    const stats = load();

    stats.totalGames++;
    stats.totalScore += score;

    if (won) {
      stats.totalWins++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
    } else {
      stats.currentStreak = 0;
    }

    if (stats.byDifficulty[difficulty]) {
      stats.byDifficulty[difficulty].played++;
      if (won) stats.byDifficulty[difficulty].won++;
    }

    stats.history.unshift({
      date: new Date().toISOString(),
      game: 'career-path',
      difficulty,
      won,
      score,
      guessCount,
      hintLevel,
      playerName: playerName || ''
    });
    if (stats.history.length > MAX_HISTORY) stats.history.length = MAX_HISTORY;

    save(stats);
    return { score, stats };
  }

  function getStats() {
    return load();
  }

  function getWinRate(stats) {
    if (!stats.totalGames) return 0;
    return Math.round((stats.totalWins / stats.totalGames) * 100);
  }

  function buildShareText(result) {
    const { difficulty, guessCount, hintLevel, won, score, stats } = result;
    const diffLabels = { easy: 'Easy', mid: 'Medium', hard: 'Hard' };
    const guessLabels = ['1st guess', '2nd guess', '3rd guess'];
    const pips = won
      ? Array.from({ length: 3 }, (_, i) => i < (3 - guessCount) ? '\u{1F7E2}' : '⚪').join('')
      : '\u{1F534}\u{1F534}\u{1F534}';

    let lines = [];
    lines.push('⚽ Career Path Finder');
    if (won) {
      lines.push(`${pips}  ${guessLabels[guessCount]} · ${score} pts`);
    } else {
      lines.push(`${pips}  Not guessed`);
    }
    lines.push(`\u{1F3AF} ${diffLabels[difficulty] || difficulty}`);
    if (hintLevel > 0) lines.push(`\u{1F4A1} ${hintLevel} hint${hintLevel > 1 ? 's' : ''} used`);
    if (stats && stats.currentStreak > 1) lines.push(`\u{1F525} Streak: ${stats.currentStreak}`);
    return lines.join('\n');
  }

  async function share(result) {
    const text = buildShareText(result);
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return 'shared';
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { calcScore, record, getStats, getWinRate, share, buildShareText, reset };
})();
