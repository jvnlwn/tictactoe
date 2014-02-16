// AI makes best move possible
function aiMove() {
	// if forced contains any squares, if a win is forced, a winning square will be at index 0, otherwise a blocking square will be at index 0. (Win takes priority over block)
	var forced = forcedMove('o').concat(forcedMove('x'))
	// lazily choosing square
	var square = forced[0] || aiTactical() || aiRandom(tic.emptySquares.check().slice());
	// processing the chosen square
	processMove(square, 'o');
}

// choose random square from the available squares provided
function aiRandom(squares) {
	console.log('randomly form these squares: ', squares)
	// choosing a random index from the squares array
	var index = Math.floor(Math.random() * (squares.length));
	// getting the square from the squares array based on the random index
	var square = squares[index];

	return square;
}

// a forced block or win. A forced win if piece is current player, otherwise a forced block
function forcedMove(piece) {
	var forced = [];

	// looping over each possible set of three
	_.each(tic.setsOfThree, function(set){
		// getting the difference between the set and the players occupied squares
		var diff =  _.difference(set, tic[piece].check())
		// if the difference is one square and that square is empty . .
		if (diff.length === 1 && tic.emptySquares.check().indexOf(diff[0]) > -1) {
			// . . then add square to forced array
			forced.push(diff[0])
		}
	})

	return forced;
}

// AI searches for a winning, drawing, or losing sequence that matches the current sequence
function aiTactical() {
	// convert current sequence to the normal rotation ([1,2,3,4,5,6,7,8,9])
	var convertedSequence = rotateSequence(tic.sequence.check(), true);

	// check for matches, if none are found [] will be set as return value
	var wins  = findMatch(determineSequences().wins, convertedSequence);
	var loss  = findMatch(determineSequences().loss, convertedSequence);
	var draws = findMatch(tic.draws.check(), convertedSequence);

	// lazily returning a winning square, drawing square, safe square, or undefined
	return proVersesAnti(wins, loss) || proVersesAnti(draws, loss) || anti(loss);
}

// ========================
// 		WINS && DRAWS
// ========================
// are there pro and anti sequences. If so, make decision based on which sequence is more successful
function proVersesAnti(proMatches, antiMatches) {
	if (proMatches.length > 0 && antiMatches.length > 0) {
		// comparse proMatches matches to losing matches. If the sequences match, compares the success of the sequences. If proMatches sequence has more success, returns true; if even, compares force and returns true if proMatch is stronger; else checks next proMatches sequence. No proMatches sequence works? Returns empty array.
		proMatches = compareMatches(proMatches, antiMatches, tic.sequence.check().length)
	}
	// if no antiMatches, then simply return proMatches
	if (proMatches.length > 0) {
		// filterMatches discards weaker matches. orientMatches orients squares appropriately. processSquares chooses randomly from the appropriate squares.
		return processSquares(orientMactches(filterMatches(proMatches)));
	}
	// otherwise returns undefined
}

// ========================
// 			LOSS
// ========================
// if losing sequences present, avoid these squares
function anti(loss) {
	if (loss.length > 0) {
		console.log('we are avoiding a loser')
		// retrieves the appropriate squares from the matching sequences and/or their mirrored counterparts depending on the matching sequences' orientations
		var squares = orientMactches(loss);
		// rotate the squares
		var convertedSquares = rotateSequence(squares, false)

		// check if all possible moves are considered bad. Drop last one if so(which means AI will choose that square, since it is the weakest threat)--last square in squares is weakest and if any repeat squares appear, the repeats closest to the end of array will be removed, meaning that if the same square in a weaker sequence matches the same square in a stronger sequence, the weaker will be excluded from array leaving the stronger square in it's (strong) postion near front of array.(this exclusion happens _.uniq(squares) in orientMatches) Comprende?	
		// remove the squares from the empty squares to give AI the list of 'safe' squares
		if (_.difference(tic.emptySquares.check(), convertedSquares).length === 0) {
			// no safe squares, so drop the last square
			convertedSquares.pop();
		}

		// excludes the unsafe squares that are still empty and lets ai choose randomly from the resulting list of safe squares
		return aiRandom(_.difference(tic.emptySquares.check(), convertedSquares))
	}
	// otherwise returns undefined
}

// ========================
// 	   COMPARE MATCHES
// ========================
// compare proMatches and antiMatches to determine whether or not proMatches contains a more successful/strong sequence
function compareMatches(proMatches, antiMatches, length) {

	// no proMatches work
	if (proMatches.length === 0) {
		// proMatches is an empty array
		return proMatches;
	}

	// find all sequences in antiMatches that are same as the current sequence from proMatches being checked.
	var matches = findMatch(antiMatches, _.first(proMatches).sequence, 0, [], length + 1)

	// found a matching sequences in antiMatches?
	if (matches.length > 0) {
		console.log('some evil is afoot:  ', _.first(proMatches).sequence[length] + ' same as ' + matches[0].sequence[length])
		console.log('compare the success: ', _.first(proMatches).success[length] + ' same as ' + matches[0].success[length])
		// compare the success of the two sequences. If not not greater, but even, compare the forces of the two sequences
		if (_.first(proMatches).success[length] > matches[0].success[length] || ((_.first(proMatches).success[length] === matches[0].success[length]) && (_.first(proMatches).forced > matches[0].forced))) {
			console.log('force is strong in this one: ', _.first(proMatches).forced + ' vs '+ matches[0].forced)
			return proMatches;
		} else {
			// still weak, check next sequence if there is one
			console.log('weak sauce: ', _.first(proMatches).forced + ' vs '+ matches[0].forced)
			return compareMatches(_.rest(proMatches), antiMatches, length);
		}

	} else {
		console.log('no evil here')
		// no antiMatches sequences found that match proMatches sequence
		return proMatches;
	}
}

// take a set of matches (i.e. wins or draws -- NOT loss) and filter out the weaker matches
function filterMatches(matches) {
	// get equally strong sequences to choose randomly from
	return matches = _.filter(matches, function(match) {
		return match.forced === matches[0].forced;
		// return (match.forced === matches[0].forced)  && (match.frequency >= matches[0].frequency);
	})

}

// determine which squares to process based on the chosen orientation
function orientMactches(matches) {
	var squares = [];
	console.log('matches after filter: ', matches)

	_.each(matches, function(match) {
		var index = tic.turn.check()
		var square = match.sequence[index]

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

		console.log('square(s) to choose from: ', rotateSequence(_.uniq(squares), false))
	})

	// return _.uniq in case square and its orientation are the same square.
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
	return aiRandom(_.intersection(tic.emptySquares.check(), rotateSequence(squares, false)))
}

// determines wins and loss sequences based on who is first player
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

