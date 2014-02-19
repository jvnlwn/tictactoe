// display the 8 sequences learned by the AI from the current sequence being played
function updateBoards() {
	// rotated boards
	var rotatedIds = ['rotated-normal', 'rotated-90', 'rotated-180', 'rotated-270'];
	// oriented boards
	var orientedIds = ['oriented-normal', 'oriented-90', 'oriented-180', 'oriented-270'];
	// converting the current sequence to normal rotation
	var sequence = rotateSequence(tic.sequence.check(), true).slice();
	// for setting rotation manually
	var associatedSquares = [1,3,9,7];

	// loop through ids and append appropriate piece in correct position on each board
	_.each(rotatedIds, function(id, index) {
		// manually setting the rotation
		tic.rotation.setManually(associatedSquares[index])
		// converting the standard rotated version of the current sequence to the manually set rotation
		var convertedSequence = rotateSequence(sequence, false);
		// put correct square on the selected board
		putInDOM(convertedSequence[tic.turn.check()], id);
	})

	_.each(orientedIds, function(id, index) {
		// manually setting the rotation
		tic.rotation.setManually(associatedSquares[index])
		// orient the correct square
		var oriented = handleOrientation(sequence[0], sequence[tic.turn.check()])
		// convert the oriented square to the manually set rotation and put that square on the selected board
		putInDOM(rotateSequence([oriented], false), id);
	})

	// resetting rotation
	tic.rotation.set();
}

function putInDOM(square, id) {
	$('#' + id).find('.' + square).append(determineTemplate('sm-' + whatPiece()));
}

// determine what piece to append
function whatPiece() {
	var firstPlayer = tic.player.check();
	var firstPlayersTurn = tic.turn.check() % 2 === 0;
	var piece = '';

	if (firstPlayersTurn) {
		piece = firstPlayer === 'h' ? 'x' : 'o';
	} else if (!firstPlayersTurn) {
		piece = firstPlayer === 'h' ? 'o' : 'x';
	}

	return piece;
}

// put the boards in the DOM
function dOMinate() {
	var boardIds = ['rotated-normal', 'oriented-normal', 'rotated-90', 'oriented-90', 'rotated-180', 'oriented-180', 'rotated-270', 'oriented-270'];
	// var boardIds = ['rotated-180', 'rotated-270', 'rotated-90', 'rotated-normal', 'oriented-180', 'oriented-270', 'oriented-90', 'oriented-normal'];

	var boardTemplate = _.template($('#sm-board').text());
	_.each(boardIds, function(id) {
		$('.ai').append(boardTemplate({ _id: id }));
	})
}







