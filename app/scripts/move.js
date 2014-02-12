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