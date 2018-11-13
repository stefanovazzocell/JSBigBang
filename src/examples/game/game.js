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
  gamestate.player = {
    x: .5,
    y: .5
  }
  gamestate.blocks = [
    {
      x: 0,
      y: 1,
      width: 1
    }
  ]
  gamestate.player.quit = false
  constants.bound = {
    x: canvas.width,
    y: canvas.height
  }
  constants.player = {
    size: 20
  }
  constants.multiplier = {
    gyro: 0.2
  }
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
  // console.log('> Render');
  // Update bounds
  constants.bound.x = canvas.width;
  constants.bound.y = canvas.height;
  // Player
  ctx.beginPath();
  let playerX = constants.bound.x * gamestate.player.x - (constants.player.size / 2);
  let playerY = constants.bound.y * gamestate.player.y - (constants.player.size / 2);
  ctx.rect(playerX, playerY, constants.player.size, constants.player.size);
  ctx.fillStyle = "blue";
  ctx.fill();
  // blocks
  ctx.beginPath();
  let blockX = 0, blockY = 0;
  let i = 0;
  while (i < gamestate.blocks.length) {
    blockX = constants.bound.x * gamestate.blocks[i].x;
    blockY = constants.bound.y * gamestate.blocks[i].y;
    ctx.rect(blockX, blockY, gamestate.blocks[i].width * constants.bound.x, constants.player.size);
    i++;
  }
  ctx.fillStyle = "red";
  ctx.fill();
}
/*
 * Generates the next instance of the game
 * @param {*} gamestate
 * @param {*} constants
 * @returns {boolean} false if the game didn't update, else otherwise
 */
function next(gamestate, constants) {
  // TODO: Edit
  // console.log('> Next');
  for (let i in gamestate.blocks) {
    if (gamestate.player.y == gamestate.blocks[i].y && gamestate.player.x > gamestate.blocks[i].x && gamestate.player.x < (gamestate.blocks[i].x + gamestate.blocks[i].width)) {
      gamestate.player.y -= 0.01
    }
    gamestate.blocks[i].y -= 0.01;
    if (gamestate.blocks[i].y < 0) {
      gamestate.blocks.splice(i);
    }
  }
  if (gamestate.blocks.length == 0) {
    let x = Math.random();
    gamestate.blocks.push({
      x: x,
      y: 1,
      width: (1 - x) * Math.random()
    })
  }
  return true;
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
  // console.log('> onMove to ' + move.x + ', ' + move.y + ' with delta ' + move.deltaX + ', ' + move.deltaY + '; touch? ' + move.touch + '; isGyro? ' + move.isGyro);
  if ((move.touch || move.isGyro) && move.deltaX != 0 && move.deltaY != 0) {
    gamestate.player.x += (move.deltaX / constants.bound.x) * (move.isGyro ? constants.multiplier.gyro : 1);
    // Bound X
    if (gamestate.player.x > 1) {
      gamestate.player.x = 1;
    } else if (gamestate.player.x < 0) {
      gamestate.player.x = 0;
    }
    return true;
  }
  return false;
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
  // console.log('> onKey with key ' + key);
  switch (key) {
    case 'q':
      gamestate.quit = true;
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
  // console.log('> Stop');
  return gamestate.quit || gamestate.player.y < 0;
}

game.setup(30, {}, {}, init, render, next, onmove, onkey, stop, { fullscreen: true, gyro: true });
game.start();
