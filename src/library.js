/*
* JS Big Bang - library.js
* Stefano Vazzoler (stefanovazzoler.com)
*/
(function(window,document){
  // This is the core of this library
  var game = {
    game: {
      /* Stores variable game state */
      gamestate: null,
      /* Stores game constants */
      constants: null,
      status: {
        /* is the game setup */
        isSetup: false,
        /* is the game running */
        isRunning: false,
        /* update on stand-by to be rendered */
        hasUpdate: true,
        /* is the game fullscreen */
        fullscreen: false
      },
      settings: {
        /* updates per seconds */
        framerate: 0,
        /* canvas update speed */
        canvasupdate: 0,
        /* should the game be fullscreen */
        fullscreen: false
      },
      fn: {
        /* Render function */
        render: null,
        /* Next state function */
        next: null,
        /* Mouse/Movement event handler */
        onmove: null,
        /* key event handler */
        onkey: null,
        /* stopping function */
        stop: null,
        /* Init function */
        init: null
      }
    },
    data: {
      mousemove: {
        x: 0,
        y: 0
      }
    },
    pointers: {
      canvas: {
        /* Stores the canvas */
        canvas: null,
        /* Stores the canvas' 2d context */
        ctx: null
      },
      timers: {
        /* Stores the game update timer */
        update: null,
        /* Stores the game render timer */
        render: null
      }
    },
    utils: {
      /*
       * Handler for keydown
       */
      keydown: function (e) {
        if (game.game.status.isRunning) {
          if (game.game.fn.onkey(e.key, game.game.gamestate, game.game.constants, e) !== false) {
              game.game.status.hasUpdate = true;
          }
        }
      },
      /*
       * Handler for touchmove
       */
      touchmove: function (e) {
        if (game.game.status.isRunning) {
          let move = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
            deltaX: e.touches[0].pageX - game.data.mousemove.x,
            deltaY: e.touches[0].pageY - game.data.mousemove.y
          }
          if (game.game.fn.onmove(move, game.game.gamestate, game.game.constants, e) !== false) {
              game.game.status.hasUpdate = true;
          }
        }
        game.data.mousemove.x = e.touches[0].pageX;
        game.data.mousemove.y = e.touches[0].pageY;
      },
      /*
       * Handler for mousemove
       */
      mousemove: function (e) {
        if (game.game.status.isRunning) {
          let move = {
            x: e.x,
            y: e.y,
            deltaX: e.movementX,
            deltaY: e.movementY
          }
          if (game.game.fn.onmove(move, game.game.gamestate, game.game.constants, e) !== false) {
              game.game.status.hasUpdate = true;
          }
        }
      },
      /*
       * Handles update timer
       */
      update: function () {
        if (game.game.status.isRunning) {
          if (game.game.fn.next(game.game.gamestate, game.game.constants) !== false) {
              game.game.status.hasUpdate = true;
          }
        }
      },
      /*
       * Handles render timer
       */
      render: function () {
        // Sets up the next timeout
        if (game.game.status.isRunning) {
          // Check if any update is available
          if (game.game.status.hasUpdate) {
            game.game.status.hasUpdate = false;
            if (game.game.fn.stop(game.game.gamestate, game.game.constants)) {
              game.stop();
            } else {
              game.pointers.canvas.ctx.canvas.width  = window.innerWidth;
              game.pointers.canvas.ctx.canvas.height = window.innerHeight
              game.game.fn.render(game.game.gamestate, game.game.constants, game.pointers.canvas.canvas, game.pointers.canvas.ctx);
            }
          }
          game.pointers.timers.render = setTimeout(game.utils.render, game.game.settings.canvasupdate);
        }
      },
    },
    /*
     * Sets up the game enviroment
     * @param {number} [framerate=30]
     * @param {*} [gamestate=null]
     * @param {*} [constants=null]
     * @param {function} [init=null]
     * @param {function} [render=null]
     * @param {function} [next=null]
     * @param {function} [onmove=null]
     * @param {function} [onkey=null]
     * @param {function} [stop=null]
     * @param {object} [settings={}]
     */
    setup: function (framerate = 30, gamestate = null, constants = null, init = null, render = null, next = null, onmove = null, onkey = null, stop = null, settings = {}) {
      // Copy data
      game.game.settings.framerate = Math.floor(1000 / framerate);
      game.game.settings.canvasupdate = Math.floor(Math.min(1000 / framerate, 5));
      if (gamestate !== null) game.game.gamestate = gamestate;
      if (constants !== null) game.game.constants = constants;
      // Check settings
      if (settings.fullscreen === true) game.game.settings.fullscreen = true;
      // Copy functions
      if (init !== null) game.game.fn.init = init;
      if (render !== null) game.game.fn.render = render;
      if (next !== null) game.game.fn.next = next;
      if (onmove !== null) game.game.fn.onmove = onmove;
      if (onkey !== null) game.game.fn.onkey = onkey;
      if (stop !== null) game.game.fn.stop = stop;
      // Setup canvas
      game.pointers.canvas.canvas = document.getElementById('game');
      game.pointers.canvas.ctx = game.pointers.canvas.canvas.getContext('2d');
      // Setup event listeners
      if (game.game.fn.onkey !== null) {
        document.addEventListener('keydown', game.utils.keydown);
      }
      if (game.game.fn.onmove !== null) {
        game.pointers.canvas.canvas.addEventListener('mousemove', game.utils.mousemove);
        game.pointers.canvas.canvas.addEventListener('touchmove', game.utils.touchmove);
      }
      // Is ready
      game.game.status.isSetup = true;
    },
    /*
     * Starts the game
     * @returns {boolean} true if sucessful, false otherwise
     */
    start: function () {
      // Check if ready
      if (!game.game.status.isSetup) {
        console.warn('You must setup the game before running it');
        return false;
      }
      // Check if needs fullscreen (needs user gesture)
      if (game.game.settings.fullscreen) {
        if (game.pointers.canvas.canvas.requestFullscreen) {
          game.pointers.canvas.canvas.requestFullscreen();
          game.game.status.fullscreen = true;
        } else if (game.pointers.canvas.canvas.mozRequestFullScreen) {
          game.pointers.canvas.canvas.mozRequestFullScreen();
          game.game.status.fullscreen = true;
        } else if (game.pointers.canvas.canvas.webkitRequestFullscreen) {
          game.pointers.canvas.canvas.webkitRequestFullscreen();
          game.game.status.fullscreen = true;
        } else if (game.pointers.canvas.canvas.msRequestFullscreen) {
          game.pointers.canvas.canvas.msRequestFullscreen();
          game.game.status.fullscreen = true;
        }
      }
      // Initializes game
      if (game.game.fn.init !== null) {
        game.game.fn.init(game.game.gamestate, game.game.constants, game.pointers.canvas.canvas, game.pointers.canvas.ctx);
      }
      // Setup timers
      if (game.game.fn.next !== null) {
        game.pointers.timers.update = setInterval(game.utils.update, game.game.settings.framerate);
      }
      if (game.game.fn.render !== null) {
        game.pointers.timers.render = setTimeout(game.utils.render, game.game.settings.canvasupdate);
      }
      // Start
      game.game.status.isRunning = true;
      // Return sucessful
      return true;
    },
    /*
     * Stops the game execution
     */
    stop: function () {
      // Stop
      game.game.status.isRunning = false;
      // Stop timers
      clearInterval(game.pointers.timers.update);
      clearTimeout(game.pointers.timers.render);
      // Exit fullscreen
      if (game.game.status.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          game.game.status.fullscreen = false;
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
          game.game.status.fullscreen = false;
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
          game.game.status.fullscreen = false;
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
          game.game.status.fullscreen = false;
        }
      }
    }
  }

  window.game = game;
})(this,document);