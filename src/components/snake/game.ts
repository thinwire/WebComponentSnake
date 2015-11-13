/**
 * Game logic
 */ 
namespace game {

    var wrap = function(value: number, min: number, max: number): number {
        var v0 = value - min;
        var d = max - min;
        var v1 = v0 - (((v0 / d) | 0) * d);
        return min + v1 + (v1 < .0 ? d : .0);
    };

    export class SnakePart {
        private prev: SnakePart;
        private next: SnakePart;

        private pos_x: number;
        private pos_y: number;

        constructor() {
            this.prev = null;
            this.next = null;
            this.pos_x = 0;
            this.pos_y = 0;
        }

        public setPosition(x: number, y: number): void {
            this.pos_x = x;
            this.pos_y = y;
        }

        public getX(): number {
            return this.pos_x;
        }

        public getY(): number {
            return this.pos_y;
        }

        public getNext(): SnakePart {
            return this.next;
        }

        public getPrev(): SnakePart {
            return this.prev;
        }

        public remove(): void {
            if (this.prev != null) {
                this.prev.next = this.next;
            }
            if (this.next != null) {
                this.next.prev = this.prev;
            }
            this.prev = null;
            this.next = null;
        }

        public addAfter(part: SnakePart): void {
            this.remove();

            this.next = part.next;
            if (this.next != null) {
                this.next.prev = this;
            }
            this.prev = part;
            part.next = this;
        }
    }

    export class Snake {

        private tail: SnakePart; // First link in the list
        private head: SnakePart; // Last link in the list
        private partCount: number; // Number of parts in snake
        
        private mask: boolean[];

        private level_w: number;
        private level_h: number;

        private move_x: number;
        private move_y: number;

        private dir_x: number;
        private dir_y: number;

        public constructor(w: number, h: number) {
            this.level_w = w;
            this.level_h = h;

            this.tail = null;
            this.head = null;
            this.partCount = 0;

            this.dir_x = 0;
            this.dir_y = 0;

            this.mask = new Array(w * h);

            this.init(5, 5);
        }

        public init(startX: number, startY: number): void {
            // Remove all snake parts
            var part = this.tail;
            while (part != null) {
                var next = part.getNext();
                part.remove();
                part = next;
            }

            this.tail = null;
            this.head = null;
            this.partCount = 0;

            this.clearMask();
            for (var i = 0; i < 5; ++i) {
                this.addPart(startX, startY);
            }
            this.move_x = 0;
            this.move_y = 0;
            this.dir_x = 1;
            this.dir_y = 0;
        }

        private clearMask(): void {
            for (var i = 0; i < this.level_w * this.level_h; ++i) {
                this.mask[i] = false;
            }
        }

        private setMask(x: number, y: number, value: boolean): void {
            if (x >= 0 && x < this.level_w &&
                y >= 0 && y < this.level_h) {
                this.mask[y * this.level_w + x] = value;
            }
        }

        private getMask(x: number, y: number): boolean {
            if (x >= 0 && x < this.level_w &&
                y >= 0 && y < this.level_h) {
                return this.mask[y * this.level_w + x];
            }
            return false;
        }

        public getHead(): SnakePart {
            return this.head;
        }

        public getTail(): SnakePart {
            return this.tail;
        }

        public getDX(): number {
            return this.dir_x;
        }

        public getDY(): number {
            return this.dir_y;
        }

        public getX(): number {
            return this.head.getX();
        }

        public getY(): number {
            return this.head.getY();
        }

        public setPosition(x: number, y: number): void {
            this.head.setPosition(x, y);
        }

        public updateMovement(dx: number, dy: number) {
            this.move_x = dx;
            this.move_y = dy;
        }

        private handleMovement(dx: number, dy: number) {
            if (dx != 0) {
                if (this.dir_x == 0) {
                    this.dir_y = 0;
                    this.dir_x = dx > 0 ? 1 : -1;
                }
            }

            if (dy != 0) {
                if (this.dir_y == 0) {
                    this.dir_x = 0;
                    this.dir_y = dy > 0 ? 1 : -1;
                }
            }
        }

