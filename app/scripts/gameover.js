function gameOver(piece) {
	// a win?
	if (checkForThree(tic.setsOfThree, 0, 0, piece)) {
		// records sequence of moves as a win or draw for first or second player and converts that sequence to a normal rotation
		if (tic.turn.check() % 2 === 0) {
			return endGame(piece + ' wins', 'firstPlayerWins');
		} else {
			return endGame(piece + ' wins', 'secondPlayerWins');
		}
	// a draw?
	} else if (tic.emptySquares.checkEmpty().length === 0) {
		return endGame('draw', 'draws');
	}

	tic.turn.increment();
	// determine if next move is forced. use total forced moves as a stat for comparing sequence strength. I have a reason for checking both pieces on every turn.
	var forced = forcedMove('x').concat(forcedMove('o'));
	if (forced.length > 0) {
		var amount = 9 / tic.turn.check()
		tic.forced.increment(amount);
	}
}

function endGame(text, sequence) {
	// game is over
	tic.gameOver = true;
	// number of games played ++
	tic.gamesPlayed.increment();
	// display winner in DOM
	$('.winner').text(text.toUpperCase() + '!');

	// adding the final sequence to the appropriate list
	tic[sequence].add(convertSequence(tic.sequence.check(), true));

	// this ranks the success of each position in each sequence
	tic.firstPlayerWins.success(tic.sequence.check());
	tic.secondPlayerWins.success(tic.sequence.check());
	tic.draws.success(tic.sequence.check());
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