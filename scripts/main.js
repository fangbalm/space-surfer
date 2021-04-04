// --- main --- //

// Canvas drawing
const canvas = document.getElementById('spaceCanvas');
canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

// Canvas automatic resizing
function resize() {
  // Our canvas must cover full height of screen regardless of the resolution
  const height = window.innerHeight - 20;

  // So we need to calculate the proper scaled width that should work well with every resolution
  const ratio = canvas.width / canvas.height;
  const width = height * ratio;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}
window.addEventListener('load', resize, false);

// Game Basics
function GameBasics(canvas) {

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;

  // active playing field
  this.playBoundaries = {
    top: 150,
    bottom: 650,
    left: 100,
    right: 800
  };

  // initial values
  this.level = 1;
  this.score = 0;
  this.shields = 2;

  // game settings
  this.setting = {
    //FPS: 60 frame per 1 second, this means 1 new frame in every 0,01666667 seconds  
    updateSeconds: (1 / 60),
    surferSpeed: 400,
    bulletSpeed: 130, 
    bulletMaxFrequency: 500, 

    crabLines: 4, 
    crabColumns: 8, 
    crabSpeed: 35,
    crabSinkingValue: 30, 

    shellSpeed: 75, 
    shellFrequency: 0.05, 

    pointsPerCrab: 25, 
  };

  // we collect here the different positions, states of the game 
  this.positionContainer = [];

  // pressed keys storing
  this.pressedKeys = {};
}

//  Return to current game position, status. Always returns the top element of positionContainer.
GameBasics.prototype.presentPosition = function (){
  return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
};

// Move to the desired position
GameBasics.prototype.goToPosition = function (position) {
  // If we're already in a position clear the positionContainer.
  if (this.presentPosition()) {
    this.positionContainer.length = 0;
  }
  // If we finds an 'entry' in a given position, we call it. 
  if (position.entry) {
    position.entry(play);
  }
  // Setting the current game position in the positionContainer
  this.positionContainer.push(position);
};

// Push our new position into the positionContainer 
GameBasics.prototype.pushPosition = function (position) {
  this.positionContainer.push(position);
};

// Pop the position from the positionContainer
GameBasics.prototype.popPosition = function () {
  this.positionContainer.pop();
};

// GameBasics start - Starting the loop
GameBasics.prototype.start = function () {
  //Specify the interval in milliseconds 
  setInterval(function () { gameLoop(play); }, this.setting.updateSeconds * 1000); //0,01666667 sec * 1000 = 16,67 ms
  //Go into the Opening position
  this.goToPosition(new OpeningPosition());
}

// Notifies the game when a key is pressed
GameBasics.prototype.keyDown = function (keyboardCode) {
  // store the pressed key in 'pressedKeys'
  this.pressedKeys[keyboardCode] = true;
  //console.log(this.pressedKeys);
  //  it calls the present position's keyDown function
  if (this.presentPosition() && this.presentPosition().keyDown) {
    this.presentPosition().keyDown(this, keyboardCode);
  }
};

//  Notifies the game when a key is released
GameBasics.prototype.keyUp = function (keyboardCode) {
  // delete the released key from 'pressedKeys'
  delete this.pressedKeys[keyboardCode];
};

// Game Loop
function gameLoop(play) {
  let presentPosition = play.presentPosition();

  if (presentPosition) {
    // update
    if (presentPosition.update) {
      presentPosition.update(play);
    }
    // draw
    if (presentPosition.draw) {
      presentPosition.draw(play);
    }
  }
}

// Keyboard events listening
window.addEventListener("keydown", function (e) {
  const keyboardCode = e.which || event.keyCode; // Use either which or keyCode, depending on browser support
  if (keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32) { e.preventDefault(); } //space/left/right (32/37/29)
  play.keyDown(keyboardCode);
});

window.addEventListener("keyup", function (e) {
  const keyboardCode = e.which || event.keyCode; // Use either which or keyCode, depending on browser support
  play.keyUp(keyboardCode);
});

// Create a GameBasics object
const play = new GameBasics(canvas);


play.sounds = new Sounds(); 
play.sounds.init();

play.start();




// // --- main --- //

// // Canvas drawing
// const canvas = document.getElementById('ufoCanvas');
// canvas.width = 900;
// canvas.height = 700;
// const ctx = canvas.getContext('2d');

// let f = new FontFace('Roboto Mono', 'url(https://fonts.gstatic.com/s/robotomono/v13/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_SeW-AJi8SJQtQ4Y.woff)'); 

// f.load()
// .then(function(fnt){
//     console.log(`loaded ${fnt.family}`)
// })

// // Canvas automatic resizing
// function resize() {
//   // Our canvas must cover full height of screen regardless of the resolution
//   const height = window.innerHeight - 20;

//   // So we need to calculate the proper scaled width that should work well with every resolution
//   const ratio = canvas.width / canvas.height;
//   const width = height * ratio;

//   canvas.style.width = width + 'px';
//   canvas.style.height = height + 'px';
// }
// window.addEventListener('load', resize, false);

// // Game Basics
// function GameBasics(canvas) {

//   this.canvas = canvas;
//   this.width = canvas.width;
//   this.height = canvas.height;

//   // active playing field
//   this.playBoundaries = {
//     top: 150,
//     bottom: 650,
//     left: 100,
//     right: 800
//   };

//   this.level = 1; 
//   this.score = 0; 
//   this.shields = 2; 

//   // game settings
//   this.setting = {
//     //FPS: 60 frame per 1 second, this means 1 new frame in every 0,01666667 seconds  
//     updateSeconds: (1/60), 
//   };

//   // we collect here the different positions, states of the game 
//   this.positionContainer = [];
// }

// this.pressedKeys = {}; 

// //  Return to current game position, status. Always returns the top element of positionContainer.
// GameBasics.prototype.presentPosition = function () {
//   return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
// };

// // Move to the desired position
// GameBasics.prototype.goToPosition = function (position) {
//   // If we're already in a position clear the positionContainer.
//   if (this.presentPosition()) {
//     this.positionContainer.length = 0;
//   }
//   // If we finds an 'entry' in a given position, we call it. 
//   if (position.entry) {
//     position.entry(play);
//   }
//   // Setting the current game position in the positionContainer
//   this.positionContainer.push(position);
// };

// // Push our new position into the positionContainer 
// GameBasics.prototype.pushPosition = function (position) {
//   this.positionContainer.push(position);
// };

// // Pop the position from the positionContainer
// GameBasics.prototype.popPosition = function () {
//   this.positionContainer.pop();
// };

// // GameBasics start - Starting the loop
// GameBasics.prototype.start = function () { 
//   //Specify the interval in milliseconds 
//   setInterval(function () { gameLoop(play); }, this.setting.updateSeconds * 1000); //0,01666667 sec * 1000 = 16,67 ms
//   //Go into the Opening position
//   this.goToPosition(new OpeningPosition());
// }

// // Create a GameBasics object
// const play = new GameBasics(canvas);
// play.start();

// GameBasics.prototype.keyDown = function (keyboardCode) {
//     this.pressedKeys[keyboardCode] = true; 
//     if (this.presentPosition() && this.presentPosition().keyDown) {
//         this.presentPosition().keyDown(this, keyboardCode); 
//     }
// };

// // Game Loop
// function gameLoop(play) {
//   let presentPosition = play.presentPosition();

//   if (presentPosition) {
//     // update
//     if (presentPosition.update) {
//       presentPosition.update(play);
//     }
//     // draw
//     if (presentPosition.draw) {
//       presentPosition.draw(play);
//     }
//   }
// }


