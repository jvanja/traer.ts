import { ParticleSystem } from '../src/ParticleSystem';
import { Particle } from '../src/Particle';
import { Vector3D } from '../src/Vector3D';
import { Spring } from '../src/Spring';
import p5 from 'p5';

class Random_Arboretum {

  readonly NODE_SIZE: number = 10;
  readonly EDGE_LENGTH: number = 20;
  readonly EDGE_STRENGTH: number = 0.2;
  readonly SPACER_STRENGTH: number = 1000;

  public width: number = 800;
  public height: number = 600;
  public physics: ParticleSystem;
  public scale: number = 1;
  public centroidX: number = 0;
  public centroidY: number = 0;
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
    this.physics = new ParticleSystem(new Vector3D(0, 0, 0), 0.1);
    // physics = new ParticleSystem(0, 0.1);
    this.p5.createCanvas(this.width, this.height);
    this.p5.smooth();
    this.p5.strokeWeight(2);
    this.p5.ellipseMode(this.p5.CENTER);

    // Runge-Kutta, the default integrator is stable and snappy,
    // but slows down quickly as you add particles.
    // 500 particles = 7 fps on my machine

    // Try this to see how Euler is faster, but borderline unstable.
    // 500 particles = 24 fps on my machine
    this.physics.setIntegrator(ParticleSystem.MODIFIED_EULER);

    // Now try this to see make it more damped, but stable.
    this.physics.setDrag(0.2);


    this.p5.mousePressed = () => this.addNode();
    this.p5.mouseDragged = () => this.addNode();

    this.initialize();
  }

  draw() {
    this.physics.tick();
    if (this.physics.numberOfParticles() > 1) this.updateCentroid();
    this.p5.background('rgb(200,240,100)');
    this.p5.fill(0);
    // this.p5.text("" + this.physics.numberOfParticles() + " PARTICLES\n" + this.p5.frameRate + " FPS", 10, 20);
    this.p5.translate(this.width / 2, this.height / 2);
    this.p5.scale(this.scale);
    this.p5.translate(-this.centroidX, -this.centroidY);

    this.drawNetwork();
  }

  drawNetwork() {
    // draw vertices
    this.p5.fill(160);
    this.p5.noStroke();
    for (let i = 0; i < this.physics.numberOfParticles(); ++i) {
      var v = this.physics.getParticle(i);
      // console.log(v.position.x, v.position.y)
      this.p5.ellipse(v.position.x, v.position.y, this.NODE_SIZE, this.NODE_SIZE);
    }

    // draw edges 
    this.p5.stroke(0);
    this.p5.beginShape(this.p5.LINES);
    for (let i = 0; i < this.physics.numberOfSprings(); ++i) {
      var e: Spring = this.physics.getSpring(i);
      var a: Particle = e.getOneEnd();
      var b: Particle = e.getTheOtherEnd();
      this.p5.vertex(a.position.x, a.position.y);
      this.p5.vertex(b.position.x, b.position.y);
    }
    this.p5.endShape();
  }



  updateCentroid() {
    var xMax = Number.NEGATIVE_INFINITY,
      xMin = Number.POSITIVE_INFINITY,
      yMin = Number.POSITIVE_INFINITY,
      yMax = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < this.physics.numberOfParticles(); ++i) {
      var p = this.physics.getParticle(i);
      xMax = Math.max(xMax, p.position.x);
      xMin = Math.min(xMin, p.position.x);
      yMin = Math.min(yMin, p.position.y);
      yMax = Math.max(yMax, p.position.y);
    }
    var deltaX = xMax - xMin;
    var deltaY = yMax - yMin;

    this.centroidX = xMin + 0.5 * deltaX;
    this.centroidY = yMin + 0.5 * deltaY;

    if (deltaY > deltaX)
      this.scale = this.height / (deltaY + 50);
    else
      this.scale = this.width / (deltaX + 50);
  }

  addSpacersToNode(p: Particle, r: Particle) {
    for (let i = 0; i < this.physics.numberOfParticles(); ++i) {
      var q: Particle = this.physics.getParticle(i);
      if (p != q && p != r)
        this.physics.makeAttraction(p, q, -this.SPACER_STRENGTH, 20);
    }
  }

  makeEdgeBetween(a: Particle, b: Particle) {
    this.physics.makeSpring(a, b, this.EDGE_STRENGTH, this.EDGE_STRENGTH, this.EDGE_LENGTH);
  }

  initialize() {
    this.physics.clear();
    this.physics.makeParticle();
  }

  addNode() {
    var p: Particle = this.physics.makeParticle();
    var q: Particle = this.physics.getParticle(random(0, this.physics.numberOfParticles() - 1));
    while (q == p)
      q = this.physics.getParticle(random(0, this.physics.numberOfParticles() - 1));
    this.addSpacersToNode(p, q);
    this.makeEdgeBetween(p, q);
    p.moveTo(q.position.x + random(-1, 1), q.position.y + random(-1, 1), 0);

    function random(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  }
}

new Random_Arboretum()
