# tictactoe
===========

### Overview

The computer will "learn" to play tictactoe against a human opponent based on how the person plays. If the person wins, the sequence will be recorded as a winning sequence. The computer will then attempt to use this sequence against the person to win the game. A loss is recorded as a losing sequence, and these will be avoided by the computer. If the computer cannot find a winning sequence, the computer will choose a random square that is not found in a losing sequence and/or is found in a drawing sequence.

The computer's learning ability will be sped up by matching related sequences. By related, I mean, exact replications that only differ by rotation or orientation. A top corner square is the same as a bottom corner square. A sequence that begins in a corner square can be initialized in any of the four corners. So, when the computer learns a winning sequence that begins in a corner square, it has now learned 4 winning sequences that are rotationally related and also 4 winning sequences that are orientationally related, since one side of the board is nearly an exact mirror of the other side.

The computer will also be blessed with the abilities to win and block. Win if possible by makeing two in a row, three. Block if possible by thwarting person's looming three in a row.

Eventually the computer will become unbeatable.
