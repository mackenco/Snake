(function(root) {


  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Board = SnakeGame.Board = function (dimension){
    this.board = [];
    this.dimension = dimension;
 	 this.apple = new SnakeGame.Apple(this);
 	 this.snake = new SnakeGame.Snake(this);
    this.fillBoard();
  }

  Board.prototype.fillBoard = function() {
    for (var y = 0; y < this.Y_MAX; y++) {
      var row = []
      for (var x = 0; x < this.X_MAX; x++) {
        row.push("");
      }
      this.board.push(row);
    }
  }

  Board.prototype.validMove = function(coord){
	  var snake = this.snake;
	  var valid = true;
	  snake.segments.forEach(function(segment){
		  if((coord.x == segment.x) && (coord.y == segment.y)){
			  valid = false;
		  };
	  }); 
	  
	  if((coord.x < 0 || coord.x > this.dimension) ||
			  (coord.y < 0 || coord.y > this.dimension)){
		  valid = false
	  }
	  return valid;
	};

  var Apple = SnakeGame.Apple = function (board){
    this.board = board;
	 this.coordX = Math.floor(Math.random() * this.board.dimension);
    this.coordY = Math.floor(Math.random() * this.board.dimension);
	 
    // this.coordX = null;
    // this.coordY = null;
 //   this.generatePosition();
  }

  // Apple.prototype.generatePosition = function (){
  //   coordX = Math.floor(Math.random() * this.board.dimension);
  //   coordY = Math.floor(Math.random() * this.board.dimension);
  //   occupied = false;
  // 
  //   this.board.snake.segments.forEach(function(segment){
  //     if(segment.x == coordX && segment.y == coordY){
  //       occupied = true;
  //     }
  //   });
  // 
  //   if(occupied){
  //     this.generatePosition()
  //   } else {
  //     this.coordX = coordX;
  //     this.coordY = coordY;
  //   }
  // }

})(this);

