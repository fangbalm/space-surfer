function Sounds(){

}

Sounds.prototype.init = function(){

    this.audioArray = ['/sounds/phaseJump1.mp3', '/sounds/pepSound2.mp3', '/sounds/zapThreeToneDown.mp3', '/sounds/pepSound1.mp3']
    this.allSounds = [];

    for(let i = 0; i < this.audioArray.length; i++){
        this.allSounds[i] = new Audio(); 
        this.allSounds[i].src = this.audioArray[i]; 
        this.allSounds[i].setAttribute('preload', 'auto')
    }

}

Sounds.prototype.playAudio = function(audioName){
    let soundNum; 

    switch(audioName){
        case 'phaseJump1':
            soundNum = 0; 
            break;
        case 'pepSound2':
            soundNum = 1; 
            break;
        case 'zapThreeToneDown': 
            soundNum = 2;
            break; 
        case 'pepSound1': 
            soundNum = 3;
            break; 
        default: 
            break; 
    }

    this.allSounds[soundNum].play(); 
    this.allSounds[soundNum].currentTime = 0; 
    
    
}

Sounds.prototype.mute = function(){
    
}