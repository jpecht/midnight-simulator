const readline = require('readline');

const helpers = require('./helpers');
const strategies = require('./strategies');

const TOTAL_DICE = 6;
const QUALIFIERS = [1, 4];

function simulateGame(action) {
  let storedDice = [];
  while (storedDice.length < TOTAL_DICE) {
    const origStoredLen = storedDice.length;
    const rolledDice = rollDice(TOTAL_DICE - storedDice.length);
    storedDice = action(storedDice, rolledDice);
  }
  return helpers.calculateScore(storedDice);
}

function rollDice(numDice) {
  const results = [];
  for (let i = 0; i < numDice; i += 1) {
    results.push(Math.ceil(6 * Math.random()));
  }
  return results;
}

/* ---------------------------------------------------- */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function promptSimulation() {
  console.log('');
  console.log('List of available strategies:');
  strategies.forEach((strategy, index) => {
    console.log(`${index + 1}: ${strategy.name}`);
  });
  rl.question('\nPick a strategy (1): ', (strategyNum) => {
    let strategyIndex = strategyNum - 1;
    if (strategyIndex < 0 || strategyIndex >= strategies.length) strategyIndex = 0;

    rl.question('\nHow many simulations? (1e6): ', (numSimulations) => {
      numSimulations = numSimulations || 1e6;

      // Count number of times a score is tallied
      const scoreFrequency = [];
      for (let i = 0; i <= 24; i += 1) {
        scoreFrequency[i] = 0;
      }

      for (i = 0; i < numSimulations; i += 1) {
        const finalScore = simulateGame(strategies[strategyIndex].action);
        scoreFrequency[finalScore] += 1;
      }

      console.log('------------------------------------------');
      Object.keys(scoreFrequency).forEach((score) => {
        const scoreText = (score === '24') ? 'Midnight' : score;
        const gamesForScore = scoreFrequency[score];
        const percGamesForScore = Math.ceil(1000 * gamesForScore / numSimulations) / 10;
        console.log(`${scoreText}: ${gamesForScore.toLocaleString()} (${percGamesForScore}%)`);
      });
      console.log('------------------------------------------');

      rl.close();
    });
  });
}

promptSimulation();
