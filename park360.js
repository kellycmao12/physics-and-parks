/* Adapted from https://editor.p5js.org/lesleym/sketches/Cc4402Cyq

NAVIGATION
Drag your mouse/trackpad on the screen to navigate left, right, up, or down
*/

let a = 0,
  b = 0;
var c;
let parkImg360;
let parkNoise;

function preload() {
  parkImg360 = loadImage('assets/wsp 360.jpg');
  parkNoise = loadSound('assets/audio/wsp binaural.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // play music
  // parkNoise.setVolume(0.5);
  parkNoise.loop();
}

function draw() {
  noStroke();
  camera(0, 0, 0, 0, 0, 1, 0, 1, 0);
  scale(-1, 1, 1);
  rotateX(radians(b));
  rotateY(radians(a));

  //(camera panning) Code borrowed from midorigoke "https://openprocessing.org/sketch/947901"
  texture(parkImg360);
  sphere(windowWidth);

  if (keyIsDown(39)) a--;
  if (keyIsDown(37)) a++;
  if (keyIsDown(38) && b > -100) b--;
  if (keyIsDown(40) && b < 100) b++;

  if (mouseIsPressed) {
    a -= (mouseX - width / 2) / width;
    b = min(100, max(-100, b + (mouseY - height / 2) / height));
  }
}


// audio source
// 3D NY ANAGLYPH - Washington Square Park - Binaural Audio by John Chu
// https://www.youtube.com/watch?v=GQu34u7GMcE

// image source
// https://www.google.com/maps/place/Washington+Square+Park/@40.7308838,-73.997332,3a,75y,305.47h,84.55t/data=!3m8!1e1!3m6!1sAF1QipNwzZ-xVojNg2getRlXM80DcblPXjPk1Wblpzhg!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNwzZ-xVojNg2getRlXM80DcblPXjPk1Wblpzhg%3Dw203-h100-k-no-pi-7.765273-ya353.92282-ro-0-fo100!7i5760!8i2880!4m7!3m6!1s0x89c25990e23d7e8d:0xfa615edfd1b67e18!8m2!3d40.7308838!4d-73.997332!14m1!1BCgIgARICCAI