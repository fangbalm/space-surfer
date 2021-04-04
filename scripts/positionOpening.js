// --- positionOpening --- //

class OpeningPosition {
    constructor() {
    }
    draw(play) {

        // UFO Hunter
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = 'bold 80px Roboto Mono';
        ctx.textAlign = "center";
        const gradient = ctx.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
        gradient.addColorStop("0", "red");
        gradient.addColorStop("0.5", "purple");
        gradient.addColorStop("1.0", "red");
        ctx.fillStyle = gradient;
        ctx.fillText("SPACE SURFER", play.width / 2, play.height / 2 - 70);

        // Press 'Space' to start.
        function pressSpaceBlink() {
            let count = 10;
            count--;
            if (count % 2 == 1) {
                ctx.font = "25px Roboto Mono";
                ctx.fillStyle = '#D7DF01';
                ctx.fillText("PRESS 'SPACE' TO START", play.width / 2, play.height / 2);
            }
        }

        setTimeout(function () { pressSpaceBlink(); }, 500);

        ctx.font = "bold 25px Orbitron";
        ctx.fillStyle = '#D7DF01';


        // Game Controls
        ctx.fillStyle = '#2e2f00';
        ctx.fillText("Game Controls", play.width / 2, play.height / 2 + 200);

        ctx.font = "20px Orbitron";
        ctx.fillText("Left Arrow : Move Left", play.width / 2, play.height / 2 + 255);
        ctx.fillText("Right Arrow : Move Right", play.width / 2, play.height / 2 + 275);
        ctx.fillText("Space : Fire", play.width / 2, play.height / 2 + 295);
        ctx.fillText("Pause : P", play.width / 2, play.height / 2 + 315);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 32) {
            play.level = 1;
            play.score = 0;
            play.shields = 2;
            play.goToPosition(new TransferPosition(play.level));
        }
    }
}




