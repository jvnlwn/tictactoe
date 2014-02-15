function huMove() {

	$('.square').click(function() {	

		var square = parseInt($(this).attr('id'));

		if (tic.emptySquares.empty(square) && !tic.gameOver) {

			processMove(square, 'x');

			// if game isn't over, have computer move
			if (!tic.gameOver) {
				aiMove();
			}
		}
	})
}