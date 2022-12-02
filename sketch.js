//Object variables
let song; //Stores audio file
let fft; //Stores FFT object

//Stores the amplitude values over time for bass and treble
let history = [];
let history_2 = [];
const desiredLength = 35; //Length of the arrays

//Scales the values before they enter the array
const ampScaling = 1.4;
const ampScaling_2 = 1.8;

//Variables for the GUI controls
let vSlider;
let rSlider;
let pButt;

//Aesthetic variables for controlling the arches
//Horizontal arches
const spacing = 20; //Distance between arches
const aperture = 110; //Arc angle
const thickness = 3;
const fromCenter = 60; //Start drawing the arches from this distance to the center
const excentricity = 40; //Flattens the arches vertically
//Vertical Arches
const spacing_2 = 14;
const aperture_2 = 60;
const fromCenter_2 = 10;
const excentricity_2 = 0;


function preload() {
  song = loadSound("assets/lucky.mp3"); //Stores sound into variable

  //Creates controls used to control play, volume and rate functionality
  vSlider = createSlider(0.00001, 1, 0.1, 0.000001);
  vSlider.style("width", "357px");

  pButt = createButton("Play/Pause");
  pButt.mousePressed(playPause);

  rSlider = createSlider(0.5, 2, 1, 0.01);
  rSlider.style("width", "357px");
}

//Called when button is pressed. If song is playing it gets paused and viceversa.
function playPause() {
  if (song.isPlaying()) {
    song.pause();
  }
  else {
    song.play();
  }
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  colorMode(HSB);

  console.log(">Sample Rate: " + sampleRate() + "Hz");
  console.log(">Channels: " + song.channels());

  //Creates two arrays of predefined length (the length of the arrays will not change
  //beacuse when we push a value to them the first value is then shifted)
  for (let i = 0; i < desiredLength; i++) {
    history.push(0.01);
    history_2.push(0.01);
  }

  //Instantiates the FFT object to then analyze spectrum 
  fft = new p5.FFT(0.3);

  frameRate(40);
}

function draw() {
  background(192, 38, 5);

  //Not used, but need to be called in order to use getEnergy()
  var spectr = fft.analyze();

  //For debugging
  //console.log(spectr);
  //console.log(fft.getEnergy(100));
  //console.log(amp.getLevel() * (ampScaling / vSlider.value()));


  //Updating volume and rate parameter with slider readings
  song.setVolume(vSlider.value());
  song.rate(rSlider.value());


  //Pushes the current amplitude of bass and treble bands into each array
  history.push(map(fft.getEnergy(40, 120) / 500, 0, 255, 0, ampScaling * 200));
  history_2.push(map(fft.getEnergy(1500, 3000) / 500, 0, 255, 0, ampScaling_2 * 200));
  //Drops the first (oldest) value of each array to keep the length constant
  history.shift();
  history_2.shift();

  //Drawing arches
  strokeWeight(thickness);
  noFill();
  for (i = 0; i < desiredLength; i++) {
    stroke(45, 90, 80 - random(10));
    //Rigth
    arc(width / 2, height / 2, fromCenter + i * spacing, excentricity + fromCenter + i * spacing, 0 - aperture * history[history.length - i], 0 + aperture * history[history.length - i]);
    //Left
    arc(width / 2, height / 2, fromCenter + i * spacing, excentricity + fromCenter + i * spacing, 180 - aperture * history[history.length - i], 180 + aperture * history[history.length - i]);

    stroke(214, 35, 55 - random(10));
    //Up
    arc(width / 2, height / 2, fromCenter_2 + i * spacing_2, excentricity_2 + fromCenter_2 + i * spacing_2, 270 - aperture * history_2[i], 270 + aperture * history_2[i]);
    //Down
    arc(width / 2, height / 2, fromCenter_2 + i * spacing_2, excentricity_2 + fromCenter_2 + i * spacing_2, 90 - aperture * history_2[i], 90 + aperture * history_2[i]);
  }
}