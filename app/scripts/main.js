var tic = setup();

$(function() {
    // verifyAllThrees('x')

    // set click events for person
    huMove();

    // sets/resets data from one game to the next
    startNewGame()
});

function startNewGame() {

	var clickNewGame = function() {
		console.log('-- NEW GAME --')
		// reset all emptySquares, turn, and gameOver
		tic = $.extend(tic, tic.newGame());

		$('.square').html('');
		$('.winner').html('');

		tic.player.switchOrder();
		tic.firstPlayerWins.arrange().success();
		tic.secondPlayerWins.arrange().success();
		tic.draws.arrange().success();

		if(tic.player.check() === 'c') {
			// computer is first player, therefore starts game
			aiMove();
		}
	}

	$('.new-game').click(clickNewGame);

	clickNewGame();
}

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

	return {
		add: function(item) {
			var sequence = findMatch(sequences, item, 0, [], item.length)

			if (sequence.length > 0) {
				// should only ever be one object inside sequence. All duplicate sequences have a frequency property that is incremented on each occurence
				sequence[0].frequency += 1;
			} else {
				sequences.push({
					sequence:  item,
					frequency: 1,
					// forced:    tic.turn.check() - tic.forced.check()
					// forced:     tic.forced.check() / tic.turn.check()
					forced:     tic.forced.check()
				})
			}
		},

		arrange: function() {
			sequences = sequences.sort(function(a, b) {
				return b.forced - a.forced;
			})

			return this;
		},

		success: function() {
			_.each(sequences, function(sequence) {
				sequence.success = sequence.frequency / tic.gamesPlayed.check();
			});

			return this;
		},

		check: function() {
			return sequences;
		}
	}
}

function findMatch(list, sequence, index, current, length) {

	if (sequence.length === 0 || list.length === 0) {
		return list;
	}

	if (index >= length) {
		return list;
	}

	_.each(list, function(item) {
		// console.log('exact:    ',item.sequence[index] + ' ' + sequence[index])
		// console.log('oriented: ',handleOrientaion(item.sequence[0], item.sequence[index]) + ' ' + sequence[index])
		// if sequences aren't exactly the same, maybe they are a mirror of eachother -> check for orientation
		if (item.sequence[index] === sequence[index] || handleOrientaion(item.sequence[0], item.sequence[index]) === sequence[index]) {

			current.push(item)
		}
	})

	return findMatch(current, sequence, index + 1, [], length)
}

