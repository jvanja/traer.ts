import { ParticleSystem } from '../src/ParticleSystem';
import { Particle } from '../src/Particle';
import { Vector3D } from '../src/Vector3D';
// import p5 = require('p5');

class Cloth {
  public physics: ParticleSystem;
  public particles: Particle[][];
  public p5: p5;
  public width: number = 800;
  public height: number = 600;
  public gridSize: number = 12;
  public mouseDown: boolean = false;
  public particleMass: number = 0.2;

  constructor() {
    this.physics = new ParticleSystem(new Vector3D(0, 2.0, 0), 0.05);
    this.particles = [];

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.p5 = new p5(function(s: p5) {
      s.setup = this.setupCanvas.bind(this)
      s.draw = this.draw.bind(this)
    }.bind(this))

    let gridStepX: number = ((this.width / 2) / this.gridSize);
    let gridStepY: number = ((this.height / 2) / this.gridSize);

    for (let i = 0; i < this.gridSize; i++) {
      this.particles[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.particles[i][j] = this.physics.makeParticle(this.particleMass, new Vector3D(j * gridStepX + (this.width / 4), i * gridStepY + 20, 0.0));
        if (j > 0) {
          this.physics.makeSpring(this.particles[i][j - 1], this.particles[i][j], 8.0, 0.5, gridStepX);
        }
      }
    }

    for (let j = 0; j < this.gridSize; j++) {
      for (let i = 1; i < this.gridSize; i++) {
        this.physics.makeSpring(this.particles[i - 1][j], this.particles[i][j], 8.0, 0.5, gridStepY);
      }
    }

    this.particles[0][0].makeFixed();
    this.particles[0][this.gridSize - 1].makeFixed();
  }

  draw() {
    this.physics.tick(0.2);

    if (this.mouseDown) {
      this.particles[0][this.gridSize - 1].moveTo(this.p5.mouseX, this.p5.mouseY, 0);
      // this.particles[0][this.gridSize - 1].velocity().clear();
    }

    this.p5.clear();

    this.p5.fill('rgba(0,0,0,0)');
    this.p5.stroke('#f00');
    this.p5.strokeWeight(2);
    for (let i = 0; i < this.gridSize; i++) {
      this.p5.beginShape();
      this.p5.curveVertex(this.particles[i][0].position.x, this.particles[i][0].position.y);
      for (let j = 0; j < this.gridSize; j++) {
        this.p5.curveVertex(this.particles[i][j].position.x, this.particles[i][j].position.y);
      }
      this.p5.curveVertex(this.particles[i][this.gridSize - 1].position.x, this.particles[i][this.gridSize - 1].position.y);
      this.p5.endShape();
    }
    for (let j = 0; j < this.gridSize; j++) {
      this.p5.beginShape();
      this.p5.curveVertex(this.particles[0][j].position.x, this.particles[0][j].position.y);
      for (let i = 0; i < this.gridSize; i++) {
        this.p5.curveVertex(this.particles[i][j].position.x, this.particles[i][j].position.y);
      }
      this.p5.curveVertex(this.particles[this.gridSize - 1][j].position.x, this.particles[this.gridSize - 1][j].position.y);
      this.p5.endShape()
    }
  }

  setupCanvas() {
    this.p5.smooth();
    this.p5.fill(0);
    this.p5.createCanvas(this.width, this.height);
    this.p5.background(200);
    this.p5.mousePressed = () => this.mouseDown = true
    this.p5.mouseReleased = () => this.mouseDown = false
  }

}

new Cloth()
