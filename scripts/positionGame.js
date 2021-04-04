class InGamePosition {
    constructor(setting, level) {
        this.setting = setting;
        this.level = level;
        this.object = null;
        this.surfer = null;
        this.bullets = [];
        this.lastBulletTime = null;
        this.crabs = [];
        this.shells = [];

    }
    shoot() {
        if (this.lastBulletTime === null || ((new Date().getTime() - this.lastBulletTime) > (this.setting.bulletMaxFrequency))) {

            this.object = new Objects();
            this.bullets.push(this.object.bullet(this.surfer.x, this.surfer.y - this.surfer.height / 2, this.setting.bulletSpeed));
            this.lastBulletTime = (new Date().getTime());
            play.sounds.playAudio('phaseJump1');

        }

    }
    update(play) {

        const surfer = this.surfer;
        const surferSpeed = this.setting.surferSpeed;
        const updateSec = this.setting.updateSeconds;
        const bullets = this.bullets;

        if (play.pressedKeys[37]) {
            this.surfer_image.src = "/images/astro-left.png";
            surfer.x -= surferSpeed * updateSec;
        }

        if (play.pressedKeys[39]) {
            this.surfer_image.src = "/images/astro-right.png";
            surfer.x += surferSpeed * updateSec;

        }

        if (play.pressedKeys[32]) {
            this.shoot();
        }

        // if user fires, 
        if (surfer.x < play.playBoundaries.left) {
            surfer.x = play.playBoundaries.left;
        }

        if (this.surfer.x > play.playBoundaries.right) {
            this.surfer.x = play.playBoundaries.right;
        }

        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            bullet.y -= updateSec * this.setting.bulletSpeed;
            if (bullet.y < 0) {
                bullets.splice(i--, 1);
            }
        }

        let reachedSide = false;

        for (let i = 0; i < this.crabs.length; i++) {
            let crab = this.crabs[i];

            let fresh_x = crab.x + this.crabSpeed * updateSec * this.turnAround * this.horizontalMove;
            let fresh_y = crab.y + this.crabSpeed * updateSec * this.verticalMove;

            if (fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left) {
                this.turnAround *= -1;
                reachedSide = true;
                this.horizontalMove = 0;
                this.verticalMove = 1;
                this.crabsAreSinking = true;
            }

            if (reachedSide !== true) {
                crab.x = fresh_x;
                crab.y = fresh_y;
            }

        }

        if (this.crabsAreSinking == true) {
            this.crabPresentSinkingValue += this.crabSpeed * updateSec;
            if (this.crabPresentSinkingValue >= this.setting.crabSinkingValue) {
                this.crabsAreSinking = false;
                this.verticalMove = 0;
                this.horizontalMove = 1;
                this.crabPresentSinkingValue = 0;
            }
        }


        const frontLineCrabs = [];
        for (let i = 0; i < this.crabs.length; i++) {
            let crab = this.crabs[i];
            if (!frontLineCrabs[crab.column] || frontLineCrabs[crab.column].line < crab.line) {
                frontLineCrabs[crab.column] = crab;
            }
        }

        for (let i = 0; i < this.setting.crabColumns; i++) {
            let crab = frontLineCrabs[i];
            if (!crab)
                continue;
            let shellChance = this.shellFrequency * updateSec;
            this.object = new Objects();
            if (shellChance > Math.random()) {
                this.shells.push(this.object.shell(crab.x, crab.y + crab.height / 2));
                play.sounds.playAudio('pepSound2');
            }
        }

        for (let i = 0; i < this.shells.length; i++) {
            let shell = this.shells[i];
            shell.y += updateSec * this.shellSpeed;
            if (shell.y > this.height) {
                this.shells.splice(i--, 1);
            }
        }

        for (let i = 0; i < this.crabs.length; i++) {
            let crab = this.crabs[i];
            let collision = false;
            for (let x = 0; x < bullets.length; x++) {
                let bullet = bullets[x];

                if (bullet.x >= (crab.x - crab.width / 2) && bullet.x <= (crab.x + crab.width / 2) &&
                    bullet.y >= (crab.y - crab.height / 2) && bullet.y <= (crab.y + crab.height / 2)) {
                    bullets.splice(x--, 1);
                    play.sounds.playAudio('pepSound1');
                    collision = true;
                    play.score += this.setting.pointsPerCrab;
                }
            }

            if (collision == true) {
                this.crabs.splice(i--, 1);
            }
        }



        for (let i = 0; i < this.shells.length; i++) {
            let shell = this.shells[i];
            if (shell.x + 2 >= (surfer.x - surfer.width / 2) &&
                shell.x - 2 <= (surfer.x + surfer.width / 2) &&
                shell.y + 6 >= (surfer.y - surfer.height / 2) &&
                shell.y <= (surfer.y + surfer.height / 2)) {

                this.shells.splice(i--, 1);
                play.sounds.playAudio('zapThreeToneDown');
                play.shields--;
            }
        }

        if (play.shields < 0) {
            play.goToPosition(new GameOverPosition);
        }

        if (this.crabs.length == 0) {
            play.level += 1;
            play.goToPosition(new TransferPosition(play.level));
        }

    }
    entry(play) {
        this.horizontalMove = 1;
        this.verticalMove = 0;
        this.turnAround = 1;
        this.crabsAreSinking = false;
        this.crabPresentSinkingValue = 0;
        this.updateSec = this.setting.updateSeconds;
        this.surferSpeed = this.setting.surferSpeed;
        this.surfer_image = new Image();
        this.crab_image = new Image();
        this.object = new Objects();
        this.surfer = this.object.surfer((play.width / 2), play.playBoundaries.bottom, this.surfer_image);

        let presentLevel = this.level;
        this.crabSpeed = this.setting.crabSpeed + (presentLevel * 7);

        this.shellSpeed = this.setting.shellSpeed + (presentLevel * 10);

        this.shellFrequency = this.setting.shellFrequency + (presentLevel * 0.05);

        const lines = this.setting.crabLines;
        const columns = this.setting.crabColumns;
        const crabsInitial = [];

        let line, column;

        for (line = 0; line < lines; line++) {
            for (column = 0; column < columns; column++) {
                this.object = new Objects();
                let x, y;
                x = (play.width / 2) + (column * 50) - ((columns - 1) * 25);
                y = (play.playBoundaries.top + 30) + (line * 30);
                crabsInitial.push(this.object.crab(x, y, line, column, this.crab_image));

            }
        }

        this.crabs = crabsInitial;


    }
    draw(play) {


        ctx.clearRect(0, 0, play.width, play.height);
        ctx.drawImage(this.surfer_image, this.surfer.x - (this.surfer.width / 2), this.surfer.y - (this.surfer.height / 2));

        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            let wave = new Image();
            wave.src = "/images/wave.png";
            ctx.drawImage(wave, bullet.x - 1, bullet.y - 1);
        }

        for (let i = 0; i < this.crabs.length; i++) {
            let crab = this.crabs[i];
            ctx.drawImage(this.crab_image, crab.x - (crab.width / 2), crab.y - (crab.height / 2));
        }

        for (let i = 0; i < this.shells.length; i++) {
            let shell = this.shells[i];
            let shell_img = new Image();
            shell_img.src = "/images/seashell.png";
            ctx.drawImage(shell_img, shell.x - 2, shell.y);
        }

        // draw Sound & Mute info
        ctx.font = "16px Roboto Mono";

        ctx.fillStyle = "#424242";
        ctx.textAlign = "left";
        ctx.fillText("Press S to toggle sound effects. Sound:", play.playBoundaries.left, play.playBoundaries.bottom + 70);

        let soundStatus = (play.sounds.muted === true) ? "OFF" : "ON";
        ctx.fillStyle = (play.sounds.muted === true) ? '#FF0000' : '#0B6121';
        ctx.fillText(soundStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);

        ctx.fillStyle = '#424242';
        ctx.textAlign = "right";
        ctx.fillText("Press P to Pause.", play.playBoundaries.right, play.playBoundaries.bottom + 70);

        ctx.textAlign = "center";
        ctx.fillStyle = '#BDBDBD';

        ctx.font = "bold 20px Roboto Mono";
        ctx.fillText("Score", play.playBoundaries.right, play.playBoundaries.top - 75);
        ctx.font = "30px Roboto Mono";
        ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);

        ctx.font = "bold 20px Roboto Mono";
        ctx.fillText("Level", play.playBoundaries.left, play.playBoundaries.top - 75);
        ctx.font = "30px Roboto Mono";
        ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);

        ctx.textAlign = "center";
        if (play.shields > 0) {
            ctx.fillStyle = '#BDBDBD';
            ctx.font = "bold 20px Roboto Mono";
            ctx.fillText("Shields", play.width / 2, play.playBoundaries.top - 75);
            ctx.font = "bold 30px Roboto Mono";
            ctx.fillText(play.shields, play.width / 2, play.playBoundaries.top - 25);
        }
        else {
            ctx.fillStyle = '#ff4d4d';
            ctx.font = "bold 20px Roboto Mono";
            function warningBlink() {
                let count = 10;
                count--;
                if (count % 2 == 1) {
                    ctx.font = "25px Roboto Mono";
                    ctx.fillStyle = '#ff4d4d';
                    ctx.fillText("WARNING", play.width / 2, play.playBoundaries.top - 75);
                }
            }
            setTimeout(function () { warningBlink(); }, 500);
            // ctx.fillText("WARNING", play.width / 2, play.playBoundaries.top - 75);
            ctx.fillStyle = '#BDBDBD';
            ctx.fillText("No shields left!", play.width / 2, play.playBoundaries.top - 25);
        }

    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 83) {
            play.sounds.mute();
        }

        if (keyboardCode == 80) {
            play.pushPosition(new PausePosition());
        }

    }
}










