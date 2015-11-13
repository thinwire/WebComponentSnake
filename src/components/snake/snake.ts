/**
 * Snake game logic
 */

/// <reference path="../lib/polymer.d.ts" />
/// <reference path="game.ts" />

(function() {

    class Snake {
        private game: SnakeGame;
        private tm: number;

        private score: number = 0;
        public onScoreChange: Function = null;
        
        public onGameOver: Function = null;

        public constructor(canvas: HTMLCanvasElement) {
            this.game = new SnakeGame(canvas);
        }

        public setSpeed(spd: number): void {
            var s = Math.max(spd, 5);
            s = Math.min(spd, 1000);
            this.game.setSpeed(s);
        }

        public start() {
            this.tm = 0;
            this.game.drawLevel();

            // Define our decoupled update loop            
            var update = (t: number) => {

                //
                // game.speed is used to drive the update loop.
                // in this case, it's a very confusingly named
                // variable, and instead should be named something
                // along the lines of 'loopDelay' - that is, making
                // speed _smaller_ makes the game go _faster_.
                //

                // Decoupled game logic: the game logic runs on a close
                // approximation of 'when it should', while the draw loop
                // runs whenever it can.
                if (this.tm == 0) {
                    this.tm = t;
                } else {
                    var spd = this.game.getSpeed();
                    while (t - this.tm >= spd) {
                        this.tm += spd;
                        this.game.update();
                    }
                }

                // Notify of score change to the outside..
                if(this.onScoreChange != null) {
                    var l = this.game.getScore();
                    if(this.score != l) {
                        this.score = l;
                        this.onScoreChange(l);
                    }
                }

                // If game over state is triggered, notify the outside                
                if(this.game.isGameOver()) {
                    if(this.onGameOver != null) {
                        this.onGameOver();
                    }
                }
                
                // Always draw the game level
                this.game.drawLevel();
                requestAnimationFrame(update);
            };

            // Run requestAnimationFrame once to bootstrap the main loop
            requestAnimationFrame(update);
        }
    }

    Polymer({

        is: 'x-snake',

        properties: {

            gameover: {
                type: Boolean,
                readOnly: true,
                notify: true,
                value: false
            },

            speed: {
                type: Number,
                value: 150,
                readOnly: false,
                reflectToAttribute: true,
                observer: '_speedchanged'
            },

            score: {
                type: Number,
                readOnly: true,
                notify: true
            }

        },

        _speedchanged: (newValue: number, oldValue: number): void => {
            if (this._snake != null && oldValue != newValue) {
                this._snake.setSpeed(newValue);
            }
        },
        
        ready: function() {
            var canvas = this.$.gamecanvas;
            this._snake = new Snake(canvas);
            this._snake.onScoreChange = (score: number) => {
                this._setScore(score);
            };
            this._snake.onGameOver = () => {
                this._setGameover(true);
            };
            this._snake.start();
        },
        
        _snake: null
    });

})();
