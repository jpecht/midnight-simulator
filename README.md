# midnight-simulator
Scripts to simulate the dice game, Midnight

## Commands to run script
### Simple game simulation
This script simply runs a single randomized game of Midnight using a specified strategy chosen through a command line prompt.
```
node simulate-game.js
```

### Bulk game simulation
This script simply runs a specified number of randomized games of Midnight using a specified strategy chosen through a command line prompt.
Running a million games takes a few seconds, while running 10 million games takes about a minute.
```
node simulate-bulk.js
```

### Bruteforce
Running the bruteforce script runs through all possible combinations of the dice game using a specified strategy that is chosen through a command line prompt. Beware that there are typically 10s of billions of permutations and the simulation may take anywhere from 30 min to 2 hours to run.
```
node bruteforce.js
```
