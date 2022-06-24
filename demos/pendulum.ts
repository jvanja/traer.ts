import { ParticleSystem } from '../src/ParticleSystem';
import { Particle } from '../src/Particle';
import { Spring } from '../src/Spring';
import { Vector3D } from '../src/Vector3D';
import p5 from 'p5';

class Pendulum {

  public width: number = 800;
  public height: number = 600;
  public physics: ParticleSystem;
  public p: Particle;
  public anchor: Particle;
  public s: Spring;
  public p5: p5;

  constructor() {
    this.physics = new ParticleSystem(new Vector3D(0, 1, 0), 0.05);

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
    this.p5.noStroke();
    this.p5.fill(0);
    this.p5.ellipseMode(this.p5.CENTER);

    this.p5.mousePressed = () => {
      this.p.makeFixed();
      this.p.moveTo(this.p5.mouseX, this.p5.mouseY, 0);
    }
    this.p5.mouseDragged = () => {
      this.p.moveTo(this.p5.mouseX, this.p5.mouseY, 0);
    }
    this.p5.mouseReleased = () => {
      this.p.makeFree();
    }

    this.p = this.physics.makeParticle(1.0, new Vector3D(this.width / 2, this.height / 2, 0));
    this.anchor = this.physics.makeParticle(1.0, new Vector3D(this.width / 2, this.height / 2, 0));
    this.anchor.makeFixed();
    this.s = this.physics.makeSpring(this.p, this.anchor, 0.5, 0.1, 50);
  }

  draw() {
    this.physics.tick();

    this.p5.background('rgb(200,200,100)');

    this.p5.line(this.p.position.x, this.p.position.y, this.anchor.position.x, this.anchor.position.y);
    this.p5.ellipse(this.anchor.position.x, this.anchor.position.y, 5, 5);
    this.p5.ellipse(this.p.position.x, this.p.position.y, 20, 20);
  }
}

new Pendulum()
