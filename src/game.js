  /*
   * Sets up the game
   * @param {*} gamestate
   * @param {*} constants
   * @param {*} canvas
   * @param {*} ctx
   */
  function init(gamestate, constants, canvas, ctx) {
    // TODO: Edit
    console.log('> Init');
    canvas.style.backgroundColor = '#ddd';
    gamestate.quit = false;
    gamestate.stopping = false;
    gamestate.x = 100;
    gamestate.y = 100;
    gamestate.dx = 0;
    gamestate.dy = 0;
    gamestate.drawed = [];
  }
  /*
   * Renders the game
   * @param {*} gamestate
   * @param {*} constants
   * @param {*} canvas
   * @param {*} ctx
   */
  function render(gamestate, constants, canvas, ctx) {
    // TODO: Edit
    console.log('> Render');
    // Drawing
    ctx.beginPath();
    for (let i = gamestate.drawed.length - 1; i >= 0; i--) {
      ctx.rect(gamestate.drawed[i].x - 1, gamestate.drawed[i].y - 1, 2, 2);
      ctx.moveTo(gamestate.drawed[i].sx, gamestate.drawed[i].sy);
      ctx.lineTo(gamestate.drawed[i].x, gamestate.drawed[i].y);
    }
    ctx.fillStyle = "#aaa";
    ctx.fill();
    ctx.stroke();
    // Mouse Center
    ctx.beginPath();
    ctx.rect(gamestate.x - 2.5, gamestate.y - 2.5, 5, 5);
    ctx.fillStyle = "red";
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(gamestate.x, gamestate.y);
    ctx.lineTo(gamestate.x - gamestate.dx * constants.mult, gamestate.y - gamestate.dy * constants.mult);
    ctx.stroke();
    if (gamestate.stopping) {
      canvas.style.backgroundColor = '#dbb';
    }
  }
  /*
   * Generates the next instance of the game
   * @param {*} gamestate
   * @param {*} constants
   * @returns {boolean} false if the game didn't update, else otherwise
   */
  function next(gamestate, constants) {
    // TODO: Edit
    console.log('> Next');
    return false;
  }
  /*
   * Modifies the gamestate on mouse move
   * @param {object} move
   * @param {*} gamestate
   * @param {*} constants
   * @param {object} triggerEvent
   * @returns {boolean} false if the game didn't update, else otherwise
   */
  function onmove(move, gamestate, constants, triggerEvent) {
    // TODO: Edit
    console.log('> onMove to ' + move.x + ', ' + move.y + ' with delta ' + move.deltaX + ', ' + move.deltaY);
    gamestate.x = move.x;
    gamestate.y = move.y;
    gamestate.dx = move.deltaX;
    gamestate.dy = move.deltaY;
    gamestate.drawed.push({
      x: move.x,
      y: move.y,
      sx: (move.deltaX === 0 ? move.x : move.x - move.deltaX),
      sy: (move.deltaX === 0 ? move.y : move.y - move.deltaY)
    });
    return true;
  }
  /*
   * Modifies the gamestate on keypress
   * @param {string} key
   * @param {*} gamestate
   * @param {*} constants
   * @param {object} triggerEvent
   * @returns {boolean} false if the game didn't update, else otherwise
   */
  function onkey(key, gamestate, constants, triggerEvent) {
    // TODO: Edit
    console.log('> onKey with key ' + key);
    switch (key) {
      case 'q':
        if (gamestate.stopping) {
          gamestate.quit = true;
        } else {
          gamestate.stopping = true;
        }
        return true;
        break;
      default:
        return false;
    }
  }
  /*
   * Check if the game should stop
   * @param {*} gamestate
   * @param {*} constants
   * @returns {boolean} true if the game should stop, false otherwise
   */
  function stop(gamestate, constants) {
    // TODO: Edit
    console.log('> Stop');
    return gamestate.quit;
  }

  game.setup(1, {}, { mult: 1.2 }, init, render, next, onmove, onkey, stop, { fullscreen: true });
