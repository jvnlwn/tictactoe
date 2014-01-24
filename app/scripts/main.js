var tic = setup();

$(function() {
    // verifyAllThrees('x')
    var emptySquares = squareTaken();
    chooseSquare(emptySquares);

});

function setup() {
	return {
		emptySquares: [1,2,3,4,5,6,7,8,9],

		setsOfThree: [[1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [4,5,6], [7,8,9]],

		turn: turnOrder()
	}
}

function turnOrder() {
	var turnOrder = 0;

	return {
		increment: function() {
			turnOrder += 1;
		},

		checkTurn: function() {
			return turnOrder;
		}
	}
}


function squareTaken() {
	var emptySquares = tic.emptySquares.slice();

	return function(square) {
		var index = emptySquares.indexOf(square);

		if (index > -1) {
			emptySquares.splice(index, 1);
			return true;
		}
		return false;
	}
}

function chooseSquare(fun) {
	$('.square').click(function() {	

		var square = parseInt($(this).attr('id'));

		if (fun(square)) {
			var template = _.template($('#x').text());
			$(this).append(template())	
		}

		checkForThree(tic.setsOfThree, 0, 0, 'x')
	})
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


// functions just for checking tic.setsOfThree array -> example:
// var bumpSet = runEachSet(tic.setsOfThree, displaySet)
// bumpSet('o')

function verifyAllThrees(piece) {
	var bumpSet = runEachSet(tic.setsOfThree, displaySet);

	setInterval(function() {
    	bumpSet(piece)
    	checkForThree(tic.setsOfThree, 0, 0, piece)
    },1500)
}

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