function handleOrientaion(orientation, square) {
	var indexFirst;
	var indexSecond;

	// if 5 is first, may need to check for that

	var corner = {
		first:  [1,2,3,5,6,9],
		second: [1,4,7,5,8,9]
	}

	var side = {
		first:  [1,2,4,5,7,8],
		second: [3,2,6,5,9,8]
	}

	// corner orientation
	if ([1,3,7,9].indexOf(orientation) > -1) {
		return returnRelated(corner)
	}

	if ([2,4,6,8].indexOf(orientation) > -1) {
		return returnRelated(side)
	}

	function returnRelated(o) {
		indexFirst  = o.first.indexOf(square)
		indexSecond = o.second.indexOf(square)
		return indexFirst > -1 ? o.second[indexFirst] : o.first[indexSecond];
	}
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

// end me them closures
// end
// end
// end

// begin Human functionality

function huMove() {

	$('.square').click(function() {	

		var square = parseInt($(this).attr('id'));

		if (tic.emptySquares.checkSquare(square) && !tic.gameOver) {

			processMove(square, 'x');

			// if game isn't over, have computer move
			if (!tic.gameOver) {
				aiMove();
			}
		}
	})
}

// end Human functionality
// end
// end
// end

// begin AI functionality

function aiMove() {
	var forced = forcedMove('o').concat(forcedMove('x'))

	// console.log('FORCED = ', forced)

	// if forced contains any squares, if a win is forced, a winning square will be at index 0, otherwise a blocking square will be at index 0. (Win takes priority over block)
	var square = forced[0] || aiTactical() || aiRandom(tic.emptySquares.checkEmpty().slice());
	// console.log('processing: ', square)
	processMove(square, 'o');
}

// choose random square since computer cannont make intelligent move
function aiRandom(squares) {
	console.log('randomly form these squares: ', squares)
	var choice = Math.floor(Math.random() * (squares.length));
	var square = squares[choice];

	return square;
}

// a forced block or win
function forcedMove(piece) {
	var forced = [];

	_.each(tic.setsOfThree, function(set){
		var diff =  _.difference(set, tic[piece].check())
		if (diff.length === 1 && tic.emptySquares.checkEmpty().indexOf(diff[0]) > -1) {
			forced.push(diff[0])
		}
	})

	// console.log('FORCED = ', forced)
	return forced;
}

function aiTactical() {
	var matches = [];

	var wins = determineSequences().wins
	var loss = determineSequences().loss
	var draws = tic.draws.check();

	var convertedSequence = convertSequence(tic.sequence.check(), true);
	var length = tic.sequence.check().length;

	// check for matches
	matchesWins = wins.length > 0 ? findMatch(wins, convertedSequence, 0, [], length) : [];
	matchesLoss = loss.length > 0 ? findMatch(loss, convertedSequence, 0, [], length) : [];
	matchesDraws = draws.length > 0 ? findMatch(draws, convertedSequence, 0, [], length) : [];

	// are there winning and losing sequences. If so, make decision based on which sequence is more forceful
	if (matchesWins.length > 0 && matchesLoss.length > 0) {
		console.log('wins and loss sequences present');

		// if (compareMatches(matchesWins, matchesLoss, length)) {
		if (compareMatches(matchesWins, matchesLoss, length, 0)) {
			matchesLoss = [];
		} else {
			matchesWins = [];
		}
	}

	// choosing from wins
	if (matchesWins.length > 0) {
		console.log('we are choosing a winner')
		// return chooseWinOrDraw(processMatches(matchesWins, true))
		return processSquares(processMatches(matchesWins));
	}

	if (matchesDraws.length > 0 && matchesLoss.length > 0) {
		console.log('draws and loss sequences present');

		// if (compareMatches(matchesDraws, matchesLoss, length)) {
		if (compareMatches(matchesDraws, matchesLoss, length, 0)) {
			matchesLoss = [];
		} else {
			matchesDraws = [];
		}
	}

	// pursue a draw if draws are still present
	if (matchesDraws.length > 0) {
		console.log('we are pursuing a draw')

		// return chooseWinOrDraw(processMatches(matchesDraws))
		return processSquares(processMatches(matchesDraws));
	}

	// if losing sequences still present, avoid these squares
	if (matchesLoss.length > 0) {
		console.log('we are avoiding a loser')

		var squares = processMatches(matchesLoss)	

		squares = _.union(squares, _.map(squares, function(square) {
			return handleOrientaion(tic.sequence.check()[0], square)
		}))

		// excludes the unsafe squares that are still empty and lets ai choose randomly from the resulting list of safe squares
		return aiRandom(_.difference(tic.emptySquares.checkEmpty(), convertSequence(squares), false))
	}

	// no matches, empty array
	return false;

}

function compareMatches(matchesFirst, matchesSecond, length, index) {

	if (index >= matchesFirst.length) {
		return false;
	}

	var match = findMatch(matchesSecond, matchesFirst[index].sequence, 0, [], length + 1)

	if (match.length > 0) {
		console.log('some evil is afoot')
		if (matchesFirst[index].forced > match[0].forced) {
			console.log('force is strong in this one: ', matchesFirst[index].forced + ' vs '+ match[0].forced)
			return true;
		} else {
			console.log('weak sauce ', match[0].forced + ' vs '+ matchesFirst[index].forced)
			return compareMatches(matchesFirst, matchesSecond, length, index + 1);
		}

	} else {
		console.log('no evil here')
		return true;
	}

}

// take a set of matches (i.e. wins) and filter out the weaker matches and get the sequential square from each match
function processMatches(matches) {
	var squares = [];

	console.log('squares initially: ', squares)
	console.log('matches initially: ', matches)

	// get equally strong sequences to choose randomly from
	matches = _.filter(matches, function(match) {
		return (match.forced === matches[0].forced)  && (match.frequency >= matches[0].frequency);
	})

	console.log('matches after filter: ', matches)

	_.each(matches, function(match) {
		squares.push(match.sequence[tic.turn.check()])
	})

	return squares;
}

// meant for processing wins and draws.
function processSquares(squares) {
	console.log('squares after push: ', squares)

	// check for first move
	if (tic.turn.check() === 0) {
		console.log('first move', squareType(aiRandom(squares)))
		// choosing random square from squares, get squareType of square(corner/side/middle), choose random corner/side/middle
		return aiRandom(squareType(aiRandom(squares)));
	}

	squares = _.union(squares, _.map(squares, function(square) {
		return handleOrientaion(tic.sequence.check()[0], square)
	}))

	console.log('squares after orientation: ', squares)

	// intersects the related square(s) with the currently empty squares to find the availabe winning squares and lets ai choose randomly from that list.
	return aiRandom(_.intersection(tic.emptySquares.checkEmpty(), convertSequence(squares, false)))
}

function determineSequences() {
	if (tic.player.check() === 'c') {
		return {
			wins: tic.firstPlayerWins.check(),
			loss: tic.secondPlayerWins.check()		
		}
	} else {
		return {
			wins: tic.secondPlayerWins.check(),
			loss: tic.firstPlayerWins.check()	
		}
	}
}

// end AI functionality
// end
// end
// end

// processing to be performed after square is chosen by human or computer
function processMove(square, piece) {
	appendPiece('#' + square, determineTemplate(piece));
	tic.emptySquares.remove(square);
	tic.sequence.add(square);
	tic.rotation.set(square);
	tic[piece].add(square);

	gameOver(piece);

	// tic.turn.increment()
}

function oppositePiece(piece) {
	return piece === 'x' ? 'o' : 'x';
}

// game over

function gameOver(piece) {
	// a win?
	if (checkForThree(tic.setsOfThree, 0, 0, piece)) {
		tic.gameOver = true;
		tic.gamesPlayed.increment();
		$('.winner').text(piece.toUpperCase() + ' Wins!')

		// records sequence of moves as a win or draw for first or second player and converts that sequence to a normal rotation
		if (tic.turn.check() % 2 === 0) {
			return tic.firstPlayerWins.add(convertSequence(tic.sequence.check(), true))
		} else {
			return tic.secondPlayerWins.add(convertSequence(tic.sequence.check(), true))
		}
	// a draw?
	} else if (tic.emptySquares.checkEmpty().length === 0) {
		tic.gamesPlayed.increment();
		tic.gameOver = true;
		$('.winner').text('Draw!')

		return tic.draws.add(convertSequence(tic.sequence.check(), true))
	}

	tic.turn.increment();
	// determine if next move is forced. use total forced moves as a stat for comparing sequence strength. I have a reason for checking both pieces on every turn.
	var forced = forcedMove('x').concat(forcedMove('o'));
	if (forced.length > 0) {
		var amount = 9 / tic.turn.check()
		tic.forced.increment(amount);
	}
}

// game over ^^

function checkForThree(allSets, set, order, piece) {

	if (order === 3) {
		// console.log('MATCH')
		return true;
	}

	if (set >= allSets.length) {
		// console.log('NO GOOD')
		return false;
	}

	var square = allSets[set][order]

	if ($('#' + square).children().hasClass(piece)) {
		// console.log('match',set,order)
		return checkForThree(allSets, set, order + 1, piece)
	} else {
		return checkForThree(allSets, set + 1, 0, piece)
	}
}

// takes a sequence and rotates it. Direction can be true or false. True for converting current sequence to standard rotation. False for converting standard-rotated sequence to current rotation.
function convertSequence(sequence, direction) {
	var conversion = [];

	_.each(sequence, function(square) {
		conversion.push(direction ? tic.rotation.check().indexOf(square) + 1 : tic.rotation.check()[square - 1])
	})
	return conversion;
}

function squareType(square) {
	var corners = [1,3,7,9];
	var sides = [2,4,6,8]
	
	if (corners.indexOf(square) > -1) {
		return corners;
	}
	if (sides.indexOf(square) > -1) {
		return sides;
	}
	return [5];
}

// functions just for checking tic.setsOfThree array -> example:
// var bumpSet = runEachSet(tic.setsOfThree, displaySet)
// bumpSet('o')

function verifyAllThrees(piece) {
	var bumpSet = runEachSet(tic.setsOfThree, displaySet);

	setInterval(function() {
    	bumpSet(piece)
    	checkForThree(tic.setsOfThree, 0, 0, piece)
    },1500)
}

function runEachSet(allSets, fun) {
	var i = 0;

	return function(piece) {
		i = i < allSets.length ? i : 0;

		$('.square').html('');

		fun(allSets[i], piece)
		i++;
	}
}

function displaySet(set, piece) {
	set.forEach(function(square) {
		var target = '#' + square;
		var template = determineTemplate(piece)
		appendPiece(target, template)
	})
}

function determineTemplate(piece) {
	return _.template($('#' + piece).text());
}

function appendPiece(target, template) {
	$(target).append(template)
}