        public addPart(x: number = -1, y: number = -1): void {
            var part = new SnakePart();
            if (this.head != null) {
                part.addAfter(this.head);
            } else {
                this.tail = part;
            }
            if (x == -1 || y == -1) {
                part.setPosition(this.head.getX(), this.head.getY());
            } else {
                part.setPosition(x, y);
            }
            this.setMask(x, y, true);

            this.head = part;
            this.partCount++;
        }

        public step(): boolean {

            // Update movement variables based on input
            this.handleMovement(this.move_x, this.move_y);
            this.move_x = 0;
            this.move_y = 0;

            // Calculate new coordinates, wrapping snake around
            // if outside level 
            var x = wrap(this.head.getX() + this.dir_x, 0, this.level_w);
            var y = wrap(this.head.getY() + this.dir_y, 0, this.level_h);

            // Mark old tail value as no longer masked...
            this.setMask(this.tail.getX(), this.tail.getY(), false);

            // Check collisions
            // We do this after unmasking the old tail in order to support
            // more Nokia-like snake behavior, allowing you to more tightly
            // chase and evade your own tail. 
            var collision = this.getMask(x, y);
            
            // Unlink old tail and make it the new head
            var t = this.tail;
            this.tail = this.tail.getNext();
            t.addAfter(this.head);
            t.setPosition(x, y);
            this.head = t;
            
            // Error elimination: mark the new tail as used
            // new tail can be the same as old tail iff snake
            // has grown
            this.setMask(this.tail.getX(), this.tail.getY(), true);
            
            // Mark new head as used
            this.setMask(this.head.getX(), this.head.getY(), true);

            // Return true if we're still good to go
            return !collision;
        }
    }

    export class Apple {
        private pos_x: number;
        private pos_y: number;

        public constructor() {
            this.pos_x = -1;
            this.pos_y = -1;
        }

        public setPosition(x: number, y: number): void {
            this.pos_x = x;
            this.pos_y = y;
        }

        public getX(): number {
            return this.pos_x;
        }

        public getY(): number {
            return this.pos_y;
        }

    }

}

class SnakeGame {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private levelWidth: number;
    private levelHeight: number;
    private tileWidth: number;
    private tileHeight: number;

    private apple: game.Apple;
    private snake: game.Snake;

    private gameOver: boolean;

    private speed: number;
    private score: number;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.levelWidth = 25;
        this.levelHeight = 25;
        this.tileWidth = 20;
        this.tileHeight = 20;

        this.canvas.width = this.levelWidth * this.tileWidth;
        this.canvas.height = this.levelHeight * this.tileHeight;

        this.apple = new game.Apple();
        this.snake = new game.Snake(this.levelWidth, this.levelHeight);

        this.apple.setPosition(10, 10);

        this.speed = 130;
        this.score = 0;
        this.gameOver = false;

