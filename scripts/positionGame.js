function InGamePosition(setting, level){ 
    this.setting = setting; 
    this.level = level; 
    this.object = null; 
    this.surfer = null; 
    this.bullets = []; 
    this.lastBulletTime = null; 
    this.crabs = []; 
    this.shells = [];

}

InGamePosition.prototype.shoot = function(){
    if(this.lastBulletTime === null || ((new Date().getTime() - this.lastBulletTime) > (this.setting.bulletMaxFrequency))){

    this.object = new Objects(); 
    this.bullets.push(this.object.bullet(this.surfer.x, this.surfer.y - this.surfer.height / 2, this.setting.bulletSpeed));
    this.lastBulletTime = (new Date().getTime());

    }

}

InGamePosition.prototype.update = function(play){

    const surfer = this.surfer; 
    const surferSpeed = this.setting.surferSpeed; 
    const updateSec = this.setting.updateSeconds;
    const bullets = this.bullets; 
    
    if(play.pressedKeys[37]){
        this.surfer_image.src = "/images/astro-left.png"
        surfer.x -= surferSpeed * updateSec;
    }

    if(play.pressedKeys[39]){
        this.surfer_image.src = "/images/astro-right.png"
        surfer.x += surferSpeed * updateSec;
        
    }

    if(play.pressedKeys[32]){
        this.shoot(); 
        console.log("SHOOTING")
    }

    // if user fires, 

    if(surfer.x < play.playBoundaries.left) { 
        surfer.x = play.playBoundaries.left;
    }

    if(this.surfer.x > play.playBoundaries.right) { 
        this.surfer.x = play.playBoundaries.right;
    }

    for(let i = 0; i < bullets.length; i++){
        let bullet = bullets[i]; 
        bullet.y -= updateSec * this.setting.bulletSpeed;
        if(bullet.y < 0){
            bullets.splice(i--, 1); 
        }
    }

    let reachedSide = false; 

    for(let i = 0; i < this.crabs.length; i++){
        let crab = this.crabs[i]; 

        let fresh_x = crab.x + this.crabSpeed * updateSec * this.turnAround * this.horizontalMove;
        let fresh_y = crab.y + this.crabSpeed * updateSec * this.verticalMove;

        if(fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left){
            this.turnAround *= -1; 
            reachedSide = true; 
            this.horizontalMove = 0; 
            this.verticalMove = 1; 
            this.crabsAreSinking = true;
        }

        if(reachedSide !== true){
            crab.x = fresh_x; 
            crab.y = fresh_y; 
        }
        
    }

    if(this.crabsAreSinking == true){
        this.crabPresentSinkingValue += this.crabSpeed * updateSec; 
        if(this.crabPresentSinkingValue >= this.setting.crabSinkingValue){
            this.crabsAreSinking = false; 
            this.verticalMove = 0; 
            this.horizontalMove = 1; 
            this.crabPresentSinkingValue = 0; 
        }
    }


    const frontLineCrabs = []; 
    for(let i = 0; i < this.crabs.length; i++){
        let crab = this.crabs[i]; 
        if(!frontLineCrabs[crab.column] || frontLineCrabs[crab.column].line < crab.line){
            frontLineCrabs[crab.column] = crab; 
        }
    }

    for(let i = 0; i < this.setting.crabColumns; i++){
        let crab = frontLineCrabs[i]; 
        if(!crab) continue; 
        let shellChance = this.shellFrequency * updateSec; 
        this.object = new Objects(); 
        if(shellChance > Math.random()) {
            this.shells.push(this.object.shell(crab.x, crab.y + crab.height / 2));
        }
    }

    for(let i = 0; i < this.shells.length; i++){
        let shell = this.shells[i]; 
        shell.y += updateSec * this.shellSpeed;
        if(shell.y > this.height){
            this.shells.splice(i--, 1)
        }
    }

    for(let i = 0; i < this.crabs.length; i++){
        let crab = this.crabs[i];
        let collision = false; 
        for(let x = 0; x < bullets.length; x++){
            let bullet = bullets[x]; 

            if(bullet.x >= (crab.x - crab.width / 2) && bullet.x <= (crab.x + crab.width / 2) && 
               bullet.y >= (crab.y - crab.height /2 ) && bullet.y <=(crab.y + crab.height / 2)){
                   bullets.splice(x--, 1); 
                   collision = true; 
            }
        }

        if (collision == true){
            this.crabs.splice(i--, 1);
        }
     }
     


};

InGamePosition.prototype.entry = function(play){
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

    for(line = 0; line < lines; line++){
        for(column = 0; column < columns; column++){
            this.object = new Objects(); 
            let x, y; 
            x = (play.width / 2) + (column * 50) - ((columns - 1) * 25);
            y = (play.playBoundaries.top + 30) + (line * 30); 
            crabsInitial.push(this.object.crab(x, y, line, column, this.crab_image))
            
        }
    }

    this.crabs = crabsInitial;

    
}


InGamePosition.prototype.draw = function(play){


    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.surfer_image, this.surfer.x - (this.surfer.width / 2), this.surfer.y - (this.surfer.height / 2)); 

    for (let i = 0; i < this.bullets.length; i++){
        let bullet = this.bullets[i]; 
        let wave = new Image(); 
        wave.src = "/images/wave.png"
        ctx.drawImage(wave, bullet.x-1, bullet.y-1)
    }

    for(let i = 0; i < this.crabs.length; i++){
        let crab = this.crabs[i]; 
        ctx.drawImage(this.crab_image, crab.x - (crab.width / 2), crab.y - (crab.height / 2));
    }

    for (let i = 0; i < this.shells.length; i++){
        let shell = this.shells[i]; 
        let shell_img = new Image(); 
        shell_img.src = "/images/seashell.png"
        ctx.drawImage(shell_img, shell.x-2, shell.y)
    }



}

InGamePosition.prototype.keyDown = function (play, keyboardCode) {
    // more code
    
}

