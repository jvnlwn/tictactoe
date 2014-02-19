// processing to be performed after square is chosen by human or computer
function processMove(square, piece) {
	// display piece in the chosen square
	appendPiece('#' + square, determineTemplate('lg-' + piece));
	// remove chosen square from empty squares array
	tic.emptySquares.remove(square);
	// add chosen square to the current sequence
	tic.sequence.add(square);
	// set the rotation if appropriate
	tic.rotation.set(square);
	// add chosen square to piece's squares array
	tic[piece].add(square);
	// updating the extra boards
	updateBoards()
	// check if the game is over
	gameOver(piece);
}