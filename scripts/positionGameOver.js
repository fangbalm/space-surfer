class GameOverPosition {
    constructor() {
    }
    draw(play) {
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = "40px Orbitron";
        ctx.textAlign = "center";
        ctx.fillStyle = '#ffffff';
        ctx.fillText("Game Over!", play.width / 2, play.height / 2 - 120);

        ctx.font = "36px Orbitron";
        ctx.fillStyle = '#D7DF01';
        ctx.fillText("You've reached level " + play.level + " and your score is " + play.score + ".", play.width / 2, play.height / 2 - 40);

        ctx.font = "36px Orbitron";
        ctx.fillStyle = '#D7DF01';
        ctx.fillText("Press 'Space' to continue.", play.width / 2, play.height / 2 + 40);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 32) {
            play.goToPosition(new OpeningPosition());
        }
    }
}


