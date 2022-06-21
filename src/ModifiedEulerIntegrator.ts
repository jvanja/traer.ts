/**
 * ...
 * @author Vanja Jelic
 */

import { Vector3D } from './Vector3D';
import { Integrator } from './Integrator';
import { Particle } from './Particle';
import { ParticleSystem } from './ParticleSystem';

export class ModifiedEulerIntegrator implements Integrator {

  private s: ParticleSystem;

  constructor(s: ParticleSystem) {
    this.s = s;
  }

  public step(t: number): void {

    let particles = this.s.particles;

    this.s.clearForces();
    this.s.applyForces();

    let halftt: number = (t * t) * .5;
    let one_over_t: number = 1 / t;

    for (let i in particles) {

      let p: Particle = particles[i];

      if (!p.fixed) {

        let ax: number = p.force.x / p.mass;
        let ay: number = p.force.y / p.mass;
        let az: number = p.force.z / p.mass;

        let vel_div_t: Vector3D = p.velocity.clone();
        vel_div_t.scaleBy(one_over_t);
        p.position = p.position.add(vel_div_t);
        p.position = p.position.add(new Vector3D(ax * halftt, ay * halftt, az * halftt));
        p.velocity = p.velocity.add(new Vector3D(ax * one_over_t, ay * one_over_t, az * one_over_t));

      }

    }

  }

}
