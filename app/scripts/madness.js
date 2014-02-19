function what() {
	var rotatedIds = ['rotated-normal', 'rotated-90', 'rotated-180', 'rotated-270'];
	// var orientedIds = ['oriented-normal'];
	var orientedIds = ['oriented-normal', 'oriented-90', 'oriented-180', 'oriented-270'];

	// converting the current sequence to normal rotation
	var sequence = rotateSequence(tic.sequence.check(), true).slice();

	// all corners, sides, or just middle
	var associatedSquares = [1,3,9,7];

	_.each(rotatedIds, function(id, index) {
		tic.rotation.setManually(associatedSquares[index])
		// console.log('ROTATING SEQUENCE: ', tic.rotation.check())
		var convertedSequence = rotateSequence(sequence, false);
		// console.log('converted sequence is: ', convertedSequence)
		putInDOM(convertedSequence[tic.turn.check()], id);
	})

	_.each(orientedIds, function(id, index) {
		tic.rotation.setManually(associatedSquares[index])
		// console.log('ROTATING SEQUENCE: ', tic.rotation.check())
		var convertedSequence = rotateSequence(sequence, false);
		// console.log('converted sequence is: ', convertedSequence)
		console.log('normal is:   ', convertedSequence[tic.turn.check()])
		console.log('oriented is: ', handleOrientation(convertedSequence[0], convertedSequence[tic.turn.check()]))
		putInDOM(handleOrientation(convertedSequence[0], convertedSequence[tic.turn.check()]), id);
	})

	// retetting rotation
	tic.rotation.set();
}

function putInDOM(square, id) {
	console.log('ID IS: ', id)
	$('#' + id).find('.' + square).append(determineTemplate(whatPiece()));
}

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