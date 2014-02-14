function findMatch(list, sequence, index, current, length) {

	if (sequence.length === 0 || list.length === 0 || index >= length) {
		return list;
	}

	_.each(list, function(item) {
		console.log('exact:    ',item.sequence[index] + ' ' + sequence[index])
		console.log('oriented: ',handleOrientaion(item.sequence[0], item.sequence[index]) + ' ' + sequence[index])
		// if sequences aren't exactly the same, maybe they are a mirror of eachother -> check for orientation
		if (item.sequence[index] === sequence[index] && item.oriented.mirror - 1 > index) {
			// if oriented.normal is 10 (meaning the orientation has not been set)
			if (item.oriented.normal === 10) {
				console.log('MIRROR GONE')
				item.oriented.normal = sequence[index] === handleOrientaion(item.sequence[0], item.sequence[index]) ? 10 : index;
			}
			current.push(item)
		} else if (handleOrientaion(item.sequence[0], item.sequence[index]) === sequence[index]) {
			item.oriented.mirror = item.oriented.mirror === 10 ? index : item.oriented.mirror;
			console.log('MIRROR IS -> ', item.oriented.mirror);
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

	// if 5 is first, may need to check for that

	// corner orientation
	if ([1,3,7,9].indexOf(orientation) > -1) {
		return corner.output[square - 1];
	}

	// side orientation
	if ([2,4,6,8].indexOf(orientation) > -1) {
		return side.output[square - 1];
	}

	return 5;
}

// determine sequence overall occurrences and success of those sequences
function stats(list, sequence, length, i, addedTo) {

	if (i >= length) {
		return
	}

	var matches = findMatch(list, convertSequence(sequence, true), i, [], i + 1);

	var max = _.max(_.map(matches, function(match) {
		return match.overall[i] + 1;
	}))

	_.each(matches, function(match) {
		match.overall[i] = max;
		match.success[i] = addedTo ? match.success[i] += 1 : match.success[i];
	})

	return stats(matches, sequence, length, i + 1, addedTo)
}