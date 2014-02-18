function gameOver(piece) {
	// a win?
	if (checkForThree(tic.setsOfThree, 0, 0, piece)) {
		// records sequence of moves as a win or draw for first or second player and converts that sequence to a normal rotation
		if (tic.turn.check() % 2 === 0) {
			return endGame(piece + ' Wins', 'firstPlayerWins');
		} else {
			return endGame(piece + ' Wins', 'secondPlayerWins');
		}
	// a draw?
	} else if (tic.emptySquares.check().length === 0) {
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
	tic.stats.update('gamesPlayed');
	// update stats
	tic.stats.update(text.split(' ').join(''))
	// reflect stats in DOM
	statsInDOM()
	// display winner in DOM
	$('.winner').text(text.toUpperCase() + '!');

	// adding the final sequence to the appropriate list and ranks the success of each position in each sequence
	tic[sequence].add(rotateSequence(tic.sequence.check(), true)).updateStat(tic.sequence.check(), 'success');
	// update the overall occurance of each square in all sequences
	tic.firstPlayerWins.updateStat(tic.sequence.check(), 'overall');
	tic.secondPlayerWins.updateStat(tic.sequence.check(), 'overall');
	tic.draws.updateStat(tic.sequence.check(), 'overall');
}

// display stats in the DOM
function statsInDOM() {
	$('#wins').text(tic.stats.check('xWins'))
	$('#loss').text(tic.stats.check('oWins'))
	$('#draws').text(tic.stats.check('draw'))
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