import { Vector3D } from './Vector3D';
import { Force } from './Force';
import { Particle } from './Particle';

export class Attraction implements Force {
  private a: Particle;
  private b: Particle;

  private strength: number; //k

  private minDistance: number; //set to private as squared needs to be updated at the same time
  private minDistanceSquared: number;

  private on: boolean;


  constructor(a: Particle, b: Particle, strength: number, minDistance: number) {
    this.a = a;
    this.b = b;
    this.strength = strength;

    this.on = true;

    this.minDistance = minDistance;
    this.minDistanceSquared = minDistance * minDistance;

  }

  public getMinimumDistance(): number {
    return this.minDistance;
  }

  public setMinimumDistance(d: number) {
    this.minDistance = d;
    this.minDistanceSquared = d * d;
  }

  public turnOn() {
    this.on = true;
  }

  public turnOff() {
    this.on = false;
  }

  public isOn(): boolean {
    return this.on;
  }

  public isOff(): boolean {
    return !this.on;
  }

  public getStrength(): number {
    return this.strength;
  }

  public setStrength(k: number) {
    this.strength = k;
  }

  public setA(p: Particle) {
    this.a = p;
  }

  public setB(p: Particle) {
    this.b = p;
  }

  public getOneEnd(): Particle {
    return this.a;
  }

  public getTheOtherEnd(): Particle {
    return this.a;
  }

  public apply() {

    if (this.on && (this.a.isFree() || this.b.isFree())) {

      var a2bX: number = this.a.position.x - this.b.position.x;
      var a2bY: number = this.a.position.y - this.b.position.y;
      var a2bZ: number = this.a.position.z - this.b.position.z;

      var a2bDistanceSquared: number = a2bX * a2bX + a2bY * a2bY + a2bZ * a2bZ;

      if (a2bDistanceSquared < this.minDistanceSquared) a2bDistanceSquared = this.minDistanceSquared;

      var force: number = this.strength * this.a.mass * this.b.mass / a2bDistanceSquared;

      var length: number = Math.sqrt(a2bDistanceSquared);

      a2bX /= length;
      a2bY /= length;
      a2bZ /= length;

      a2bX *= force;
      a2bY *= force;
      a2bZ *= force;

      if (this.a.isFree()) this.a.force = this.a.force.add(new Vector3D(-a2bX, -a2bY, -a2bZ));
      if (this.b.isFree()) this.b.force = this.b.force.add(new Vector3D(a2bX, a2bY, a2bZ));

    }

  }

}

