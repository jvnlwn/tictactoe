function huMove() {

	$('.square').click(function() {	

		var square = parseInt($(this).attr('id'));

		if (tic.emptySquares.checkSquare(square) && !tic.gameOver.over) {

			processMove(square, 'x');

			// if game isn't over, have computer move
			if (!tic.gameOver.over) {
				aiMove();
			}
		}
	})
}