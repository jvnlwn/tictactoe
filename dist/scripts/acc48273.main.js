function gameOver(a){if(checkForThree(tic.setsOfThree,0,0,a))return tic.turn.check()%2===0?endGame(a+" wins","firstPlayerWins"):endGame(a+" wins","secondPlayerWins");if(0===tic.emptySquares.check().length)return endGame("draw","draws");tic.turn.increment();var b=forcedMove("x").concat(forcedMove("o"));if(b.length>0){var c=9/tic.turn.check();tic.forced.increment(c)}}function endGame(a,b){tic.gameOver=!0,tic.gamesPlayed.increment(),$(".winner").text(a.toUpperCase()+"!"),tic[b].add(rotateSequence(tic.sequence.check(),!0)).success(tic.sequence.check())}function checkForThree(a,b,c,d){if(3===c)return!0;if(b>=a.length)return!1;var e=a[b][c];return $("#"+e).children().hasClass(d)?checkForThree(a,b,c+1,d):checkForThree(a,b+1,0,d)}function rotateSequence(a,b){var c=[];return _.each(a,function(a){c.push(b?tic.rotation.check().indexOf(a)+1:tic.rotation.check()[a-1])}),c}function squareType(a){var b=[1,3,7,9],c=[2,4,6,8];return b.indexOf(a)>-1?b:c.indexOf(a)>-1?c:[5]}function determineTemplate(a){return _.template($("#"+a).text())}function appendPiece(a,b){$(a).append(b)}function aiMove(){var a=forcedMove("o").concat(forcedMove("x")),b=a[0]||aiTactical()||aiRandom(tic.emptySquares.check().slice());processMove(b,"o")}function aiRandom(a){console.log("randomly form these squares: ",a);var b=Math.floor(Math.random()*a.length),c=a[b];return c}function forcedMove(a){var b=[];return _.each(tic.setsOfThree,function(c){var d=_.difference(c,tic[a].check());1===d.length&&tic.emptySquares.check().indexOf(d[0])>-1&&b.push(d[0])}),b}function aiTactical(){var a=rotateSequence(tic.sequence.check(),!0),b=findMatch(determineSequences().wins,a),c=findMatch(determineSequences().loss,a),d=findMatch(tic.draws.check(),a);return proVersesAnti(b,c)||proVersesAnti(d,c)||anti(c)}function proVersesAnti(a,b){return a.length>0&&b.length>0&&(a=compareMatches(a,b,tic.sequence.check().length)),a.length>0?processSquares(orientMactches(filterMatches(a))):void 0}function anti(a){if(a.length>0){console.log("we are avoiding a loser");var b=orientMactches(a),c=rotateSequence(b,!1);return 0===_.difference(tic.emptySquares.check(),c).length&&c.pop(),aiRandom(_.difference(tic.emptySquares.check(),c))}}function compareMatches(a,b,c){if(0===a.length)return a;var d=findMatch(b,_.first(a).sequence,0,[],c+1);return d.length>0?(console.log("some evil is afoot:  ",_.first(a).sequence[c]+" same as "+d[0].sequence[c]),console.log("compare the success: ",_.first(a).success[c]+" same as "+d[0].success[c]),_.first(a).success[c]>d[0].success[c]||_.first(a).success[c]===d[0].success[c]&&_.first(a).forced>d[0].forced?(console.log("force is strong in this one: ",_.first(a).forced+" vs "+d[0].forced),a):(console.log("weak sauce: ",_.first(a).forced+" vs "+d[0].forced),compareMatches(_.rest(a),b,c))):(console.log("no evil here"),a)}function filterMatches(a){return a=_.filter(a,function(b){return b.forced===a[0].forced})}function orientMactches(a){var b=[];return console.log("matches after filter: ",a),_.each(a,function(a){var c=tic.turn.check(),d=a.sequence[c];console.log("oriented mirror: ",a.oriented.mirror),console.log("oriented normal: ",a.oriented.normal),console.log("index at:    ",c),a.oriented.mirror>c&&a.oriented.normal>c?(console.log("this is when we allow for orientation swap"),b.push(handleOrientaion(a.sequence[0],d),d)):a.oriented.mirror<c?(console.log("orientation is permanently mirror"),b.push(handleOrientaion(a.sequence[0],d))):b.push(d),console.log("square(s) to choose from: ",rotateSequence(_.uniq(b),!1))}),_.uniq(b)}function processSquares(a){return console.log("squares after push: ",a),0===tic.turn.check()?(console.log("first move",squareType(aiRandom(a))),aiRandom(squareType(aiRandom(a)))):(console.log("squares after orientation: ",a),aiRandom(_.intersection(tic.emptySquares.check(),rotateSequence(a,!1))))}function determineSequences(){return"c"===tic.player.check()?{wins:tic.firstPlayerWins.check(),loss:tic.secondPlayerWins.check()}:{wins:tic.secondPlayerWins.check(),loss:tic.firstPlayerWins.check()}}function huMove(){$(".square").click(function(){var a=parseInt($(this).attr("id"));tic.emptySquares.empty(a)&&!tic.gameOver&&(processMove(a,"x"),tic.gameOver||aiMove())})}function findMatch(a,b,c,d,e){return c=c||0,d=d||[],e=e||b.length,0===b.length||0===a.length||c>=e?a:(_.each(a,function(a){if(console.log("exact:    ",a.sequence[c]+" "+b[c]),console.log("oriented: ",handleOrientaion(a.sequence[0],a.sequence[c])+" "+b[c]),a.sequence[c]===b[c]&&a.oriented.mirror>c){var e=a.oriented.normal;10===a.oriented.normal&&(a.oriented.normal=b[c]===handleOrientaion(a.sequence[0],a.sequence[c])?10:c);var f=a.oriented.normal;e!==f&&console.log("MIRROR GONE"),d.push(a)}else handleOrientaion(a.sequence[0],a.sequence[c])===b[c]&&(a.oriented.mirror=10===a.oriented.mirror?c:a.oriented.mirror,console.log("MIRROR IS -> ",a.oriented.mirror),d.push(a))}),findMatch(d,b,c+1,[],e))}function handleOrientaion(a,b){var c={input:[1,2,3,4,5,6,7,8,9],output:[1,4,7,2,5,8,3,6,9]},d={input:[1,2,3,4,5,6,7,8,9],output:[3,2,1,6,5,4,9,8,7]};return[1,3,7,9].indexOf(a)>-1?c.output[b-1]:[2,4,6,8].indexOf(a)>-1?d.output[b-1]:5}function stats(a,b,c,d){if(!(d>=c)){var e=findMatch(a,rotateSequence(b,!0),d,[],d+1),f=_.max(_.map(e,function(a){return a.success[d]+1}));return _.each(e,function(a){a.success[d]=f}),stats(e,b,c,d+1)}}function setup(){return{newGame:function(){return{emptySquares:emptySquares(),turn:incrementInt(),forced:incrementInt(),sequence:currentSequence(),rotation:rotation(initiateRotation),x:recordTakenSquares(),o:recordTakenSquares(),gameOver:!1}},setsOfThree:[[1,2,3],[1,5,9],[1,4,7],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]],player:playerOrder(),firstPlayerWins:allSequences(),secondPlayerWins:allSequences(),draws:allSequences(),gamesPlayed:incrementInt()}}function emptySquares(){var a=[1,2,3,4,5,6,7,8,9];return{empty:function(b){var c=a.indexOf(b);return c>-1?!0:!1},remove:function(b){var c=a.indexOf(b);a.splice(c,1)},check:function(){return a}}}function incrementInt(){var a=0;return{increment:function(b){a+=b||1},check:function(){return a}}}function currentSequence(){var a=[];return{add:function(b){a.push(b)},check:function(){return a}}}function allSequences(){var a=[];return{add:function(b){addedTo=!0;var c=findMatch(a,b);return c.length>0?c[0].frequency+=1:a.push({sequence:b,frequency:1,forced:tic.forced.check(),success:zerosArray(tic.sequence.check()),overall:zerosArray(tic.sequence.check()),oriented:{normal:10,mirror:10}}),this},arrange:function(){return a=a.sort(function(a,b){return b.forced-a.forced}),this},success:function(b){return stats(a,b,b.length,0),this},orient:function(){return _.each(a,function(a){a.oriented.normal=10,a.oriented.mirror=10}),this},check:function(){return a}}}function zerosArray(a){for(var b=[],c=0;c<a.length;c++)b.push(0);return b}function playerOrder(){var a=["c","h"];return{switchOrder:function(){a=a.reverse()},check:function(){return a[0]}}}function rotation(a){var b=[],c=[{squares:[1,2],rotation:[1,2,3,4,5,6,7,8,9]},{squares:[3,6],rotation:[3,6,9,2,5,8,1,4,7]},{squares:[9,8],rotation:[9,8,7,6,5,4,3,2,1]},{squares:[7,4],rotation:[7,4,1,8,5,2,9,6,3]}];return{set:function(d){a()&&(b=_.find(c,function(a){return a.squares.indexOf(d)>-1}).rotation)},check:function(){return b}}}function initiateRotation(){var a=tic.sequence.check();return 1===a.length&&5!==a[0]||2===a.length&&5===a[0]}function recordTakenSquares(){var a=[];return{add:function(b){a.push(b)},check:function(){return a}}}function processMove(a,b){appendPiece("#"+a,determineTemplate(b)),tic.emptySquares.remove(a),tic.sequence.add(a),tic.rotation.set(a),tic[b].add(a),gameOver(b)}function startNewGame(){var a=function(){console.log("-- NEW GAME --"),tic=$.extend(tic,tic.newGame()),$(".square").html(""),$(".winner").html(""),tic.player.switchOrder(),tic.firstPlayerWins.arrange().orient(),tic.secondPlayerWins.arrange().orient(),tic.draws.arrange().orient(),"c"===tic.player.check()&&aiMove()};$(".new-game").click(a),a()}var tic=setup();$(function(){huMove(),startNewGame()});