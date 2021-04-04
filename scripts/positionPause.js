function PausePosition(){

}

PausePosition.prototype.draw = function(play){
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font="40px Orbitron"; 
    ctx.fillStyle = "#ffffff"; 
    ctx.textAlign = 'center'; 
    ctx.fillText("Paused", play.width / 2, play.height/2 - 300);
};

PausePosition.prototype.keyDown = function(play, keyboardCode){

};