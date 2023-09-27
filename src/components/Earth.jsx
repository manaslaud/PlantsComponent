import React from 'react';
import { extend } from '@react-three/fiber';
import glsl from 'babel-plugin-glsl/macro';
import * as THREE from 'three';

let textureLoader=new THREE.TextureLoader()
let text=textureLoader.load('8k_earth_daymap.jpg')
class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        globeTexture:{
          value: text
        }
      },
    });
  }
}



const vertexShader = glsl`
  varying vec2 vUv;
  varying vec3 vertexNormal;
  void main(){
    vertexNormal=normalize(normalMatrix * normal);
    vUv=uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position , 1.0);
  }
`;

const fragmentShader = glsl`
uniform sampler2D globeTexture;
varying vec2 vUv;
varying vec3 vertexNormal;

void main() {
  float intensity =1.05 -               dot(vertexNormal,vec3(0.0,0.0,1.0));
  vec3 atmosphere =vec3(0.3,0.6,1.0)* pow(intensity,1.5);
  vec4 texColor = texture2D(globeTexture, vUv);
  gl_FragColor = vec4(atmosphere + texColor.xyz,1.0);
}

`;
const vertexShader2 = glsl`
  varying vec3 vertexNormal;
  void main(){
    vertexNormal=normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position , 1.0);
  }
`;

const fragmentShader2 = glsl`
varying vec3 vertexNormal;

void main() {
 
  float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
  gl_FragColor = vec4(0.3, 0.3, 1.0, .8) * intensity;
}

`;
class CustomShaderMaterial2 extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
  }
}

extend({ CustomShaderMaterial });
extend({ CustomShaderMaterial2 });


function Earth() {

  //MUMBAI
  //cartesian
  const latitude = 19.07;
  const longitude = 72.8769;

//(+ for E AND N - for W AND S)

  // Convert latitude and longitude to radians
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;

  // Sphere radius
  const radius = 5;

  // Calculate Cartesian coordinates using spherical coordinates
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad); // Negative due to Three.js's coordinate system


  return (
    <>
      <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[5, 90, 90]} />
          <customShaderMaterial/>
        </mesh>
        
        <mesh position={[0, 0, 0]} scale={[1.2,1.2,1.2]}>
          <sphereGeometry args={[5, 90, 90]} />
          <customShaderMaterial2 />
        </mesh>
        <mesh position={[x,y,z]} scale={[1,1,1]}>
          <sphereGeometry args={[.03, 9, 9]} />
         <meshBasicMaterial color={0xffffff}/>
        </mesh>
    </>
      
  );
}

export default Earth;