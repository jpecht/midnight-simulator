const QUALIFIERS = [1, 4];

/**
 * Strategy: Hold 1, 4 immediately. Hold all 6s. Re-roll everything else.
 */
function takeActionMidnightStrategy(storedDice, rolledDice) {
  const stored = storedDice.slice(0);
  const rolled = rolledDice.slice(0);
  const numRolled = rolled.length;

  // Take out qualifiers
  QUALIFIERS.forEach((qualifier) => {
    if (!stored.includes(qualifier)) {
      let qualifierIndex = rolled.indexOf(qualifier);
      if (qualifierIndex > -1) {
        stored.push(qualifier);
        rolled.splice(qualifierIndex, 1);
      }
    }
  });

  // Take out 6s
  let sixIndex = rolled.indexOf(6);
  while (sixIndex > -1) {
    stored.push(6);
    rolled.splice(sixIndex, 1);
    sixIndex = rolled.indexOf(6);
  }

  // Take out at least 1 dice
  if (rolled.length === numRolled) {
    // Don't bother splicing max number out to save operation time
    stored.push(Math.max(...rolled));
  }

  return stored;
}

module.exports = [
  {
    name: 'Midnight Exclusive',
    action: takeActionMidnightStrategy,
  },
];
