// takes a sequence and rotates it. Direction can be true or false. True for converting current sequence to standard rotation. False for converting standard-rotated sequence to current rotation.
function convertSequence(sequence, direction) {
	var conversion = [];

	_.each(sequence, function(square) {
		conversion.push(direction ? tic.rotation.check().indexOf(square) + 1 : tic.rotation.check()[square - 1])
	})
	return conversion;
}

// supplies all squares or sides for choosing randomly
function squareType(square) {
	var corners = [1,3,7,9];
	var sides = [2,4,6,8]
	
	if (corners.indexOf(square) > -1) {
		return corners;
	}
	if (sides.indexOf(square) > -1) {
		return sides;
	}
	return [5];
}

// choosing piece template
function determineTemplate(piece) {
	return _.template($('#' + piece).text());
}

// displaying piece
function appendPiece(target, template) {
	$(target).append(template)
}