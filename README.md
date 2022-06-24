# Traer physics 3.0 library ported to TypeScript

A simple particle system physics engine for processing rewritten in TypeScript. All this is supposed to do is let you make particles, apply forces and calculate the positions of particles over time in real-time. Anything else you need to handle yourself.

## There are four parts

1. [ParticleSystem](https://github.com/jvanja/traer_ts/blob/main/src/ParticleSystem.ts) - takes care of gravity, drag, making particles, applying forces and advancing the simulation
2. [Particles](https://github.com/jvanja/traer_ts/blob/main/src/Particle.ts) - they move around in 3D space based on forces you've applied to them
3. [Springs](https://github.com/jvanja/traer_ts/blob/main/src/Spring.ts) - they act on two particles
4. [Attractions](https://github.com/jvanja/traer_ts/blob/main/src/Attraction.ts) - which also act on two particles

## Examples

[Cloth](https://vanjajelic.com/test/traer/cloth.html)  
[Random Arboretum](https://vanjajelic.com/test/traer/arboretum.html)  
[Simple Pendulum](https://vanjajelic.com/test/traer/pendulum.html)  
[Bouncy Balls](https://vanjajelic.com/test/traer/bouncy.html)  

---
* Original source for processing is here: [http://murderandcreate.com/physics/](http://murderandcreate.com/physics/)
* All credit goes to [Jeffrey Trær Bernstein](jeff@traer.cc)
