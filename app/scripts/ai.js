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
		return processSquares(orientMactches(processMatches(matchesWins)));
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
		return processSquares(orientMactches(processMatches(matchesDraws)))
	}

	// if losing sequences still present, avoid these squares
	if (matchesLoss.length > 0) {
		console.log('we are avoiding a loser')

		// var squares = processMatches(matchesLoss)
		var squares = orientMactches(processMatches(matchesLoss))

		// excludes the unsafe squares that are still empty and lets ai choose randomly from the resulting list of safe squares
		return aiRandom(_.difference(tic.emptySquares.checkEmpty(), convertSequence(squares), false))
	}

	// no matches, empty array
	return false;

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

// compares a winning or drawing sequence to all current losing sequences.
function compareMatches(matchesFirst, matchesSecond, length, index) {

	if (index >= matchesFirst.length) {
		return false;
	}

	var match = findMatch(matchesSecond, matchesFirst[index].sequence, 0, [], length + 1)

	// found a match?
	if (match.length > 0) {
		console.log('some evil is afoot:  ', matchesFirst[index].sequence[length] + ' same as ' + match[0].sequence[length])
		console.log('compare the success: ', matchesFirst[index].success[length] + ' same as ' + match[0].success[length])
		// compare the success of the two sequences. If not not greater, but even, compare the forces of the two sequences
		if (matchesFirst[index].success[length] > match[0].success[length] || ((matchesFirst[index].success[length] === match[0].success[length]) && (matchesFirst[index].forced > match[0].forced))) {
		// if (matchesFirst[index].forced > match[0].forced) {
			console.log('force is strong in this one: ', matchesFirst[index].forced + ' vs '+ match[0].forced)
			return true;
		} else {
			// still weak, check next sequence if there is one
			console.log('weak sauce: ', matchesFirst[index].forced + ' vs '+ match[0].forced)
			return compareMatches(matchesFirst, matchesSecond, length, index + 1);
		}

	} else {
		console.log('no evil here')
		return true;
	}

}

// take a set of matches (i.e. wins or draws -- NOT loss) and filter out the weaker matches
function processMatches(matches) {
	// get equally strong sequences to choose randomly from
	matches = _.filter(matches, function(match) {
		return (match.forced === matches[0].forced)  && (match.frequency >= matches[0].frequency);
	})

}

// determine which squares to process based on the chosen orientation
function orientMactches(matches) {
	var squares = [];
	console.log('matches after filter: ', matches)

	_.each(matches, function(match) {
		var index = tic.turn.check()
		var square = match.sequence[index]

		// squares.push(handleOrientaion(match.sequence[0], square))
		console.log('oriented mirror: ', match.oriented.mirror)
		console.log('oriented normal: ', match.oriented.normal)
		console.log('index at:    ', index)

		// if match.oriented.mirror is less than 10, the orientation for the rest of current game is a mirror of the matching sequence being looped over here (i.e. match)
		// if match.oriented.normal is less than 10, the orientation for the rest of current game is simply the matching sequence being looped over here, no orientation required (i.e. match)

		// if this sequence has been oriented(mirrored) during this game, it must be oriented the rest of the game to maintain a true orientation.
		// otherwise, once the current sequence has "passed the point of no return"--meaning the opportunity to mirror any matching sequence has passed--the current sequence may only match normally oriented sequences (which essentially means a sequence that isn't oriented)

		// in this case, an orientation has not been set yet. Therefore, supply AI with both the normal and mirror orientations to choose from
		if (match.oriented.mirror > index && match.oriented.normal > index) {
			console.log('this is when we allow for orientation swap')
			squares.push(handleOrientaion(match.sequence[0], square), square)

			// this means orientation has been set to mirror and therefore all AI choices must be oriented as a mirror of the matching sequence
		} else if (match.oriented.mirror < index) {
			console.log('orientation is permanently mirror')
			squares.push(handleOrientaion(match.sequence[0], square))

			// this means orientation is not set to mirror but set to normal and all AI choices must be oriented normally, as they appear in the matching sequence
		} else {
			squares.push(square)
		}

		console.log('square(s) to choose from: ', convertSequence(_.uniq(squares), false))
	})

	return _.uniq(squares);
}

// meant for processing wins and draws.
function processSquares(squares) {
	console.log('squares after push: ', squares)

	// check for first move
	if (tic.turn.check() === 0) {
		console.log('first move', squareType(aiRandom(squares)))
		// choosing random square from squares, get squareType of square(corner/side/middle), choose random corner/side/middle . . of course there is no random middle . .
		return aiRandom(squareType(aiRandom(squares)));
	}

	console.log('squares after orientation: ', squares)

	// intersects the related square(s) with the currently empty squares to find the availabe winning squares and lets ai choose randomly from that list.
	return aiRandom(_.intersection(tic.emptySquares.checkEmpty(), convertSequence(squares, false)))
}
