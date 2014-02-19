function gameOver(piece) {
	// a win?
	if (checkForThree(piece)) {
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
	console.log('winner should be: ', text)
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

// checking for three in a row using same principle from forced function
function checkForThree(piece) {
	var threeInARow = false;

	// looping over each possible set of three
	_.each(tic.setsOfThree, function(set){
		// getting the difference between the set and the players occupied squares
		var diff =  _.difference(set, tic[piece].check())
		// if the difference is 0
		if (diff.length === 0) {
			// . . then a set of three in a row has found been 
			threeInARow = true;
		}
	})

	return threeInARow;
}