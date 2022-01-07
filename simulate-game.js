const readline = require('readline');

const helpers = require('./helpers');
const strategies = require('./strategies');

const QUALIFIERS = [1, 4];

function simulateGame(action) {
  let storedDice = [];
  while (storedDice.length < 6) {
    const rolledDice = rollDice(6 - storedDice.length);
    console.log(`rolled: ${rolledDice.toString()}`);
    console.log(`stored: ${storedDice}`);
    console.log('-------------------------------');
    storedDice = action(storedDice, rolledDice);
  }

  const finalScore = helpers.calculateScore(storedDice);
  console.log(`${finalScore}: ${storedDice}`);
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

console.log('');
console.log('List of available strategies:');
strategies.forEach((strategy, index) => {
  console.log(`${index + 1}: ${strategy.name}`);
});

function promptSimulation() {
  rl.question('\nPick a strategy (1): ', (strategyNum) => {
    let strategyIndex = strategyNum - 1;
    if (strategyIndex < 0 || strategyIndex >= strategies.length) strategyIndex = 0;
    simulateGame(strategies[strategyIndex].action);
    promptSimulation();
  });
}

promptSimulation();
