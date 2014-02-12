function findMatch(list, sequence, index, current, length) {

	if (sequence.length === 0 || list.length === 0) {
		return list;
	}

	if (index >= length) {
		return list;
	}

	_.each(list, function(item) {
		console.log('exact:    ',item.sequence[index] + ' ' + sequence[index])
		console.log('oriented: ',handleOrientaion(item.sequence[0], item.sequence[index]) + ' ' + sequence[index])
		// if sequences aren't exactly the same, maybe they are a mirror of eachother -> check for orientation
		if (item.sequence[index] === sequence[index] || handleOrientaion(item.sequence[0], item.sequence[index]) === sequence[index]) {

			current.push(item)
		}
	})

	return findMatch(current, sequence, index + 1, [], length)
}

// orientation based on first square in sequence
function handleOrientaion(orientation, square) {
	var indexFirst;
	var indexSecond;

	// if 5 is first, may need to check for that

	var corner = {
		first:  [1,2,3,5,6,9],
		second: [1,4,7,5,8,9]
	}

	var side = {
		first:  [1,2,4,5,7,8],
		second: [3,2,6,5,9,8]
	}

	// corner orientation
	if ([1,3,7,9].indexOf(orientation) > -1) {
		return returnRelated(corner)
	}

	if ([2,4,6,8].indexOf(orientation) > -1) {
		return returnRelated(side)
	}

	function returnRelated(o) {
		indexFirst  = o.first.indexOf(square)
		indexSecond = o.second.indexOf(square)
		return indexFirst > -1 ? o.second[indexFirst] : o.first[indexSecond];
	}
}