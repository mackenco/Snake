(function(root) {

  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var View = SnakeGame.View = function($el) {
    this.$el = $el

    this.timerId = null;
    this.board = null;
  }

  View.prototype.handleKeyEvent = function(event) {
    switch(event.keyCode) {
    case 37:
      this.board.snake.turn('n');
      break;
    case 38:
      this.board.snake.turn('w');
      break;
    case 39:
      this.board.snake.turn('s');
      break;
    case 40:
      this.board.snake.turn('e');
      break;
    }
  }

  View.prototype.render = function(){
	  var view = this;
	  var board = view.board;
	  var cells = board.board;
	  var apple = board.apple;

	 function buildBoard () {
     var i=0;
	       return _.times(board.dimension, function () {
	         return _.times(board.dimension, function () {
             i++;
	           return $('<li class="cell" id='+i+'></li');
	         });
	       });
	     }

	 var boardCells = buildBoard();

	 (board.snake.segments).forEach(function (seg){
		 boardCells[seg.x][seg.y].addClass("snake");
	 });

   boardCells[apple.coordX][apple.coordY].addClass("apple");

	 this.$el.empty();
	 this.$el.append($('<ul class="grid"></ul>'));

	 boardCells.forEach(function(row){
		 row.forEach(function(cell){
			 view.$el.append(cell);
		 });
	 });
  };

  View.prototype.addApple = function(){
    var num = Math.floor(Math.rand() * 100);

    var appleCell = this.$el
  }

  View.prototype.step = function() {
	 if(this.board.snake.segments[0]){
	    this.board.snake.move();
	    this.render();
	 } else {
		 alert("You lose!");
		 window.clearInterval(this.timerId);
	 }
  }

  View.prototype.start = function(){
    this.board = new SnakeGame.Board(10);
    $(window).keydown(this.handleKeyEvent.bind(this));
    this.timerId = setInterval(this.step.bind(this), 250);
  };

})(this);

