(function() {

    var snake: any = document.getElementsByTagName("x-snake")[0];
    var starfield: any = document.getElementsByTagName("x-starfield")[0];
    var score: any = document.getElementsByTagName("x-score")[0];
    
    starfield.speed = 0.25;
    
    snake.addEventListener("score-changed", (e) => {
        score.value = snake.score;
        snake.speed -= 1;
        starfield.speed += 0.2;
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
