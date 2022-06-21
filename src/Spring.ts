import { Vector3D } from './Vector3D';
import { Force } from './Force';
import { Particle } from './Particle';

export class Spring implements Force {
  private a: Particle;
  private b: Particle;

  private springConstant: number; //ks

  private damping: number;
  private restLength: number;

  private on: boolean;

  constructor(a: Particle, b: Particle, springConstant: number, damping: number, restLength: number) {
    this.a = a;
    this.b = b;
    this.springConstant = springConstant;
    this.damping = damping;
    this.restLength = restLength;
    this.on = true;
  }

  public turnOn(): void {
    this.on = true;
  }

  public turnOff(): void {
    this.on = false;
  }

  public isOn(): boolean {
    return this.on;
  }

  public isOff(): boolean {
    return !this.on;
  }

  public currentLength(): number {
    return Vector3D.distance(this.a.position, this.b.position);
  }

  public getStrength(): number {
    return this.springConstant;
  }

  public setStrength(ks: number): void {
    this.springConstant = ks;
  }

  public getDamping(): number {
    return this.damping;
  }

  public setDamping(d: number): void {
    this.damping = d;
  }

  public getRestLength(): number {
    return this.restLength;
  }

  public setRestLength(l: number): void {
    this.restLength = l;
  }

  public setA(p: Particle): void {
    this.a = p;
  }

  public setB(p: Particle): void {
    this.b = p;
  }

  public getOneEnd(): Particle {
    return this.a;
  }

  public getTheOtherEnd(): Particle {
    return this.b;
  }

  public apply(): void {

    if (this.on && (this.a.isFree() || this.b.isFree())) {

      let a2bX: number = this.a.position.x - this.b.position.x;
      let a2bY: number = this.a.position.y - this.b.position.y;
      let a2bZ: number = this.a.position.z - this.b.position.z;

      let a2bDistance: number = Math.sqrt(a2bX * a2bX + a2bY * a2bY + a2bZ * a2bZ);

      if (a2bDistance == 0) {

        a2bX = 0;
        a2bY = 0;
        a2bZ = 0;

      } else {

        a2bX /= a2bDistance;
        a2bY /= a2bDistance;
        a2bZ /= a2bDistance;

      }

      let springForce: number = -(a2bDistance - this.restLength) * this.springConstant;

      let Va2bX: number = this.a.velocity.x - this.b.velocity.x;
      let Va2bY: number = this.a.velocity.y - this.b.velocity.y;
      let Va2bZ: number = this.a.velocity.z - this.b.velocity.z;

      let dampingForce: number = -this.damping * (a2bX * Va2bX + a2bY * Va2bY + a2bZ * Va2bZ);
      let r: number = springForce + dampingForce;

      a2bX *= r;
      a2bY *= r;
      a2bZ *= r;

      if (this.a.isFree()) this.a.force = this.a.force.add(new Vector3D(a2bX, a2bY, a2bZ));
      if (this.b.isFree()) this.b.force = this.b.force.add(new Vector3D(-a2bX, -a2bY, -a2bZ));

    }
  }

}

