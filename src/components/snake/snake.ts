/**
 * Snake game logic
 */

/// <reference path="../lib/polymer.d.ts" />
/// <reference path="game.ts" />

(function() {

    var _snake = null;

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
            
            var update = (t: number) => {

                //
                // game.speed is used to drive the update loop.
                // in this case, it's a very confusingly named
                // variable, and instead should be named something
                // along the lines of 'loopDelay' - that is, making
                // speed _smaller_ makes the game go _faster_.
                //

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
                
                if(this.game.isGameOver()) {
                    if(this.onGameOver != null) {
                        this.onGameOver();
                    }
                }
                
                this.game.drawLevel();
                requestAnimationFrame(update);
            };

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
            if (_snake != null && oldValue != newValue) {
                _snake.setSpeed(newValue);
            }
        },
        
        ready: function() {
            var canvas = this.$.gamecanvas;
            _snake = new Snake(canvas);
            _snake.onScoreChange = (score: number) => {
                this._setScore(score);
            };
            _snake.onGameOver = () => {
                this._setGameover(true);
            };
            _snake.start();
        }
    });

})();
