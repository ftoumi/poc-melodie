import '../css/style.css';
import { sketch, p5 } from 'p5js-wrapper';
import 'p5js-wrapper/sound';

let mySound, fft, amplitude;
var pieces = 32;
var noiseScale = 0.02;

  // Circle's radius
  var radius = 200;
  
function preload() {
 
}


sketch.setup = function(){
  let cnv = createCanvas (800, 600);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  frameRate(10);
  soundFormats('mp3');
  mySound = loadSound('/clips/reine-nuit');
}


sketch.draw = function(){
  background(255);

  let spectrum = fft.analyze();
  var bass    = fft.getEnergy( "bass" );
  var treble  = fft.getEnergy( "treble" );
  var mid     = fft.getEnergy( "mid" );   
  var lowMid     = fft.getEnergy( "lowMid" );   
  var highMid     = fft.getEnergy( "highMid" );     

  var mapBass     = map( bass, 0, 255, 0, width );
  var mapMid      = map( mid, 0, 255, 0, width );
  var sizeTreble   = map( treble, 0, 255, 0, width );
  //console.log({mapBass, mapMid, highMid, sizeTreble})

  //noStroke();

  

  let level = amplitude.getLevel();
  let sizeLevel = map(level, 0, 1, 0, width);

  fill(255, 0, 0);
  ellipse(width/2, height/2, sizeTreble, sizeTreble);

  fill(255, 0, 0, 0);
  ellipse(width/2, height/2, sizeLevel, sizeLevel);

  /* for (let x=0; x < width; x+=width/10) {

    let noiseVal = noise(bass + x);
    let noiseMap = map(noiseVal)

    stroke(255);
    line(x, noiseVal*100, x, height);
  } */

}

sketch.mousePressed = function(){
  if(mySound.isPlaying()){
    mySound.pause();
    noLoop();
    console.log("Pause");
  } else {
    mySound.play();
    loop();
    console.log("Play");
  }
}



/* 

var bass    = fft.getEnergy( "bass" );
var treble  = fft.getEnergy( "treble" );
var mid     = fft.getEnergy( "mid" );     
var custom  = fft.getEnergy( 100, 200 );

console.log(bass)
 */