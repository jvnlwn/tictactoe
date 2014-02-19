# tictactoe
===========

### Overview

The computer will "learn" to play tictactoe against a human opponent based on how the person plays. The person begins the game. If he/she wins, the sequence is recorded as a winning sequence for the first player. If he/she loses, the sequence is recorded as a winning sequence for the second player. When a draw is recorded, the player order is not considered. The computer will use these sequences to make the best educated moves.

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

1. ###### Can It Win?
The computer will win if when has 2 in a row.

2. ###### Can It Block a Win?
The computer will block when its opponent has 2 in a row.

3. ###### Can It Pursue a Win?
The computer will look for any winning and losing sequences that match the current sequence. If it finds both winning and losing sequences that match the current sequence, it will compare the winning and losing sequences. It compares the next move in these sequences looking for an exact match. If an exact match is found, it must compare the success score of the sequence progression. (i.e. winning sequence [1,2,3, . . .] has a success of [3,1,1] and losing sequence [1,2,3, . . .] has a success of [3,2,2]. The matching next move is 3 and the success is 1 > 2 ? FALSE. The winning sequence is less succesful and must be passed over.) There is an extra comparison in case of a tie that isn't worth mentioning.
In the event that only winning sequences are found, the computer simply chooses the next move in the best winning sequence.

4. ###### Can It Pursue a Draw?
The computer will look for any drawing and losing sequences that match the current sequence. If it finds both drawing and losing sequences, the computer follows the same logic that it would for pursuing a win. If only drawing sequences match the current sequence, the computer simply chooses the next move in the best drawing sequence.

5. ###### Can It Avoid a Loss?
The computer has no acceptable winning or drawing sequences and must attempt to avoid losing the game if possible. The computer will look for any losing sequences that match the current sequence. If matches are found, all the squares that are potential next moves in these sequences will be avoided.

6. ###### Random Choice.
The computer has no alternative other than to choose randomly from the available squares.

### Success of a Sequence
Each sequence has a success array that keeps track of the success of every point in the sequence. A sequence and its corresponding success array migth look like this:

	sequence: [1, 4, 3, 2, 9, 5, 6]
	success:  [2, 1, 1, 1, 1, 1, 1]

This sequence has only occured fully once, but the first move in the sequence has led to a successful outcome twice.

### Handling Rotation
As alluded to before, the tictactoe board can be rotated 90, 180, and 270 degrees and look the same as it did before being rotated. I stumbled upon a nice way to correlate the rotation of the board. I decided a normally rotated board (not rotated) would be represented by the array `[1, 2, 3, 4, 5, 6, 7, 8, 9]`. Each number corresponds to a square on the board:

	1 2 3
	4 5 6
	7 8 9
	
Rotate that 90, 180, and 270 degrees and you get:

	7 4 1   9 8 7    3 6 9
	8 5 2   6 5 4    2 5 8
	9 6 3   3 2 1    1 4 7
	
And now you can see how the rotations relate to each other:

	0   -> [1, 2, 3, 4, 5, 6, 7, 8, 9]
	90  -> [3, 6, 9, 2, 5, 8, 1, 4, 7]
	180 -> [9, 8, 7, 6, 5, 4, 3, 2, 1]
	270 -> [7, 4, 1, 8, 5, 2, 9, 6, 3]
	
When the board is not rotated, square 1 corresponds to square 1. When the board is rotated 90 degrees, square 1 corresponds to square 1 and so on.

So, the sequence `[1, 4, 3, 2, 9, 5, 6]`, can be rotated to get 3 other sequences:

	0   -> [1, 4, 3, 2, 9, 5, 6]	
	90  -> [3, 2, 9, 6, 7, 5, 8]
	180 -> [9, 6, 7, 8, 1, 5, 4]
	270 -> [7, 8, 1, 4, 3, 5, 2]
	
### Handling Orientation
Rotating a sequence is quite benefitial since doing so produces 3 more sequences. Orienting (or mirroring) a sequence is just has benefitial. 

Handling the orientation proves to be an even trickier task than handling the rotation though. First, we must contemplate the idea that the board mirrors itself in two ways:

1. Based on the corner.

		0 1 2
		1 5 3
		2 3 4

2. Based on the side.

		1 0 1
		2 5 2
		3 4 3

We see that how the board mirrors itself is based on the first square in the sequence. Now we need a way to correlate these mirrored squares where `orientation` stands for the first square in the sequence and `square` is the square we want to orient/mirror. Note that we assume a normal rotation:

	var corner = {
		input:  [1,2,3,4,5,6,7,8,9],
		output: [1,4,7,2,5,8,3,6,9]
	}

	var side = {
		input:  [1,2,3,4,5,6,7,8,9],
		output: [3,2,1,6,5,4,9,8,7]
	}
	
	// corner orientation. assumes normal rotation
	if (orientation === 1) {
		return corner.output[square - 1];
	}

	// side orientation. assumes normal rotation
	if (orientation === 2) {
		return side.output[square - 1];
	}
	
If the first square is 5, the second square in the sequence is used as the value for `orientation`.

So, practically speaking, a sequence that begins `[1, 2 . . .]` can be mirrored and will produce `[1, 4 . . .]`. Check it out:

		0 1 2    1 2 3    2 === 4
		1 5 3	 4 5 6
		2 3 4	 7 8 9
	

Orienting is used when comparing two sequences that have been rotated to the normal rotation but just aren't quite the same, as in the above example. If sequence `[1, 2, 7, 4, 9, 5, 8]` can be oriented to match sequence `[1, 4, 3, 2, 9, 5, 6]` then the two sequences are considered equal.

	1 -> 1 === 1
	2 -> 4 === 4
	7 -> 3 === 3
	4 -> 2 === 2
	9 -> 9 === 9
	5 -> 5 === 5
	8 -> 6 === 6
	

### Recording a Sequence
At the end of every game the sequence of moves is recorded. The secret is that only that sequence is recorded and not it's 3 extra rotations and 4 extra orientations. The sequence is simply rotated to the normal rotation and pushed into the appropriate list based on the outcome of the game.

### Finding a Match
Finding a match is always a comparison of the current sequence against those sequences that have already been recorded from the preceding games. Since all sequences are rotated to the normal position before being recorded, the current sequence is simply rotated to the normal position when passed to the matching function. During the matching process, the sequence is oriented if necessary.
