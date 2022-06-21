import { Vector3D } from './Vector3D';
import { Particle } from './Particle';
import { ParticleSystem } from './ParticleSystem';
import { Integrator } from './Integrator';

export class RungeKuttaIntegrator implements Integrator {

  private s: ParticleSystem;

  private originalPositions: Array<Vector3D>;
  private originalVelocities: Array<Vector3D>;
  private k1Forces: Array<Vector3D>;
  private k1Velocities: Array<Vector3D>;
  private k2Forces: Array<Vector3D>;
  private k2Velocities: Array<Vector3D>;
  private k3Forces: Array<Vector3D>;
  private k3Velocities: Array<Vector3D>;
  private k4Forces: Array<Vector3D>;
  private k4Velocities: Array<Vector3D>;

  constructor(s: ParticleSystem) {

    this.s = s;

    this.originalPositions = new Array<Vector3D>();
    this.originalVelocities = new Array<Vector3D>();
    this.k1Forces = new Array<Vector3D>();
    this.k1Velocities = new Array<Vector3D>();
    this.k2Forces = new Array<Vector3D>();
    this.k2Velocities = new Array<Vector3D>();
    this.k3Forces = new Array<Vector3D>();
    this.k3Velocities = new Array<Vector3D>();
    this.k4Forces = new Array<Vector3D>();
    this.k4Velocities = new Array<Vector3D>();

  }

  private allocateParticles(): void { 		// is this necessary w/ Array<T> ??

    while (this.s.particles.length > this.originalPositions.length) {

      this.originalPositions.push(new Vector3D());
      this.originalVelocities.push(new Vector3D());
      this.k1Forces.push(new Vector3D());
      this.k1Velocities.push(new Vector3D());
      this.k2Forces.push(new Vector3D());
      this.k2Velocities.push(new Vector3D());
      this.k3Forces.push(new Vector3D());
      this.k3Velocities.push(new Vector3D());
      this.k4Forces.push(new Vector3D());
      this.k4Velocities.push(new Vector3D());

    }

  }

  public step(t: number): void {

    this.allocateParticles();

    let particles: Array<Particle> = this.s.particles;
    let p: Particle;
    let originalPosition: Vector3D;
    let originalVelocity: Vector3D;

    let k1Velocity: Vector3D;
    let k2Velocity: Vector3D;
    let k3Velocity: Vector3D;
    let k4Velocity: Vector3D;

    let k1Force: Vector3D;
    let k2Force: Vector3D;
    let k3Force: Vector3D;
    let k4Force: Vector3D;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // k1: save original, apply forces, result is k1
    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {
        this.originalPositions[i] = p.position.clone();
        this.originalVelocities[i] = p.velocity.clone();
      }

      p.force.x = 0; p.force.y = 0; p.force.z = 0; //clear

    }

    this.s.applyForces();

    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {
        this.k1Forces[i] = p.force.clone();
        this.k1Velocities[i] = p.velocity.clone();
      }

