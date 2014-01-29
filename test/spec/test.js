/* global describe, it */

(function () {
    'use strict';

    function clickSquares(sequence) {
    	_.each(sequence, function(square) {
	    	setTimeout(function() {
	    		$('#' + square).click()
	    	},100)
    	})
    }

    function addSequence(target, list, sequence) {
    	target.add(target.check(list), sequence)
    }

    describe('The AI', function () {
    	it('should use a winning sequence', function(done) {

    		addSequence(tic.firstPlayerSequences, 'wins', [1,7,9,5,3,2,6])

    		$('.new-game').click()

    		setTimeout(function() {
	    		expect(tic.sequence.check()[0]).to.equal(1)
	    		done()
    		},250)
    	})

    	it('should recognize a sequence that is orientationally same as another sequence', function(done) {
    		// [1,3]
    		clickSquares([3])

    		setTimeout(function() {
	    		expect(tic.sequence.check()[2]).to.equal(9)
	    		done()
    		},250)
    	})
    });
})();
