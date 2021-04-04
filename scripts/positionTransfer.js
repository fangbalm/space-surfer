// --- positionTransfer --- //

class TransferPosition {
    constructor(level) {
        this.level = level;
        this.fontSize = 140;
        this.fontColor = 255;
    }
    update(play) {

        this.fontSize -= 1;
        this.fontColor -= 1.5;
        if (this.fontSize < 1) {
            play.goToPosition(new InGamePosition(play.setting, this.level));
        }

    }
    draw(play) {

        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = this.fontSize + "px Orbitron";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255, " + this.fontColor + ", " + this.fontColor + ", 1";
        ctx.fillText("Get ready for level " + this.level, play.width / 2, play.height / 2);

    }
}




