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
let numGames = 0;
let progress = 0;

/**
 * Runs through EVERY game possibility
 */
function runEveryGame(storedDice = [], percentageCombined, action) {
  const dicePossibilities = dicePossibilitiesLookup[TOTAL_DICE - storedDice.length];
  dicePossibilities.forEach(({ dice, percentage }) => {
    const newPercentage = percentageCombined * percentage;
    const newStoredDice = action(storedDice, dice);
    if (newStoredDice.length < TOTAL_DICE) {
      runEveryGame(newStoredDice, newPercentage, action);
    } else {
      // End of a run
      scoreFrequency[calculateScore(newStoredDice)] += newPercentage;
      numGames += 1;
    }

    // Solely to keep track of progress
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
  const sumPerc = Object.values(scoreFrequency).reduce((acc, games) => acc + games, 0);
  console.log(`This should be close to 1: ${sumPerc}`);

  // Log final data
  console.log('------------------------------------------');
  Object.keys(scoreFrequency).forEach((score) => {
    const scoreText = (score === '24') ? 'Midnight' : score;
    const percGamesForScore = Math.ceil(1e5 * scoreFrequency[score]) / 1e3;
    console.log(`${scoreText}: ${percGamesForScore}%`);
  });
  console.log('------------------------------------------');
  console.log(`There were ${formatLargeNumber(numGames)} unique games evaluated in ${formatTime(endTime - startTime)}!`);
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
