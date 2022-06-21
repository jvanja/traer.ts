export class Vector3D {

  /**
   * The first element of a Vector3D object, such as
   * the x coordinate of a point in the three-dimensional space. The default value is 0.
   */
  public x: number;

  /**
   * The x axis defined as a Vector3D object with coordinates (1,0,0).
   */
  public X_AXIS: Vector3D;

  /**
   * The second element of a Vector3D object, such as
   * the y coordinate of a point in the three-dimensional space. The default value is 0.
   */
  public y: number;

  /**
   * The y axis defined as a Vector3D object with coordinates (0,1,0).
   */
  public Y_AXIS: Vector3D;

  /**
   * The third element of a Vector3D object, such as
   * the z coordinate of a point in three-dimensional space. The default value is 0.
   */
  public z: number;

  /**
   * The width of a Vector3D object
   * The default value is 0.
   */
  public w: number;

  /**
   * The z axis defined as a Vector3D object with coordinates (0,0,1).
   */
  public Z_AXIS: Vector3D;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }


  /**
   * The length, magnitude, of the current Vector3D object from the origin (0,0,0) to 
   * the object's x, y, and z coordinates. The w
   * property is ignored. A unit vector has a length or magnitude of one.
   */
  public static distance(p1: Vector3D, p2: Vector3D): number {
    var xd = p2.x - p1.x;
    var yd = p2.y - p1.y;
    var zd = p2.z - p1.z;
    return Math.sqrt(xd * xd + yd * yd + zd * zd);
  }

  public add(p2: Vector3D): Vector3D {
    return new Vector3D(p2.x + this.x, p2.y + this.y, p2.z + this.z, p2.w + this.w);
  }

  public subtract(p2: Vector3D): Vector3D {
    return new Vector3D(p2.x - this.x, p2.y - this.y, p2.z - this.z, p2.w - this.w);
  }

  public clone(): Vector3D {
    return new Vector3D(this.x, this.y, this.z, this.w);
  }

  public scaleBy(s: number) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
  }

}

