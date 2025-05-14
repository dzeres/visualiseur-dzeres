let song;
let fft;
let particles = [];
let started = false;

function preload() {
  song = loadSound('Dzeres-Debut.mp3');
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  fft = new p5.FFT();

  let playButton = createButton("▶️ Lancer le visualiseur");
  playButton.position(width / 2 - 80, height / 2);
  playButton.mousePressed(() => {
    song.play();
    started = true;
    playButton.hide();
  });
}

function draw() {
  if (!started) return;

  background(0, 20);
  translate(width / 2, height / 2);

  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");

  // Cercle central pulsant
  noFill();
  stroke(255, 100);
  strokeWeight(2);
  let r = map(bass, 0, 255, 100, 250);
  ellipse(0, 0, r, r);

  // Forme ondulée
  beginShape();
  noFill();
  stroke(100, 200, 255);
  strokeWeight(1.5);
  for (let angle = 0; angle < 360; angle += 5) {
    let index = floor(map(angle, 0, 360, 0, spectrum.length));
    let amp = spectrum[index];
    let rad = map(amp, 0, 256, 150, 300);
    let x = rad * cos(angle);
    let y = rad * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  // Particules
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].edges()) {
      particles.splice(i, 1);
    }
  }

  if (bass > 200) {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle());
    }
  }

  // Titre
  noStroke();
  fill(255, 200);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Dzeres – Début", 0, 0);
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(random(100, 200));
    this.vel = this.pos.copy().mult(random(0.01, 0.05));
    this.alpha = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 4;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.pos.x, this.pos.y, 4);
  }

  edges() {
    return this.alpha < 0;
  }
}
