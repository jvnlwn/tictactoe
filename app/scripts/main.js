// var list = tic.draws.check().concat(tic.firstPlayerWins.check(), tic.secondPlayerWins.check());

function what(list, sequence, length, i) {

	if (i >= length) {
		return
	}

	var matches = findMatch(list, convertSequence(tic.sequence.check(), true), 0, [], i);

	console.log(_.map(matches, function(match) {
		return match.overall[i] + 1;
	}))

	var max = _.max(_.map(matches, function(match) {
		return match.overall[i] + 1;
	}))

	console.log('max is ', max)

	_.each(matches, function(match) {
		match.overall[i] = max;
	})

	return what(matches, sequence, length, i + 1)

}



