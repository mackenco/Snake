(function (root) {
  var Game = root.Game = (root.Game || {});
  var intervalID;

  var SnakeUI = Game.SnakeUI = function(size, root){
    this.size = size;
    this.$root = root;
    this.cellSize = Math.floor(500 / size);
    this.board = new Game.Board(size);
    this.highscores = [["RHD", 100]]
    this.initialDraw();
    this.waiting = false;
  }

  SnakeUI.prototype.reset = function() {
    this.board = new Game.Board(this.size);
    this.count = 0;
    this.score = 0;
    this.pressed = false;
  }

  SnakeUI.prototype.startScreen = function() {
    this.reset();
    this.clearKeys();
    this.render();
    this.startScreenDraw();
    this.bindScreenKeys();
  }

  SnakeUI.prototype.play = function() {
    $('.game-wrapper').addClass('grayed');
    var that = this;

    this.playDraw();
    this.render();
    intervalID = null;
    this.clearKeys();


    var newApple = this.board.addApple();
    $('#' + newApple[0] + "_" + newApple[1]).addClass('apple');

    window.setTimeout(function() {
      that.bindPlayKeys();
      $('.game-wrapper').removeClass('grayed');
      that.startStep();
    }, 1000);
  }

  SnakeUI.prototype.bindScreenKeys = function() {
    var that = this;

    $(document).keydown(function(e) {
      if(e.which === 32) {
        e.preventDefault();
        that.play();
      }
    });
  }

  SnakeUI.prototype.clearKeys = function() {
    $(document).off('keydown');
  }

  SnakeUI.prototype.bindPlayKeys = function() {
    var that = this;

    $(document).keydown(function(e) {
      if (e.which === 32) {
        e.preventDefault();
        if (intervalID === null) {
          that.startStep();
        } else {
          clearInterval(intervalID);
          intervalID = null;
          that.render();
        }
      }
      if (!that.pressed) {
        switch(e.which) {
        case 37:
          e.preventDefault();
          if(that.board.snake.dir != "E") {
            that.board.snake.turn("W");
          }
          break;
        case 38:
          e.preventDefault();
          if(that.board.snake.dir != "S") {
            that.board.snake.turn("N");
          }
          break;
        case 39:
          e.preventDefault();
          if(that.board.snake.dir != "W") {
            that.board.snake.turn("E");
          }
          break;
        case 40:
          e.preventDefault();
          if(that.board.snake.dir != "N") {
            that.board.snake.turn("S");
          }
          break;
        }
        that.pressed = true;
      }
    });
  }

  SnakeUI.prototype.startStep = function() {
    var that = this;

    intervalID = window.setInterval(function() {
      that.step();
    }, 40);
  }

  SnakeUI.prototype.step = function() {
    this.pressed = false
    this.count += 1
    this.board.snake.move();

    var apple = this.board.appleCollision()
    if (apple !== "none") {
      $('#' + apple[0] + "_" + apple[1]).removeClass('apple');
      var newApple = this.board.addApple();
      $('#' + newApple[0] + "_" + newApple[1]).addClass('apple');
      this.score += 10
    } else {
      this.board.snake.shrink();
    }

    if(this.board.hasLost()){
      clearInterval(intervalID);
      this.endGame();
      return;
    } else if (this.board.getOpenCells().length === 0) {
      clearInterval(intervalID);
      alert("u win!");
    } else {
      this.render();
    }
  }

  SnakeUI.prototype.endGame = function() {
    $('.game-wrapper').addClass('grayed');
    var that = this;
    window.setTimeout(function() {
      if(that.shouldAddScore(that.score)){
        that.clearKeys();
        that.swapScoreEntry();
        that.waiting = true;
        that.setNameKey();
        that.getName();
      } else {
        $('.game-wrapper').removeClass('grayed');
        that.startScreen();
      }
    }, 1000)
  }

  SnakeUI.prototype.shouldAddScore = function(score) {
    if(score === 0) {
      return false;
    } else if(this.highscores.length < 10) {
      return true;
    } else {
      if (this.score > this.highscores[9]) {
        return true;
      } else {
        return false;
      }
    }
  }

  SnakeUI.prototype.addScore = function(score, name) {
    this.swapScoreEntry();
    $('#name-entry').val('');

    if(this.highscores.length < 10){
      this.highscores.push([name, score]);
      this.highscores.sort(function(a,b) {return b[1] - a[1];});
    } else {
      this.highscores[9] = [name, score];
      this.highscores.sort(function(a,b) {return b[1] - a[1];});
    }

    this.renderHighscores();
    $('.game-wrapper').removeClass('grayed');
    this.startScreen();
  }

  SnakeUI.prototype.setNameKey = function() {
    var that = this;
    $('#name-entry').find('input').focus();
    $(document).keydown(function(e) {
      if(e.which === 13) {
        e.preventDefault();
        that.waiting = false;
      }
    });
  }

  SnakeUI.prototype.getName = function() {
    if(this.waiting) {
      window.setTimeout(this.getName.bind(this), 33);
    } else {
      this.addScore(this.score, $('#name-entry').find('input').val());
    }
  }

  SnakeUI.prototype.swapScoreEntry = function() {
    $('#name-entry').toggleClass('invisible');
    $('#highscores').toggleClass('invisible');
  }

  SnakeUI.prototype.render = function() {
    this.clearSnakeUI()

    this.board.snake.segments.forEach(function(segment) {
      $('#' + segment[0] + "_" + segment[1]).addClass('snake')
    });

    $('#score').html(this.score)
    if (intervalID === null) {
      $('#paused').css("display", "block")
    } else {
      $('#paused').css("display", "none")
    }
  }

  SnakeUI.prototype.clearSnakeUI = function() {
    $('.snake').removeClass('snake');
  }

  SnakeUI.prototype.initialDraw = function () {
    this.$root.html($('<div class="game-wrapper" id="wrapper"></div>'));
    var $highscores = $('<div class="highscores"><h1>high scores</h1></div>')
    $highscores.append($('<ol id="highscores"></ol>'))
    $highscores.append($('<div id="name-entry">initials: <input type="text" maxlength="3" placeholder="AAA"></div>'))
    this.$root.append($highscores);
    $('#name-entry').toggleClass('invisible');
    this.renderHighscores();
    this.$root.append($('<p class="status">score: <span id="score">0</span></p>'))
  }

  SnakeUI.prototype.startScreenDraw = function () {
    var $gameWrapper = $('#wrapper');
    $gameWrapper.addClass('screen');
    $gameWrapper.text('press space to begin');
  }

  SnakeUI.prototype.renderHighscores = function() {
    var $list = $('#highscores')
    $list.empty();
    this.highscores.forEach(function(score) {
      $list.append('<li>' + score[0] + ": " + score[1] + '</li>')
    });
  }

  SnakeUI.prototype.playDraw = function() {
    var $gameWrapper = $('#wrapper')
    $gameWrapper.empty();
    $gameWrapper.removeClass('screen')
    $gameWrapper.removeAttr("style")
    for(var r = 0; r < this.size; r++) {
      for(var c = 0; c < this.size; c++) {
        var $cell = $('<div class="cell"></div>');
        $cell.attr('id', r.toString() + "_" + c.toString());
        $cell.css('width', this.cellSize);
        $cell.css('height', this.cellSize);
        $gameWrapper.append($cell);
      }
    }

    var $paused = $('<div class="pause" id="paused">((paused))</div>');
    $gameWrapper.append($paused);
  }

})(this);