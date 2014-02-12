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

		// tic.firstPlayerWins.arrange().success(tic.sequence.check());
		// tic.secondPlayerWins.arrange().success(tic.sequence.check());
		// tic.draws.arrange().success(tic.sequence.check());

		// tic.firstPlayerWins.arrange().success();
		// tic.secondPlayerWins.arrange().success();
		// tic.draws.arrange().success();

		tic.firstPlayerWins.arrange();
		tic.secondPlayerWins.arrange();
		tic.draws.arrange();

		if(tic.player.check() === 'c') {
			// computer is first player, therefore starts game
			aiMove();
		}
	}

	$('.new-game').click(clickNewGame);

	clickNewGame();
}