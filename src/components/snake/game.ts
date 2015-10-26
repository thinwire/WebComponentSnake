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

            // Check collisions
            var collision = this.getMask(x, y);
            
            // Mark old tail value as no longer masked...
            this.setMask(this.tail.getX(), this.tail.getY(), false);
            
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
                case 37:
                    dx = -1;
                    update = true;
                    break;
                case 39:
                    dx = 1;
                    update = true;
                    break;
                case 38:
                    dy = -1;
                    update = true;
                    break;
                case 40:
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

            ax = (Math.random() * this.levelWidth) | 0;
            ay = (Math.random() * this.levelHeight) | 0;
            this.apple.setPosition(ax, ay);

            this.score++;
        }
    }

    public drawLevel(): void {
        var ctx = this.context;
        var gridColor = '#555512';
        var gridShadowColor = '#999912';

        var snakeBody = '#12cc16';
        var snakeHead = '#12ff16';
        var snakeTail = '#129616';

        var apple = '#ff1212';

        if (this.gameOver) {
            snakeBody = '#cc1216';
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
        ctx.globalCompositeOperation = 'lighten';
        
        // Draw apple
        ctx.fillStyle = apple;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 32;
        this.drawNode(this.apple.getX(), this.apple.getY());
        
        //
        // Draw snake
        //
        
        // First draw snake body
        ctx.shadowBlur = 12;
        ctx.shadowColor = snakeBody;
        ctx.fillStyle = snakeBody;
        var node = tail.getNext();
        while (node != head) {
            this.drawNode(node.getX(), node.getY());
            node = node.getNext();
        }

        // Then draw the tail
        ctx.shadowBlur = 14;
        ctx.shadowColor = snakeTail;
        ctx.fillStyle = snakeTail;
        this.drawNode(tail.getX(), tail.getY());

        // And finally the head
        ctx.shadowBlur = 18;
        ctx.shadowColor = snakeHead;
        ctx.fillStyle = snakeHead;
        this.drawNode(head.getX(), head.getY());
    }

    private drawNode(x: number, y: number): void {
        this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
    }

};
