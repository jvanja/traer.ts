import { Particle } from '../src/Particle';
import { ParticleSystem } from '../src/ParticleSystem';
import { Vector3D } from '../src/Vector3D';
import { Spring } from '../src/Spring';
import p5 from 'p5';

export class Tendrils {
  public width: number = 800;
  public height: number = 600;
  public tendrils: Array<any>;
  public physics: ParticleSystem;
  public mouse: Particle;
  public greyer: number;
  public drawing: boolean;
  public nothingDrawn: boolean;
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
    this.p5.stroke(0);
    this.p5.background(255);
    this.p5.cursor(this.p5.CROSS);

    // this.physics = new ParticleSystem(0, 0.05);
    this.physics = new ParticleSystem(new Vector3D(0, 0, 0), 0.05);

    this.mouse = this.physics.makeParticle();
    this.mouse.makeFixed();

    this.tendrils = new Array();
    this.drawing = false;

    this.greyer = 255;

    this.p5.mousePressed = () => {
      this.drawing = true;
      this.tendrils.push(new T3ndril(this.physics, new Vector3D(this.p5.mouseX, this.p5.mouseY, 0), this.mouse));
    }

    this.p5.mouseDragged = () => {
      this.tendrils[this.tendrils.length - 1].addPoint(new Vector3D(this.p5.mouseX, this.p5.mouseY, 0));
    }

    this.p5.mouseReleased = () => {
      this.drawing = false;
    }

  }

  draw() {
    this.mouse.position.set(this.p5.mouseX, this.p5.mouseY, 0);

    if (!this.drawing) {
      this.physics.tick();
      if (this.greyer < 255)
        this.greyer *= 1.11111;
      if (this.greyer > 255)
        this.greyer = 255;
    }
    else {
      if (this.greyer >= 64)
        this.greyer *= 0.9;
    }

    this.p5.background(255);

    this.drawOldGrey();
  }

  drawOldGrey() {
    this.p5.stroke(255 - this.greyer);
    for (let i: number = 0; i < this.tendrils.length - 1; ++i) {
      var t: T3ndril = this.tendrils[i];
      this.drawElastic(t);
    }

    this.p5.stroke(0);
    if (this.tendrils.length - 1 >= 0)
      this.drawElastic(this.tendrils[this.tendrils.length - 1]);
  }

  drawElastic(t: T3ndril) {
    let lastStretch: number = 1;
    for (let i = 0; i < t.particles.length - 1; ++i) {
      let firstPoint: Vector3D = t.particles[i].position;
      let firstAnchor: Vector3D = i < 1 ? firstPoint : t.particles[i - 1].position;
      let secondPoint: Vector3D = i + 1 < t.particles.length ? t.particles[i + 1].position : firstPoint;
      let secondAnchor: Vector3D = i + 2 < t.particles.length ? t.particles[i + 2].position : secondPoint;

      //float springStretch = 2.5f/((Spring)t.springs.get( i )).stretch();
      let s: Spring = t.springs[i];
      let springStretch: number = 2.5 * s.getRestLength() / s.currentLength();

      this.p5.strokeWeight((springStretch + lastStretch) / 2.0);	// smooth out the changes in stroke width with filter
      lastStretch = springStretch;

      this.p5.curve(firstAnchor.x, firstAnchor.y,
        firstPoint.x, firstPoint.y,
        secondPoint.x, secondPoint.y,
        secondAnchor.x, secondAnchor.y);
    }
  }
}

class T3ndril {
  public particles: Array<any>;
  public springs: Array<any>;
  public physics: ParticleSystem;

  constructor(p: ParticleSystem, firstPoint: Vector3D, followPoint: Particle) {
    this.particles = new Array();
    this.springs = new Array();

    this.physics = p;

    let firstParticle: Particle = p.makeParticle(1.0, new Vector3D(firstPoint.x, firstPoint.y, firstPoint.z));
    this.particles.push(firstParticle);
    this.physics.makeSpring(followPoint, firstParticle, 0.1, 0.1, 5);
  }

  public addPoint(p: Vector3D) {
    let thisParticle: Particle = this.physics.makeParticle(1.0, new Vector3D(p.x, p.y, p.z));
    this.springs.push(
      this.physics.makeSpring((this.particles[this.particles.length - 1]),
        thisParticle,
        1.0,
        1.0,
        Vector3D.distance(this.particles[this.particles.length - 1].position, thisParticle.position))
    );
    this.particles.push(thisParticle);
  }
}

new Tendrils()
