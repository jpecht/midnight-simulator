const QUALIFIERS = [1, 4];

/* ------------------- Actions ------------------ */
function takeAllOfNumber(stored, rolled, num, maxTaken) {
  for (let i = 0; i < maxTaken; i++) {
    const index = rolled.indexOf(num);
    if (index === -1) break;
    stored.push(num);
    rolled.splice(index, 1);
  }
}

function takeAllQualifiers(stored, rolled) {
  let numQualifiersNeeded = 2;
  QUALIFIERS.forEach((qualifier) => {
    let hasQualifier = stored.includes(qualifier);
    if (!hasQualifier) {
      let qualifierIndex = rolled.indexOf(qualifier);
      if (qualifierIndex > -1) {
        stored.push(qualifier);
        rolled.splice(qualifierIndex, 1);
      }
      hasQualifier = true;
    }
    numQualifiersNeeded -= hasQualifier;
  });
  return numQualifiersNeeded;
}

/* ------------------- Strategies ------------------ */
/**
 * Strategy: Hold 1, 4 immediately. Hold all 6s. Re-roll everything else.
 * Slight flaw, need both qualifiers: roll [1, 5, 6] => take [1, 6].
 * In reality, would only want to take [1]
 */
function takeActionMidnightStrategy(storedDice, rolledDice) {
  const stored = storedDice.slice(0);
  const rolled = rolledDice.slice(0);
  const numRolled = rolled.length;

  const numQualifiersNeeded = takeAllQualifiers(stored, rolled);
  takeAllOfNumber(stored, rolled, 6, rolled.length - numQualifiersNeeded);

  // Take out at least 1 dice
  if (rolled.length === numRolled) {
    // Don't bother splicing max number out to save operation time
    stored.push(Math.max(...rolled));
  }

  return stored;
}

/**
 * Strategy: Hold 1, 4 immediately. Hold all 5s and 6s. Re-roll everything else.
 */
function takeActionFives(storedDice, rolledDice) {
  const stored = storedDice.slice(0);
  const rolled = rolledDice.slice(0);
  const numRolled = rolled.length;

  const numQualifiersNeeded = takeAllQualifiers(stored, rolled);
  takeAllOfNumber(stored, rolled, 6, rolled.length - numQualifiersNeeded);
  takeAllOfNumber(stored, rolled, 5, rolled.length - numQualifiersNeeded);

  // Take out at least 1 dice
  if (rolled.length === numRolled) {
    // Don't bother splicing max number out to save operation time
    stored.push(Math.max(...rolled));
  }

  return stored;  
}

/**
 * Strategy: Hold one qualifier if both are rolled on first roll. Hold all 6s. Re-roll everything else.
 * e.g. roll [1, 4, 6, 2, 2, 2] => take [1, 6]
 * e.g. roll [1, 4, 6, 2, 2] => take [1, 4, 6]
 */
function takeActionOneQualifier(storedDice, rolledDice) {
  const stored = storedDice.slice(0);
  const rolled = rolledDice.slice(0);
  const numRolled = rolled.length;

  // If both qualifiers are available, may only want to take one
  if (rolled.includes(1) && rolled.includes(4)) {
    if (!stored.includes(1) && !stored.includes(4)) {
      const numSixes = rolled.reduce((acc, val) => (val === 6) ? acc + 1 : acc, 0);
      const numDiceLeftAfterTake = rolled.length - 2 - numSixes;

      // If only 2 or more dice would be left, re-roll a qualifier to save more dice to roll
      if (numDiceLeftAfterTake >= 2) {
        takeAllOfNumber(stored, rolled, 1, 1);
        takeAllOfNumber(stored, rolled, 6);
        return stored;
      }
    }
  }

  const numQualifiersNeeded = takeAllQualifiers(stored, rolled);
  takeAllOfNumber(stored, rolled, 6, rolled.length - numQualifiersNeeded);

  // Take out at least 1 dice
  if (rolled.length === numRolled) {
    // Don't bother splicing max number out to save operation time
    stored.push(Math.max(...rolled));
  }

  return stored;  
}

module.exports = [
  {
    name: 'Hold Sixes',
    action: takeActionMidnightStrategy,
  }, {
    name: 'Hold Fives and Sixes',
    action: takeActionFives,
  }, {
    name: 'Hold Sixes, Take Only One Qualifier Sometimes',
    action: takeActionOneQualifier,
  }
];
