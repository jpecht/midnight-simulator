const { performance } = require('perf_hooks');
const readline = require('readline');

const helpers = require('./helpers');
const strategies = require('./strategies');

const {
  calculateScore,
  formatLargeNumber,
  formatTime,
  getPossibilitySets,
} = helpers;

const TOTAL_DICE = 6;

// Calculate all possible dice combinations up front
const dicePossibilitiesLookup = getPossibilitySets();

// Count number of times a score is tallied
const scoreFrequency = [];
for (let i = 0; i <= 24; i += 1) {
  scoreFrequency[i] = 0;
}

// Keep track of how many loops have been run so far
let numPossibilities = 0;
let progress = 0;

/**
 * Runs through EVERY game possibility
 */
function runEveryGame(storedDice = [], multiplier = 1, action) {
  const dicePossibilities = dicePossibilitiesLookup[TOTAL_DICE - storedDice.length];
  dicePossibilities.forEach(({ dice, count }) => {
    const newMultiplier = multiplier * count;
    const newStoredDice = action(storedDice, dice);
    if (newStoredDice.length < TOTAL_DICE) {
      runEveryGame(newStoredDice, newMultiplier, action);
    } else {
      scoreFrequency[calculateScore(newStoredDice)] += newMultiplier;
      numPossibilities += 1;
    }

    if (!storedDice.length) {
      progress += 1 / dicePossibilities.length;
      console.log(`${Math.round(progress * 10000) / 100}% complete...`);
    }
  });
}

function simulate(action) {
  const startTime = performance.now();
  runEveryGame([], 1, action);
  const endTime = performance.now();

  // Calculate number of games
  const numGames = Object.values(scoreFrequency).reduce((acc, games) => acc + games, 0);

  // Log final data
  console.log('------------------------------------------');
  Object.keys(scoreFrequency).forEach((score) => {
    const scoreText = (score === '24') ? 'Midnight' : score;
    const gamesForScore = scoreFrequency[score];
    const percGamesForScore = Math.ceil(1000 * gamesForScore / numGames) / 10;
    console.log(`${scoreText}: ${gamesForScore.toLocaleString()} (${percGamesForScore}%)`);
  });
  console.log('------------------------------------------');
  console.log(`Out of ${formatLargeNumber(numGames)} games, there were ${formatLargeNumber(numPossibilities)} unique games evaluated in ${formatTime(endTime - startTime)}!`);
}

/* ---------------------------------------------------- */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('');
console.log('List of available strategies:');
strategies.forEach((strategy, index) => {
  console.log(`${index + 1}: ${strategy.name}`);
});

rl.question('\nPick a strategy (1): ', (strategyNum) => {
  let strategyIndex = strategyNum - 1;
  if (strategyIndex < 0 || strategyIndex >= strategies.length) strategyIndex = 0;
  simulate(strategies[strategyIndex].action);

  rl.close();
});
