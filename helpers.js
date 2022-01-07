const FACTORIAL_VALUES = {
  1: 1,
  2: 2,
  3: 6,
  4: 24,
  5: 120,
  6: 720,
};

/**
 * Returns the number of possible permutations given a set of dice values
 * @param {Array} dice - A set of dice values, e.g. [1, 5, 2, 4, 2]
 * @return {Number} The number of possible permutations
 */
function getPermutations(dice) {
  // Find the number of counts of each dice
  const frequencies = {};
  dice.forEach((die) => {
    if (!frequencies[die]) frequencies[die] = 0;
    frequencies[die] += 1;
  });

  // Calculate number of permutations
  let permutations = FACTORIAL_VALUES[dice.length];
  Object.values(frequencies).forEach((frequency) => {
    permutations /= FACTORIAL_VALUES[frequency];
  });
  return permutations;
}

/**
 * This returns an array of all possible dice combinations for a given number of dice
 * @param {Number} numDice - The number of dice to provide combinations for
 * @return {Array} An array of objects, e.g. { dice: [1, 2], count: 2 }
 */
function getPossibilitySet(numDice) {
  const possibilities = [];
  const total = Math.pow(6, numDice);

  // Initialize dice set; Push initial set
  const dice = [];
  for (let i = 0; i < numDice; i += 1) {
    dice.push(1);
  }
  possibilities.push({ dice: dice.slice(0), percentage: 1 / total });

  /**
   * Loop through all unique dice combinations
   * 1, 1, 1 => 2, 1, 1
   * 6, 1, 1 => 2, 2, 1
   * 6, 3, 1 => 4, 4, 1
   * 6, 6, 1 => 2, 2, 2
   */
  do {
    const firstNonSixIndex = dice.findIndex(d => d !== 6);
    dice[firstNonSixIndex] += 1;
    for (let i = 0; i < firstNonSixIndex; i += 1) {
      dice[i] = dice[firstNonSixIndex];
    }
    possibilities.push({
      dice: dice.slice(0),
      percentage: getPermutations(dice) / total,
    });
  } while (dice.find(d => d !== 6));

  return possibilities;
}

module.exports = {
  /**
   * Calculates the final score given an array of dice
   * e.g. [1, 4, 6, 5, 4, 4] => 19
   * e.g. [1, 6, 6, 6, 6, 6] => 0
   * @param {Array} dice - An array of dice values
   * @return {Number} The total score
   */
  calculateScore: (dice) => {
    if (!dice.includes(1) || !dice.includes(4)) return 0;
    return dice.reduce((acc, die) => acc + die, -5);
  },

  formatLargeNumber: (num) => {
    if (num > 1e12) return `${Math.ceil(num / 1e11)/ 10} trillion`;
    if (num > 1e9) return `${Math.ceil(num / 1e8) / 10} billion`;
    if (num > 1e6) return `${Math.ceil(num / 1e5) / 10} million`;
    return num.toLocaleString();
  },

  formatTime: (ms) => {
    if (ms > 3600000) return `${Math.ceil(ms / 360000) / 10} hr`;
    if (ms > 60000) return `${Math.ceil(ms / 6000) / 10} min`;
    if (ms > 1000) return `${Math.ceil(ms / 100) / 10} s`;
    return `${Math.ceil(ms)} ms`;
  },

  /**
   * Calculates all possible dice combinations for all number of dice from 1 to 6
   * @return {Object} An object with key as number of dice and value as combinations
   */
  getPossibilitySets: () => {
    const sets = [];
    for (i = 1; i <= 6; i += 1) {
      sets[i] = getPossibilitySet(i);
    }
    return sets;
  },
};
