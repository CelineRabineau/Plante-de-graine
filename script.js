//Marche sur p5.js  ;)

function setup() {
  createCanvas(1920, 1080);
  noFill();
  groundHeight = height - 20;
  pixelDensity(2); 
}

let lifeSpan = 500;
let lifeProgress = 0;
let petals = [];
let state = 'growing';
let groundHeight;
let resetDelay = 300; 
let timeSinceLastReset = 0; 

function draw() {
  background(255);
  drawGround();

  if (state === 'growing') {
    growPlant();
  } else if (state === 'dying') {
    dissolvePlant();
  }

  lifeProgress++;

  if (lifeProgress > lifeSpan) {
    if (state === 'growing') {
      state = 'dying';
      lifeProgress = 0;
    } else if (state === 'dying' && checkIfAllPetalsLanded()) {
      timeSinceLastReset++;
      if (timeSinceLastReset > resetDelay) {
        resetPlant();
      }
    }
  }
}


function checkIfAllPetalsLanded() {
  for (let petal of petals) {
    if (!petal.landed) {
      return false;
    }
  }
  return true;
}

function growPlant() {
  let t = frameCount * 0.05;
  let radius = lifeProgress * 0.4;
  let petalCount = 12;  // Nombre de pétales

  for (let i = 0; i < petalCount; i++) {
    let branchAngle = (TWO_PI / 6) * floor(i / 2);
    let angle = branchAngle + (PI / 6) * (i % 2) + noise(t + i) * PI * 0.1;

    let x = width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius;

    let petal = {
      x, y,
      alpha: 255,
      size: random(3, 6),
      falling: false,
      speed: random(2, 4),
      landed: false
    };
    petals.push(petal);
  }

  drawPetals();
}

function dissolvePlant() {
  for (let petal of petals) {
    if (!petal.falling) {
      petal.alpha = max(petal.alpha - 1, 0); 
      petal.y += random(-1, 1) * 0.5; 
      petal.x += random(-1, 1) * 0.5; 

      if (petal.alpha <= 0) {
        petal.falling = true;
      }
    }

    if (petal.falling && !petal.landed) {
      petal.y += petal.speed;
      petal.x += random(-1, 1) * 0.5; 
      petal.alpha = 0;

      if (petal.y >= groundHeight) {
        petal.y = groundHeight;
        petal.landed = true;
        petal.speed = 0;
      }
    }
  }

  drawPetals();
}

function drawPetals() {
  for (let petal of petals) {
    stroke(lerpColor(color('#FF8C00'), color('#FF1493'), petal.alpha / 255));
    strokeWeight(petal.size);
    point(petal.x, petal.y);
  }
}

function drawGround() {
  stroke(200);
  strokeWeight(2);
  line(0, groundHeight, width, groundHeight); 
}

function resetPlant() {
  petals = [];
  lifeProgress = 0;
  state = 'growing';
  timeSinceLastReset = 0; 
}
