/**
 * Starfield effect logic
 */

/// <reference path="../lib/polymer.d.ts" />

(function() {

    class Star {
        public x: number;
        public y: number;
        public z: number;
    }

    class Starfield {

        private canvas: HTMLCanvasElement;
        private context: CanvasRenderingContext2D;
        private width: number;
        private height: number;

        private speed: number;
        private zfar: number;
        private znear: number;
        private stars: Star[];

        private tm_prev: number;

        public constructor(canvas: HTMLCanvasElement) {
            this.width = canvas.width = 500;
            this.height = canvas.height = 500;
            this.canvas = canvas;
            this.context = canvas.getContext('2d');

            this.speed = 2;
            this.znear = 1;
            this.zfar = 10;
            this.stars = [];

            this.tm_prev = 0;

            for (var i = 0; i < 100; ++i) {
                this.addStar();
            }

            this.init();

            var update = (tm: number) => {
                this.update(tm);
                this.draw();
                requestAnimationFrame(update);
            };

            update(0);
        }

        public setSpeed(spd: number): void {
            this.speed = spd;
        }

        public getSpeed(): number {
            return this.speed;
        }

        public setZNear(near: number): void {
            this.znear = Math.abs(near) + 0.001;
            if (this.znear >= this.zfar) {
                this.zfar = this.znear + 1;
            }
            this.init();
        }

        public setZFar(far: number): void {
            this.zfar = Math.abs(far);
            if (this.zfar < this.znear) {
                this.zfar = this.znear + 1;
            }
            this.init();
        }

        public setStarCount(n: number): void {
            while (n != this.stars.length) {
                if (n > this.stars.length) {
                    this.addStar();
                } else {
                    this.stars.pop();
                }
            }
            this.init();
        }

        public getStarCount(): number {
            return this.stars.length;
        }

        private addStar(): void {
            this.stars.push(new Star());
        }

        private init(): void {
            for (var i = 0, l = this.stars.length; i < l; ++i) {
                var star = this.stars[i];
                star.x = (Math.random() * this.width * 3) - this.width * 1.5;
                star.y = (Math.random() * this.height * 3) - this.height * 1.5;
                star.z = (Math.random() * (this.zfar - this.znear)) + this.znear;
            }
        }

        private wrap(value: number, min: number, max: number): number {
            var v0 = value - min;
            var d = max - min;
            var v1 = v0 - (((v0 / d) | 0) * d);
            return min + v1 + (v1 < .0 ? d : .0);
        }

        public update(tm: number): void {

            var delta = (tm - this.tm_prev) / 1000.0;
            this.tm_prev = tm;
            if (delta >= 0.65 || delta == 0) return;

            for (var i = 0; i < this.stars.length; ++i) {
                var s = this.stars[i];
                s.z = this.wrap(s.z - this.speed * delta, this.znear, this.zfar);
            }

        }

        public draw(): void {
            
            var ctx = this.context;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.shadowColor = "#fff";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 16;
            ctx.fillStyle = "#fff";

            // Calculate total z range
            var zrange = this.zfar - this.znear;
            
            // Define star radius
            var r = 1.75;

            for (var i = 0; i < this.stars.length; ++i) {
                
                var s = this.stars[i];
                
                // Calculate star X/Y position on screen
                var x = 250 + (s.x / s.z) * 1.75;
                var y = 250 + (s.y / s.z) * 1.75;
                
                // Calculate alpha value based on how far away the
                // star is. We want the star to be at full brightness
                // when it's at the near Z plane
                ctx.globalAlpha = 1.0 - ((s.z - this.znear) / zrange);
                
                // Draw and fill a full arc
                ctx.beginPath();
                ctx.arc(x - r, y - r, r, 0, 2 * Math.PI, false);
                ctx.fill();
            }
            
            // Reset drawing context state
            ctx.beginPath();
            ctx.globalAlpha = 1.0;
        }
    }

    Polymer({
        is: 'x-starfield',

        properties: {
            speed: {
                type: Number,
                value: 2,
                notify: true,
                observer: '_speedchanged',
                reflectToAttribute: true
            },

            stars: {
                type: Number,
                value: 100,
                notify: true,
                observer: '_starschanged',
                reflectToAttribute: true
            },

            znear: {
                type: Number,
                value: 1,
                notify: true,
                observer: '_znearchanged',
                reflectToAttribute: true
            },

            zfar: {
                type: Number,
                value: 10,
                notify: true,
                observer: '_zfarchanged',
                reflectToAttribute: true
            }
        },

        _speedchanged: function(newValue: number, oldValue: number) {
            if(this._starfield)
            this._starfield.setSpeed(newValue);
        },

        _starschanged: function(newValue: number, oldValue: number) {
            if(this._starfield)
            this._starfield.setStarCount(newValue);
        },

        _znearchanged: function(newValue: number, oldValue: number) {
            if(this._starfield)
            this._starfield.setZNear(newValue);
        },

        _zfarchanged: function(newValue: number, oldValue: number) {
            if(this._starfield)
            this._starfield.setZFar(newValue);
        },

        ready: function() {
            this._starfield = new Starfield(this.$.content);
        },
        
        _starfield: null
    });

})();
