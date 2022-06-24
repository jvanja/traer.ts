import { ParticleSystem } from '../src/ParticleSystem';
import { Particle } from '../src/Particle';
import { Vector3D } from '../src/Vector3D';
import p5 from 'p5';

class Bouncy {

  public width: number = 800;
  public height: number = 600;
  public physics: ParticleSystem;
  public mouse: Particle;
  public b: Particle;
  public c: Particle;
  public p5: p5;

  constructor() {

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.p5 = new p5(function(s: p5) {
      s.setup = this.setup.bind(this)
      s.draw = this.draw.bind(this)
    }.bind(this))
  }

  setup() {
    this.p5.createCanvas(this.width, this.height);
    this.p5.smooth();
    this.p5.ellipseMode(this.p5.CENTER);
    this.p5.noStroke();
    this.p5.noCursor();

    this.physics = new ParticleSystem(new Vector3D(0, 0, 0), 0.1);
    this.mouse = this.physics.makeParticle();
    this.mouse.makeFixed();
    this.b = this.physics.makeParticle(1.0, new Vector3D(random(0, this.width), random(0, this.height), 0));
    this.c = this.physics.makeParticle(1.0, new Vector3D(random(0, this.width), random(0, this.height), 0));

    this.physics.makeAttraction(this.mouse, this.b, 10000, 10);
    this.physics.makeAttraction(this.mouse, this.c, 10000, 10);
    this.physics.makeAttraction(this.b, this.c, -10000, 5);

    function random(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

  }

  draw() {
    this.mouse.moveTo(this.p5.mouseX, this.p5.mouseY, 0);
    this.handleBoundaryCollisions(this.b);
    this.handleBoundaryCollisions(this.c);
    this.physics.tick();

    this.p5.background('rgb(237,227,205)');

    this.p5.fill(255, 0, 0);
    this.p5.ellipse(this.mouse.position.x, this.mouse.position.y, 35, 35);


    this.p5.fill(0, 255, 0);
    this.p5.ellipse(this.b.position.x, this.b.position.y, 35, 35);

    this.p5.fill(0, 0, 255);
    this.p5.ellipse(this.c.position.x, this.c.position.y, 35, 35);
  }

  // really basic collision strategy:
  // sides of the window are walls
  // if it hits a wall pull it outside the wall and flip the direction of the velocity
  // the collisions aren't perfect so we take them down a notch too
  handleBoundaryCollisions(p: Particle) {
    if (p.position.x < 0 || p.position.x > this.width)
      p.setVelocity(new Vector3D(-0.9 * p.velocity.x, p.velocity.y, 0));
    if (p.position.y < 0 || p.position.y > this.height)
      p.setVelocity(new Vector3D(p.velocity.x, -0.9 * p.velocity.y, 0));
    p.moveTo(constrain(p.position.x, 0, this.width), constrain(p.position.y, 0, this.height), 0);

    function constrain(num: number, min: number, max: number) {
      return num > max ? max : num < min ? min : num;
    }

  }
}

new Bouncy()
