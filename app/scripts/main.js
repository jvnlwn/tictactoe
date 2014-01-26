var tic = setup();

$(function() {
    // verifyAllThrees('x')
    chooseSquare();
    startNewGame()
});

function startNewGame() {
	$('.new-game').click(function() {
		tic = $.extend(tic, tic.newGame());

		$('.square').html('');
		$('.winner').html('');

		tic.player.switchOrder();

		if(tic.player.checkPlayer() === 'c') {
			aiRandom();
		}
	})

	$('.new-game').click();
}

function setup() {
	return {

		newGame: function() {
			return {
				emptySquares: squareTaken(),
				turn:         turnOrder(),
				gameOver:     false
			}
		},

		player: playerOrder(),

		setsOfThree: [[1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [4,5,6], [7,8,9]],

		winningSequencesFirstPlayer: [],

		winningSequencesSecondPlayer: []
	}
}

// begin
// begin
// begin
// begin me them closures for setup

function playerOrder() {
	// playerOrder will be switched at the very beginning, so computer is set to first position initially
	var playerOrder = ['c', 'h']

	return {
		switchOrder: function() {
			playerOrder = playerOrder.reverse();
		},

		checkPlayer: function() {
			return playerOrder[0];
		}
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
	var emptySquares = [1,2,3,4,5,6,7,8,9];

	return {
		checkSquare: function(square) {
			console.log('this is what the function thinks emptySquares are: ', emptySquares)
			var index = emptySquares.indexOf(square);

			if (index > -1) {
				emptySquares.splice(index, 1);
				return true;
			}
			return false;
		},

		checkEmpty: function() {
			return emptySquares;
		}
 	}
}

// end me them closures
// end
// end
// end

function chooseSquare() {

	$('.square').click(function() {	

		var square = parseInt($(this).attr('id'));

		if (tic.emptySquares.checkSquare(square) && !tic.gameOver && (tic.turn.checkTurn() % 2 === 0 && tic.player.checkPlayer() === 'h') || (tic.turn.checkTurn() % 2 !== 0 && tic.player.checkPlayer() !== 'h')) {
			var template = determineTemplate('x')
			appendPiece('#' + square, template())

			tic.turn.increment()

			if (checkForThree(tic.setsOfThree, 0, 0, 'x')) {
				tic.gameOver = true;
				$('.winner').text('X Wins!')
			} else {
				aiRandom();
			}
		}

	})
}

function aiRandom() {
	var emptySquares = tic.emptySquares.checkEmpty().slice();
	var choice = Math.floor(Math.random() * (emptySquares.length));
	var square = emptySquares[choice];	

	appendPiece('#' + square, determineTemplate('o'));
	tic.emptySquares.checkSquare(square);
	tic.turn.increment();

	if (checkForThree(tic.setsOfThree, 0, 0, 'o')) {
		tic.gameOver = true;
		$('.winner').text('O Wins!')
	}
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

