# tictactoe
===========

### Overview

The computer will "learn" to play tictactoe against a human opponent based on how the person plays. The person begins the game. If he/she wins, the sequence is recorded as a winning sequence for the first player. If he/she loses, the sequence is recorded as a winning sequence for the second player. When a draw is recorded, the player order is not considered. 

The computer will choose a square based on this lazy progression:

1. Can it win?
2. Can it block a win?
3. Can it pursue a win?
4. Can it purse a draw?
5. Can it avoid a loss?
6. Random choice.

The computer's learning ability will be sped up by matching related sequences. By related, I mean, exact replications that only differ by rotation or orientation. A top corner square is the same as a bottom corner square. A sequence that begins in a corner square can be initialized in any of the four corners. So, when the computer learns a winning sequence that begins in a corner square, it has now learned 4 winning sequences that are rotationally related and also 4 winning sequences that are orientationally related, since one side of the board is nearly an exact mirror of the other side.

The computer will also be blessed with the abilities to win and block. Win if possible by makeing two in a row, three. Block if possible by thwarting person's looming three in a row.

Eventually the computer will become unbeatable.

### The Lazy Progression
The computer will perform the first action in this list that is possible.

1. ######Can It Win?
The computer will win if when has 2 in a row.
2. ######Can It Block a Win?
The computer will block when its opponent has 2 in a row.
3. ######Can It Pursue a Win?
The computer will look for any winning and losing sequences that match the current sequence. If it finds both winning and losing sequences that match the current sequence, it will compare the winning and losing sequences. It compares the next move in these sequences looking for an exact match. If an exact match is found, it must compare the success score of the sequence progression. (i.e. winning sequence [1,2,3, . . .] has a success of [3,1,1] and losing sequence [1,2,3, . . .] has a success of [3,2,2]. The matching next move is 3 and the success is 1 > 2 ? FALSE. The winning sequence is less succesful and must be passed over.) There is an extra comparison in case of a tie that isn't worth mentioning.
In the event that only winning sequences are found, the computer simply chooses the next move in the best winning sequence.

4. ######Can It Pursue a Draw?
The computer will look for any drawing and losing sequences that match the current sequence. If it finds both drawing and losing sequences, the computer follows the same logic that it would for pursuing a win. If only drawing sequences match the current sequence, the computer simply chooses the next move in the best drawing sequence.

5. ######Can It Avoid a Loss?
The computer has no acceptable winning or drawing sequences and must attempt to avoid losing the game if possible. The computer will look for any losing sequences that match the current sequence. If matches are found, all the squares that are potential next moves in these sequences will be avoided.

6. ######Random Choice.
The computer has no alternative other than to choose randomly from the available squares.
