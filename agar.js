var food = [];
var zoom = 1;
var player = [];

class Blob {
  constructor(x, y, radius) {
    this.pos = new p5.Vector(x, y);
    this.r = radius;
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  calculateRadius() {
    var area = (this.r * this.r * PI);
    return sqrt(area / PI);
  }

}

class Player extends Blob {

  constructor(x, y, r) {
    super(x, y, r);
    this.vel = createVector(0, 0);
  }

  updatePos() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.setMag(3);
    this.vel.lerp(newvel, 0.1);
    this.pos.add(this.vel);
  }

  checkWallColision() {
    if (this.pos.x > width - this.r) {
      this.vel.x = 0;
      this.pos.x = width - this.r - 1;
    } else if (this.pos.x < -width + this.r) {
      this.vel.x = 0;
      this.pos.x = -width + this.r + 1;
    } else if (this.pos.y > height - this.r) {
      this.vel.y = 0;
      this.pos.y = height - this.r - 1;
    } else if (this.pos.y < -height + this.r) {
      this.vel.y = 0;
      this.pos.y = -height + this.r + 1;
    }
  }

  combine(other) {
    var rad = 0;
    for (var i = 0; i < player.length; i++) {
      rad += player[i].calculateRadius();
    }
    player[0].r = rad

    player.splice(1, player.length - 1);
  }

  eats(other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r) {
      var sum = (this.r * this.r * PI) + (other.r * other.r * PI);
      this.r = sqrt(sum / PI);
      return true;
    } else {
      return false;
    }
  }

  static split() {
    for (var i = player.length - 1; i >= 0; i--) {
      if (player[i].r > 50) {
        player[i].r /= 2;
        var _vel = createVector(mouseX - width / 2, mouseY - height / 2);
        _vel.setMag(400);
        player.push(new Player(player[i].pos.x, player[i].pos.y, player[i].r));
        player[player.length - 1].pos.add(_vel);
      }
    }
  }
}
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
function setup() {
  createCanvas(1080, 720);
  player.push(new Player(50, 50, 20));

  for (var i = 0; i < 100; i++) {
    food[i] = new Blob(random(-width, width), random(-height, height), 10);
  }
}

function draw() {

  background(0);
  var radius = 0;
  for (var i = 0; i < player.length; i++) {
    radius += player[i].calculateRadius();
  }

  translate(width / 2, height / 2);
  var newzoom = 64 / radius;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-player[0].pos.x, -player[0].pos.y);

  for (var i = 0; i < player.length; i++) {
    player[i].show();
    player[i].updatePos();
    player[i].checkWallColision();
  }

  push();
  stroke(123);
  strokeWeight(4);
  noFill();
  rect(-width, -height, width * 2, height * 2);
  pop();

  // console.log(player.pos);

  for (var i = 0; i < food.length; i++) {
    food[i].show();
    for (var j = 0; j < player.length; j++) {
      if (player[j].eats(food[i])) {
        food.splice(i, 1);
        food.push(new Blob(random(-width, width), random(-height, height), 10));
      }
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    Player.split();
  }

  if (keyCode == 40) {
    player[0].combine();
  }
}
// console.log(keyCode);
/*
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal; // (*)

// we can find both properties in rabbit now:
alert( rabbit.eats ); // true (**)
alert( rabbit.jumps ); // true
*/