        window.addEventListener('keydown', (e) => {
            var dx = 0, dy = 0, update = false;
            switch (e.keyCode) {
                case 37:        // Left arrow
                    dx = -1;
                    update = true;
                    break;
                case 39:        // Right arrow
                    dx = 1;
                    update = true;
                    break;
                case 38:        // Up arrow
                    dy = -1;
                    update = true;
                    break;
                case 40:        // Down arrow
                    dy = 1;
                    update = true;
                    break;
            }

            if (update) {
                this.snake.updateMovement(dx, dy);
                e.preventDefault();
            }
        });
    }

    public setSpeed(s: number): void {
        this.speed = s;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getScore(): number {
        return this.score;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    /**
     * Game logic update loop
     */
    public update(): void {
        if (this.gameOver) return;

        var ok = this.snake.step();
        if (!ok) {
            this.gameOver = true;
        }
        
        // If the snake eats an apple, grow it
        var ax = this.apple.getX();
        var ay = this.apple.getY();

        if (this.snake.getX() == ax && this.snake.getY() == ay) {
            this.snake.addPart();

            // Randomize Apple position. Note, that the Apple can
            // occupy any tile, even one currently occupied by the
            // snake body. This is by design: eliminating this behavior
            // in a constant-time fashion would require surprisingly
            // complex code and would make this example a lot harder
            // to follow.
            ax = (Math.random() * this.levelWidth) | 0;
            ay = (Math.random() * this.levelHeight) | 0;
            this.apple.setPosition(ax, ay);

            this.score++;
        }
    }

    /**
     * Main game render loop
     */
    public drawLevel(): void {
        var ctx = this.context;
        var gridColor = '#127912';
        var gridShadowColor = '#999912';

        var snakeHead = '#12ff16';
        var snakeTail = '#129616';

        var apple = '#ff1212';

        if (this.gameOver) {
            snakeHead = '#ff1216';
            snakeTail = '#961216';
        }

        var tail = this.snake.getTail();
        var head = this.snake.getHead();

        // Reset shadow offsets
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalCompositeOperation = 'source-over';
        
        // Clear level
        ctx.clearRect(0, 0, this.levelWidth * this.tileWidth, this.levelHeight * this.tileHeight);
        
        // Draw grid
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.shadowColor = gridShadowColor;
        ctx.shadowBlur = 5;
        for (var x = 0; x <= this.levelWidth; ++x) {
            ctx.moveTo(x * this.tileWidth, 0);
            ctx.lineTo(x * this.tileWidth, this.tileHeight * this.levelHeight);
        }
        for (var y = 0; y <= this.levelHeight; ++y) {
            ctx.moveTo(0, y * this.tileHeight);
            ctx.lineTo(this.tileWidth * this.levelWidth, y * this.tileHeight);
        }
        ctx.stroke();
        ctx.beginPath();

        // Draw game objects
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'lighten';
        
        // Draw apple
        ctx.fillStyle = apple;
        this.drawApple(this.apple.getX(), this.apple.getY());
        
        //
        // Draw snake
        //
        
        // First draw snake body
        this.drawSnakeBody(ctx);
        
        // Then draw the tail
        ctx.shadowBlur = 14;
        ctx.shadowColor = snakeTail;
        ctx.fillStyle = snakeTail;
        this.drawRect(tail.getX(), tail.getY());

        // And finally the head
        ctx.shadowBlur = 18;
        ctx.shadowColor = snakeHead;
        ctx.fillStyle = snakeHead;
        this.drawRect(head.getX(), head.getY());
    }

    private drawSnakeBody(ctx: CanvasRenderingContext2D) {
        
        // This routine draws the entire snake body using a color
        // cycling effect.
        
        var tail = this.snake.getTail();
        var head = this.snake.getHead();
        
        var green_base = 190;        // Base green value
        var green_variance = 50;     // amount to vary (base +/- this value)
        var offset = Math.PI * 0.12; // Amount to shift per block, in radians.
        var i = 0, g, color;         // State variables
        var time = Date.now();       // Current time to allow for time-based cycling
        
        // Set shadow blur value to give the snake a cool glow
        ctx.shadowBlur = 12;
        
        var node = tail.getNext();
        while (node != head) {
            
            // Calculate green color value.
            // We take the base value and add to that the sine (range +/- 1 based on input)
            // of the current timestamp, scaled down, and add to that input an offset 
            // based on how many snake parts we've processed already. To get the final value,
            // we multiply the sine by the green variance (to get base +/- variance), and
            // truncate the value to an integer. 
            g = (green_base + Math.sin(time * -0.01 + offset * i) * green_variance) | 0;
            
            // Next, we form a CSS color value string
            color = 'rgba(10,' + g + ',10,1.0)';
            
            // Assign color the the drawing context
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            
            // Then ask it to draw a rectangle
            this.drawRect(node.getX(), node.getY());
            
            // Advance to the next node
            node = node.getNext();
            
            // Increment counter (we're using this for the effect offset, remember? :))
            i++;
        }

    }

    private drawRect(x: number, y: number): void {
        this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
    }
    
    private drawApple(x: number, y: number): void {

        // Values for finding correct coordinates for apple
        var w = this.tileWidth;
        var h = this.tileHeight;
        var w2 = w * 0.5;
        var h2 = h * 0.5;
        
        // Let's do an effect here too, and have the apple pulse along with the time
        
        // We need the time...
        var time = Date.now();
        
        // We need base size values
        var r_base = w2 * 1.15;
        var r_variance = w2 * 0.25;
        
        // Calculate a new radius 'r'
        var r = r_base + Math.sin(time * 0.0023) * r_variance;
        
        var ctx = this.context;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 32;
       
        this.context.beginPath();
        this.context.arc(x * w + w2, y * h + h2, r, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.beginPath();
    }

};