      p.force.x = 0; p.force.y = 0; p.force.z = 0; //clear

    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - 	
    // k2: use k1, apply forces, result is k2
    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {

        originalPosition = this.originalPositions[i];
        k1Velocity = this.k1Velocities[i];

        p.position.x = originalPosition.x + k1Velocity.x * 0.5 * t; //TODO: rewrite with vector operations? add() scaleBy()...
        p.position.y = originalPosition.y + k1Velocity.y * 0.5 * t;
        p.position.z = originalPosition.z + k1Velocity.z * 0.5 * t;

        originalVelocity = this.originalVelocities[i];
        k1Force = this.k1Forces[i];

        p.velocity.x = originalVelocity.x + k1Force.x * 0.5 * t / p.mass;
        p.velocity.y = originalVelocity.y + k1Force.y * 0.5 * t / p.mass;
        p.velocity.z = originalVelocity.z + k1Force.z * 0.5 * t / p.mass;

      }

    }

    this.s.applyForces();

    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {
        this.k2Forces[i] = p.force.clone();
        this.k2Velocities[i] = p.velocity.clone();
      }

      p.force.x = 0; p.force.y = 0; p.force.z = 0; //clear

    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // k3: use k2, apply forces, result is k3
    // - - - - - - - - - - - - - - - - - - - - - - - - - - 

    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {

        originalPosition = this.originalPositions[i];
        k2Velocity = this.k2Velocities[i];

        p.position.x = originalPosition.x + k2Velocity.x * 0.5 * t;
        p.position.y = originalPosition.y + k2Velocity.y * 0.5 * t;
        p.position.z = originalPosition.z + k2Velocity.z * 0.5 * t;

        originalVelocity = this.originalVelocities[i];
        k2Force = this.k2Forces[i];

        p.velocity.x = originalVelocity.x + k2Force.x * 0.5 * t / p.mass;
        p.velocity.y = originalVelocity.y + k2Force.y * 0.5 * t / p.mass;
        p.velocity.z = originalVelocity.z + k2Force.z * 0.5 * t / p.mass;

      }

    }

    this.s.applyForces();

    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {
        this.k3Forces[i] = p.force.clone();
        this.k3Velocities[i] = p.velocity.clone();
      }

      p.force.x = 0; p.force.y = 0; p.force.z = 0; //clear

    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // k4: use k3, apply forces, result is k4
    // - - - - - - - - - - - - - - - - - - - - - - - - - -

    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {

        originalPosition = this.originalPositions[i];
        k3Velocity = this.k3Velocities[i];

        p.position.x = originalPosition.x + k3Velocity.x * 0.5 * t;
        p.position.y = originalPosition.y + k3Velocity.y * 0.5 * t;
        p.position.z = originalPosition.z + k3Velocity.z * 0.5 * t;

        originalVelocity = this.originalVelocities[i];
        k3Force = this.k3Forces[i];

        p.velocity.x = originalVelocity.x + k3Force.x * 0.5 * t / p.mass;
        p.velocity.y = originalVelocity.y + k3Force.y * 0.5 * t / p.mass;
        p.velocity.z = originalVelocity.z + k3Force.z * 0.5 * t / p.mass;

      }

    }

    this.s.applyForces();

    for (let i in particles) {

      p = particles[i];

      if (!p.fixed) {
        this.k4Forces[i] = p.force.clone();
        this.k4Velocities[i] = p.velocity.clone();
      }

      p.force.x = 0; p.force.y = 0; p.force.z = 0; //clear

    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // now update position and velocity 
    // based on intermediate forces
    // - - - - - - - - - - - - - - - - - - - - - - - - - -

    for (let i in particles) {

      p = particles[i];
      p.age += t;

      if (!p.fixed) {

        // position

        originalPosition = this.originalPositions[i];
        k1Velocity = this.k1Velocities[i];
        k2Velocity = this.k2Velocities[i];
        k3Velocity = this.k3Velocities[i];
        k4Velocity = this.k4Velocities[i];

        p.position.x = originalPosition.x + t / 6 * (k1Velocity.x + 2 * k2Velocity.x + 2 * k3Velocity.x + k4Velocity.x);
        p.position.y = originalPosition.y + t / 6 * (k1Velocity.y + 2 * k2Velocity.y + 2 * k3Velocity.y + k4Velocity.y);
        p.position.z = originalPosition.z + t / 6 * (k1Velocity.z + 2 * k2Velocity.z + 2 * k3Velocity.z + k4Velocity.z);

        // velocity

        originalVelocity = this.originalVelocities[i];
        k1Force = this.k1Forces[i];
        k2Force = this.k2Forces[i];
        k3Force = this.k3Forces[i];
        k4Force = this.k4Forces[i];

        p.velocity.x = originalVelocity.x + t / 6 * p.mass * (k1Force.x + 2 * k2Force.x + 2 * k3Force.x + k4Force.x);
        p.velocity.y = originalVelocity.y + t / 6 * p.mass * (k1Force.y + 2 * k2Force.y + 2 * k3Force.y + k4Force.y);
        p.velocity.z = originalVelocity.z + t / 6 * p.mass * (k1Force.z + 2 * k2Force.z + 2 * k3Force.z + k4Force.z);

      }

    }

  }
}

