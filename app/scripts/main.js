var tic = {

	threeInARow: [[1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [4,5,6], [7,8,9]]

}








$(function() {
    chooseSquare();
    // verifyAllThrees('x')

});

function chooseSquare() {
	$('.square').click(function() {	

		var squareTaken = $(this).children().length > 0;

		if (!squareTaken) {
			var template = _.template($('#x').text());
			$(this).append(template())	
		}
	})
}

function verifyAllThrees(piece) {
	var bumpSet = runEachSet(tic.threeInARow, displaySet);

	setInterval(function() {
    	bumpSet(piece)
    	checkForThree(tic.threeInARow, 0, 0, piece)
    },1500)
}

function checkForThree(allSets, set, order, piece) {

	if (order === 3) {
		console.log('MATCH')
		return true;
	}

	if (set >= allSets.length) {
		console.log('NO GOOD')
		return false;
	}

	var square = allSets[set][order]

	if ($('#' + square).children().hasClass(piece)) {
		console.log('match',set,order)
		return checkForThree(allSets, set, order + 1, piece)
	} else {
		return checkForThree(allSets, set + 1, 0, piece)
	}
}


// functions just for checking tic.threeInARow array

// example: 
// var bumpSet = runEachSet(tic.threeInARow, displaySet)
// bumpSet('o')

function runEachSet(allSets, fun) {
	var i = 0;

	return function(piece) {
		i = i < allSets.length ? i : 0;

		clearSquares();

		fun(allSets[i], piece)
		i++;
	}
}

function displaySet(set, piece) {
	set.forEach(function(square) {
		var target = '#' + square;
		var template = determineTemplate(piece)
		appendPiece(target, template)
	})
}

function determineTemplate(piece) {
	var template;

	if (piece === 'x') {
		return _.template($('#x').text());
	}

	return _.template($('#o').text());
}

function appendPiece(target, template) {
	$(target).append(template)
}

function clearSquares() {
	var squares = $('.square');

	squares.each(function() {
		$(this).html('');
	})
}

