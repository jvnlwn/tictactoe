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



