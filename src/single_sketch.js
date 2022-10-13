import '../css/style.css';
import { sketch, p5 } from 'p5js-wrapper';
import 'p5js-wrapper/sound';
import songs from "./clips.json";

let fft, amplitude, buttonsDict, selected, button, select;
let sounds = [];
let touched = 0;
let stepCount = 1;
let defaultSize = 50;
let selectedSong = songs.collection[0]


// Augmenter step quand 4 séquence réussie
  
sketch.preload = () => {
  soundFormats('mp3');
  selectedSong.clips.forEach(song => sounds.push(loadSound(`/clips/${selectedSong.name}/${song.track}`)))
}

sketch.setup = function(){
  
  createCanvas (400, 400);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  //frameRate(10);
  button = createButton('start');
  button.position(20, height);
  button.mousePressed(playExample);

  select = createSelect();
  select.position(90, height);
  select.option('reine');
  select.option('cassenoix');
  select.option('cassenoix-handcut');
  select.changed(selectEvent);
  
  buttonsDict = [
    {
      x: width / 2,
      y: height / 4,
      with: defaultSize,
      height: defaultSize,
      color: "#c85555"
    },
    {
      x: width - (width / 4),
      y: height / 2,
      with: defaultSize,
      height: defaultSize,
      color: "#c85555"
    },
    {
      x: width / 2,
      y: height - (height / 4),
      with: defaultSize,
      height: defaultSize,
      color: "#c85555"
    },
    {
      x: width / 4,
      y: height / 2,
      with: defaultSize,
      height: defaultSize,
      color: "#c85555"
    }
  ];
 
}


sketch.draw = function(){
  background("#161616");

  let spectrum = fft.analyze();
  var bass     = fft.getEnergy( "bass" );
  var treble   = fft.getEnergy( "treble" );
  var mid      = fft.getEnergy( "mid" );   
  var lowMid   = fft.getEnergy( "lowMid" );   
  var highMid  = fft.getEnergy( "highMid" );     

  var mapBass  = map( bass, 0, 255, 0, width );
  var mapMid   = map( mid, 0, 255, 0, width );
  var sizeTreble   = map( treble, 0, 255, 0, width );

  let level = amplitude.getLevel();
  let sizeLevel = map(level, 0, 1, 0, width);

  for (var i = 0; i < buttonsDict.length; i++) {

    if(selected === i) {
      fill(50);
      ellipse(buttonsDict[i].x, buttonsDict[i].y, sizeLevel*2, sizeLevel*2)
    }

    fill(buttonsDict[i].color);
    ellipse(buttonsDict[i].x, buttonsDict[i].y, defaultSize, defaultSize);

    if(selected === i) {
      ellipse(buttonsDict[i].x, buttonsDict[i].y, sizeLevel, sizeLevel)
      ellipse(buttonsDict[i].x, buttonsDict[i].y, sizeTreble, sizeTreble)
    }
  }

}

sketch.mousePressed = () => {
  for (var i = 0; i < buttonsDict.length; i++) {
    let d = dist(mouseX, mouseY, buttonsDict[i].x, buttonsDict[i].y);
    if(d < defaultSize) {
      fill(buttonsDict[i].color);
      ellipse(buttonsDict[i].x, buttonsDict[i].y, defaultSize*1.25, defaultSize*1.25);
      // trouve le son de son bouton 
      selectedSong.clips.forEach((clip, index) => {
        if (clip.button === i && index < stepCount * 4) {
          sounds[index].play();
        }
      });
     
      selected = i
      checkResult(i)
    }
  }
}

const checkResult = (i) => {
  // Donne 1 point si il y a correspondance, au bout de 3 incrémente stepCount
  console.log(`A touché ${i}, devait toucher ${selectedSong.clips[touched].button}`)
  touched = (selectedSong.clips[touched].button === i) ? touched + 1 : 0
  console.log(`Score = ${stepCount * touched}`)
}



const playExample = (id) => {
  var totalDuration = 0;
  for(var i = 0; i < sounds.length; i++) {
   playIt(i, selectedSong.clips[i].button, totalDuration)
   totalDuration += selectedSong.clips[i].duration
  }
}

const playIt = (i, position, totalDuration) => {
  setTimeout(() => {
    selected = position;
    sounds[i].play()
  }, totalDuration)
}

const toggleColor = (i, color) => {
  buttonsDict[i] = { ...buttonsDict[i], color};
}

const selectEvent = () => {
  selectedSong = songs.collection.filter(song => song.name === select.value())[0]
  sounds = [];
  selectedSong.clips.forEach(song => sounds.push(loadSound(`/clips/${selectedSong.name}/${song.track}`)))
}