import { Vector3D } from './Vector3D';
import { Particle } from './Particle';
import { Force } from './Force';
import { Attraction } from './Attraction';
import { Spring } from './Spring';
import { Integrator } from './Integrator';
import { RungeKuttaIntegrator } from './RungeKuttaIntegrator';
import { ModifiedEulerIntegrator } from './ModifiedEulerIntegrator';

export class ParticleSystem {
  public static RUNGE_KUTTA: number;
  public static MODIFIED_EULER: number;

  private integrator: Integrator;

  public gravity: Vector3D;
  public drag: number;

  public particles: Array<Particle>;
  private springs: Array<Spring>;
  private attractions: Array<Attraction>;
  private custom: Array<Force>;

  private hasDeadParticles: boolean;

  constructor(gravity: Vector3D = null, drag: number = 0.001) {

    ParticleSystem.RUNGE_KUTTA = 0;
    ParticleSystem.MODIFIED_EULER = 1;
    this.hasDeadParticles = false;
    this.integrator = new RungeKuttaIntegrator(this);

    this.particles = new Array<Particle>();
    this.springs = new Array<Spring>();
    this.attractions = new Array<Attraction>();
    this.custom = new Array<Force>();

    this.gravity = (gravity != null) ? gravity : new Vector3D();

    this.drag = drag;
  }

  public setIntegrator(integrator: number): void {

    switch (integrator) {

      case ParticleSystem.RUNGE_KUTTA:
        this.integrator = new RungeKuttaIntegrator(this);

      case ParticleSystem.MODIFIED_EULER:
        this.integrator = new ModifiedEulerIntegrator(this);
    }

  }

  public setGravity(gravity: Vector3D): void {
    this.gravity = gravity;
  }

  public setDrag(d: number): void {
    this.drag = d;
  }

  public tick(t: number = 1): void {
    this.integrator.step(t);
  }

  public makeParticle(mass: number = 1, position: Vector3D = null): Particle {
    var p: Particle = new Particle(mass, position);
    this.particles.push(p);
    return p;
  }

  public makeSpring(a: Particle, b: Particle, springConstant: number, damping: number, restLength: number): Spring {
    var s: Spring = new Spring(a, b, springConstant, damping, restLength);
    this.springs.push(s);
    return s;
  }

  public makeAttraction(a: Particle, b: Particle, strength: number, minDistance: number): Attraction {
    var m: Attraction = new Attraction(a, b, strength, minDistance);
    this.attractions.push(m);
    return m;
  }

  public clear(): void {

    for (let i in this.particles) {
      this.particles[i] = null;
    }
    for (let i in this.springs) {
      this.springs[i] = null;
    }
    for (let i in this.attractions) {
      this.attractions[i] = null;
    }

    this.particles = new Array<Particle>();
    this.springs = new Array<Spring>();
    this.attractions = new Array<Attraction>();

  }

  public applyForces(): void {

    if (this.gravity.x != 0 || this.gravity.y != 0 || this.gravity.x != 0) {
      for (let i in this.particles) {
        this.particles[i].force = this.particles[i].force.add(this.gravity);
      }
    }

    for (let i in this.particles) {
      var p: Particle = this.particles[i];
      var vdrag: Vector3D = p.velocity.clone();
      vdrag.scaleBy(-this.drag);
      p.force = p.force.add(vdrag);
    }

    for (let i in this.springs) {
      this.springs[i].apply();
    }

    for (let i in this.attractions) {
      this.attractions[i].apply();
    }

    for (let i in this.custom) {
      this.custom[i].apply();
    }

  }

  public clearForces(): void {

    for (let i in this.particles) {
      var p: Particle = this.particles[i];
      p.force.x = 0; p.force.y = 0; p.force.z = 0;
    }

  }

  public numberOfParticles(): number {
    return this.particles.length;
  }

  public numberOfSprings(): number {
    return this.springs.length;
  }

  public numberOfAttractions(): number {
    return this.attractions.length;
  }

  public getParticle(i: number): Particle {
    return this.particles[i];
  }

  public getSpring(i: number): Spring {
    return this.springs[i];
  }

  public getAttraction(i: number): Attraction {
    return this.attractions[i];
  }

  public addCustomForce(f: Force): void {
    this.custom.push(f);
  }

  public numberOfCustomForces(): number {
    return this.custom.length;
  }

  public getCustomForce(i: number): Force {
    return this.custom[i];
  }

  public removeCustomForce(i: number): void {
    this.custom[i] = null;
    this.custom.splice(i, 1);
  }

  public removeCustomForceByReference(f: Force): boolean {
    let n: string = '-1';
    for (let i in this.custom) {
      if (this.custom[i] == f) {
        n = i;
        break;
      }
    }
    if (n != '-1') {
      this.custom[n] = null;
      this.custom.splice(Number(n), 1);
      return true;
    } else {
      return false;
    }
  }

  public removeSpring(i: number): void {
    this.springs[i] = null;
    this.springs.splice(i, 1);
  }

  public removeSpringByReference(s: Spring): boolean {
    var n: any = -1;
    for (let i in this.springs) {
      if (this.springs[i] == s) {
        n = i;
        break;
      }
    }
    if (n != -1) {
      this.springs[n] = null;
      this.springs.splice(Number(n), 1);
      return true;
    } else {
      return false;
    }
  }

  public removeAttraction(i: number): void {
    this.attractions[i] = null;
    this.attractions.splice(i, 1);
  }

  public removeAttractionByReference(s: Attraction): boolean {
    var n: any = -1;
    for (let i in this.attractions) {
      if (this.attractions[i] == s) {
        n = i;
        break;
      }
    }
    if (n != -1) {
      this.attractions[n] = null;
      this.attractions.splice(Number(n), 1);
      return true;
    } else {
      return false;
    }
  }

  public removeParticle(i: number): void {
    this.particles[i] = null;
    this.particles.splice(i, 1);
  }

  public removeParticleByReference(p: Particle): boolean {
    var n: any = -1;
    for (let i in this.particles) {
      if (this.particles[i] == p) {
        n = i;
        break;
      }
    }
    if (n != -1) {
      this.particles[n] = null;
      this.particles.splice(Number(n), 1);
      return true;
    } else {
      return false;
    }
  }
}

