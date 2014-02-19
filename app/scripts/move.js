// processing to be performed after square is chosen by human or computer
function processMove(square, piece) {
	$('#current-sequence').find('.' + square).append(determineTemplate(piece))

	// display piece in the chosen square
	appendPiece('#' + square, determineTemplate(piece));
	// remove chosen square from empty squares array
	tic.emptySquares.remove(square);
	// add chosen square to the current sequence
	tic.sequence.add(square);
	// set the rotation if appropriate
	tic.rotation.set(square);
	// add chosen square to piece's squares array
	tic[piece].add(square);
	// check if the game is over
	what()
	gameOver(piece);
	console.log('turn is: ', tic.turn.check())
}