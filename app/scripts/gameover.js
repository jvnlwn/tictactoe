function gameOver(piece) {
	// a win?
	if (checkForThree(tic.setsOfThree, 0, 0, piece)) {
		tic.gameOver.over = true;
		tic.gameOver.result = 'win';
		tic.gamesPlayed.increment();
		$('.winner').text(piece.toUpperCase() + ' Wins!');

		// records sequence of moves as a win or draw for first or second player and converts that sequence to a normal rotation
		if (tic.turn.check() % 2 === 0) {
			tic.firstPlayerWins.add(convertSequence(tic.sequence.check(), true));
			// editSuccess();
			return
		} else {
			tic.secondPlayerWins.add(convertSequence(tic.sequence.check(), true));
			// editSuccess();
			return
		}
	// a draw?
	} else if (tic.emptySquares.checkEmpty().length === 0) {
		tic.gamesPlayed.increment();
		tic.gameOver.over = true;
		tic.gameOver.result = 'draw';
		$('.winner').text('Draw!');

		tic.draws.add(convertSequence(tic.sequence.check(), true));
		// editSuccess();
		return
	}

	tic.turn.increment();
	// determine if next move is forced. use total forced moves as a stat for comparing sequence strength. I have a reason for checking both pieces on every turn.
	var forced = forcedMove('x').concat(forcedMove('o'));
	if (forced.length > 0) {
		var amount = 9 / tic.turn.check()
		tic.forced.increment(amount);
	}
}

function editSuccess() {
	tic.firstPlayerWins.success(convertSequence(tic.sequence.check(), true));
	tic.secondPlayerWins.success(convertSequence(tic.sequence.check(), true));
	tic.draws.success(convertSequence(tic.sequence.check(), true));
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