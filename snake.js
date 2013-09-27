(function(root) {

  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Snake = SnakeGame.Snake = function (board) {
    this.direction = "n";
	  this.board = board;

	 var half = board.dimension/2
    this.segments = [new Coord(half, half), new Coord(half, half+1)];
  };

  Snake.prototype.move = function() {
    var MOVES = {
      "n":[0, -1],
      "s":[0, 1],
      "e":[1, 0],
      "w":[-1, 0]	  };

    var snake = this;
    var popped_tail = snake.segments.pop();
    var newCoord = (snake.segments[0].plus(MOVES[this.direction]));
    var head = snake.segments[0]

    if(snake.consume()){
     snake.segments.push(popped_tail);
     snake.segments.unshift(newCoord);
      this.board.apple = new SnakeGame.Apple(this.board);
    } else if (snake.board.validMove(newCoord)){
      snake.segments.unshift(newCoord);
    } else{
      snake.segments = [];
    }   
  }

  Snake.prototype.turn = function(dir){
    this.direction = dir;
  }

  Snake.prototype.consume = function(){
   var apple = this.board.apple;
   var head = this.segments[0]
   return ((apple.coordX == head.x) && (apple.coordY == head.y))
  }

  var Coord = SnakeGame.Coord = function (x, y){
    this.x = x;
    this.y = y;
  }

  Coord.prototype.plus = function(coord) {
    return new Coord(this.x + coord[0], this.y + coord[1]);
  }

})(this);

