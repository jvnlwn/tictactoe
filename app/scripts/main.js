$(function() {
    chooseSquare();
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