// global variable tic
var tic = setup();

// sets permanent and changing properties for tic
function setup() {
	return {

		// all properties in object returned from newGame must be reset upon each new game
		newGame: function() {
			return {
				emptySquares:  emptySquares(),
				turn:          incrementInt(),
				forced:        incrementInt(),
				sequence:      currentSequence(),
				rotation:      rotation(initiateRotation),
				x:             recordTakenSquares(),
				o:             recordTakenSquares(),
				// aiFPSequences: tic.firstPlayerWins.check('wins'),
				// aiSPSequences: tic.secondPlayerWins.check('wins'),
				gameOver:      false
			}
		},

		// all other properties must not be reset
		setsOfThree:           [[1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [4,5,6], [7,8,9]],
		player:                playerOrder(),
		firstPlayerWins:       allSequences(),
		secondPlayerWins:      allSequences(),
		draws:                 allSequences(),
		gamesPlayed:           incrementInt()
	}
}

// begin me them closures for setup

// to keep track of the empty squares
function emptySquares() {
	var emptySquares = [1,2,3,4,5,6,7,8,9];

	return {
		checkSquare: function(square) {
			var index = emptySquares.indexOf(square);

			if (index > -1) {
				return true;
			}
			return false;
		},

		remove: function(square) {
			var index = emptySquares.indexOf(square);
			emptySquares.splice(index, 1);
		},

		checkEmpty: function() {
			return emptySquares;
		}
 	}
}

// 
function incrementInt() {
	var incrementInt = 0;

	return {
		increment: function(amount) {
			incrementInt += amount || 1;
		},

		check: function() {
			return incrementInt;
		}
	}
}

function currentSequence() {
	var sequence = [];

	return {
		add: function(square) {
			sequence.push(square)
		},

		check: function() {
			return sequence;
		}
	}
}

function allSequences(player) {
	var sequences = [];
	var addedTo = false;

	return {
		add: function(item) {
			// keep track of which list the current sequence was added to
			addedTo = true;
			var sequence = findMatch(sequences, item, 0, [], item.length);

			if (sequence.length > 0) {
				// should only ever be one object inside sequence. All duplicate sequences have a frequency property that is incremented on each occurence
				sequence[0].frequency += 1;
			} else {
				sequences.push({
					sequence:  item,
					frequency: 1,
					forced:    tic.forced.check(),
					success:   zerosArray(tic.sequence.check()),
					overall:   zerosArray(tic.sequence.check())
				})
			}
			return this;
		},

		arrange: function() {
			sequences = sequences.sort(function(a, b) {
				return b.forced - a.forced;
			})

			return this;
		},

		success: function(sequence) {

			stats(sequences, sequence, sequence.length, 0, addedTo)
			
			addedTo = false;

			return this;
		},

		check: function() {
			return sequences;
		}
	}
}

// returns array of zeros
function zerosArray(sequence) {
	var array = [];
	for (var i = 0; i < sequence.length; i++) {
		array.push(0);
	}
	return array;
}

function playerOrder() {
	// playerOrder will be switched at the very beginning, so computer is set to first position initially
	var playerOrder = ['c', 'h']

	return {
		switchOrder: function() {
			playerOrder = playerOrder.reverse();
		},

		check: function() {
			return playerOrder[0];
		}
	}
}

// 'rotates' the board based on the first square in the sequence (unless first square is middle, then rotation is based on second square)
function rotation(pred) {
	var rotation = [];

	var rotations = [
		{
			squares:  [1,2],
			rotation: [1,2,3,4,5,6,7,8,9]
		},
		{
			squares:  [3,6],
			rotation: [3,6,9,2,5,8,1,4,7]
		},
		{
			squares:  [9,8],
			rotation: [9,8,7,6,5,4,3,2,1]
		},
		{
			squares:  [7,4],
			rotation: [7,4,1,8,5,2,9,6,3]
		}
	]

	return {
		set: function(square) {
			if (pred()) {
				rotation = _.find(rotations, function(o){return o.squares.indexOf(square) > -1}).rotation
			}

		},

		check: function() {
			return rotation;
		}
	}
}

// the pred for rotation
function initiateRotation() {
	var sequence = tic.sequence.check()
	return (sequence.length === 1 && sequence[0] !== 5) || (sequence.length === 2 && sequence[0] === 5)
}

function recordTakenSquares() {
	var takenSquares = [];

	return {
		add: function(square) {
			takenSquares.push(square)
		},

		check: function() {
			return takenSquares;
		}
	}
}