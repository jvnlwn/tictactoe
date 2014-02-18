function findMatch(list, sequence, index, current, length) {
	index   = index   || 0;
	current = current || [];
	length  = length  || sequence.length;

	if (sequence.length === 0 || list.length === 0 || index >= length) {
		return list;
	}

	_.each(list, function(item) {
		console.log('exact:    ',item.sequence[index] + ' ' + sequence[index])
		console.log('oriented: ',handleOrientaion(item.sequence[0], item.sequence[index]) + ' ' + sequence[index])
		// if sequences aren't exactly the same, maybe they are a mirror of eachother -> check for orientation
		if (item.sequence[index] === sequence[index] && item.oriented.mirror > index) {
			// if oriented.normal is 10 (meaning the orientation has not been set)
			if (item.oriented.normal === 10) {
				item.oriented.normal = sequence[index] === handleOrientaion(item.sequence[0], item.sequence[index]) ? 10 : index;
			}
			current.push(item)
		} else if (handleOrientaion(item.sequence[0], item.sequence[index]) === sequence[index]) {
			item.oriented.mirror = item.oriented.mirror === 10 ? index : item.oriented.mirror;
			current.push(item)
		}
	})

	return findMatch(current, sequence, index + 1, [], length)
}

// orientation based on first square in sequence
function handleOrientaion(orientation, square) {
	var corner = {
		input:  [1,2,3,4,5,6,7,8,9],
		output: [1,4,7,2,5,8,3,6,9]
	}

	var side = {
		input:  [1,2,3,4,5,6,7,8,9],
		output: [3,2,1,6,5,4,9,8,7]
	}

	// corner orientation
	if ([1,3,7,9].indexOf(orientation) > -1) {
		return corner.output[square - 1];
	}

	// side orientation
	if ([2,4,6,8].indexOf(orientation) > -1) {
		return side.output[square - 1];
	}

	// 5 will always have an oriented value of 5. It's always the middle.
	if (square === 5) {
		return 5;
	}

	// middle orientation for second move. Returns all sides or all corners.
	if (tic.sequence.check().length === 1) {
		return squareType(square);
	}

	// middle orientation afer second move. The orientation will be based off of the second move.
	return handleOrientaion(tic.sequence.check()[1], square)
}

// determine sequence overall occurrences and success of those sequences
function stats(list, sequence, length, i, stat) {

	if (i >= length) {
		return
	}

	var matches = findMatch(list, rotateSequence(sequence, true), i, [], i + 1);

	var max = _.max(_.map(matches, function(match) {
		return match[stat][i] + 1;
	}))

	_.each(matches, function(match) {
		match[stat][i] = max;
	})

	return stats(matches, sequence, length, i + 1, stat);
}