import { Vector3D } from './Vector3D';

export class Particle {
  public position: Vector3D;
  public velocity: Vector3D;
  public force: Vector3D;
  public mass: number;
  public age: number;
  public fixed: boolean;

  public dead: boolean;

  constructor(mass: number, position: Vector3D = null) {
    this.mass = mass;

    this.position = (position != null) ? position : new Vector3D();

    this.velocity = new Vector3D();
    this.force = new Vector3D();

    this.fixed = false;
    this.age = 0;
    this.dead = false;
  }

  public distanceTo(p: Particle): number {
    return Vector3D.distance(this.position, p.position);
  }

  public makeFixed(): void {
    this.fixed = true;
    this.velocity.x = 0; this.velocity.y = 0; this.velocity.z = 0;
  }

  public makeFree(): void {
    this.fixed = false;
  }

  public isFixed(): boolean {
    return this.fixed;
  }

  public isFree(): boolean {
    return !this.fixed;
  }

  public setMass(m: number): void {
    this.mass = m;
  }

  public setVelocity(velocity: Vector3D): void {
    this.velocity = velocity;
  }

  public moveTo(x: number, y: number, z: number) {
    this.position.x = x
    this.position.y = y
    this.position.z = z
  }

  private reset(): void {
    this.age = 0;
    this.dead = false;
    this.position.x = 0; this.position.y = 0; this.position.z = 0;
    this.velocity.x = 0; this.velocity.y = 0; this.velocity.z = 0;
    this.force.x = 0; this.force.y = 0; this.force.z = 0;
    this.mass = 1;
  }

  public toString(): String {
    return ("[object Particle]\tm:" + this.mass + " [" + this.position.x + ", " + this.position.y + ", " + this.position.z + "]");
  }

}
