(function() {

    var snake: any = document.getElementsByTagName("x-snake")[0];
    var starfield: any = document.getElementsByTagName("x-starfield")[0];
    var score: any = document.getElementsByTagName("x-score")[0];
    
    starfield.speed = 0.25;
    
    snake.addEventListener("score-changed", (e) => {
        // Update value directly the score counter
        // Multiply that by a random value, it looks a bit cooler.
        score.value = snake.score * 9;
        
        // Increase game speed by 10 percent for every bit of score
        // the player gets.
        
        // Recalculate speed for the snake...
        var d = Math.max(1,snake.speed * .1);
        snake.speed -= d;
        
        // And then again for the starfield.
        // Actually, make that 1% increase, the stars
        // get rather fast rather quickly...
        d = Math.max(0.001,starfield.speed * 0.01);
        starfield.speed += d;
    });
    
    snake.addEventListener("gameover-changed", (e) => {
        if(snake.gameover == true) {
            starfield.speed = 0;
            
            var text = document.createElement("h1");
            text.innerHTML = "Game Over";
            document.body.appendChild(text);
        }
    });

})();
