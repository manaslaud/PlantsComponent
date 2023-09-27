import React, {useRef} from 'react';
import { extend, useFrame } from '@react-three/fiber';
import glsl from 'babel-plugin-glsl/macro';
import * as THREE from 'three';
let textureLoader=new THREE.TextureLoader()
let text=textureLoader.load('8k_earth_nightmap.jpg')
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

 

const fragmentShaderTube = `
  uniform float time; // Time variable

  void main() {
    // Use the time uniform for some animation
    float r = 0.5 + 0.5 * sin(time);
    float g = 0.5 + 0.5 * sin(time + 2.0);
    float b = 0.5 + 0.5 * sin(time + 4.0);
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

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

function ReturnCurveMesh(curve,index){
  const ref=useRef()
 const clock =new THREE.Clock()
 useFrame(()=>{
  ref.current.uniforms.time.value=clock.getElapsedTime()
 })
  
  class CustomShaderMaterialTube extends THREE.ShaderMaterial {
  
    constructor() {
      super({
        vertexShader: vertexShader,
        fragmentShader: fragmentShaderTube,
        uniforms: {
          time:{
            value: 0
          }
        },
      });
    }
  }
  extend({ CustomShaderMaterialTube });
  return (
    <mesh scale={[5.1,5.1,5.1]} key={index}>
    <tubeGeometry args={[curve,20,0.003,8,false]}/>
    <customShaderMaterialTube ref={ref}/>
    </mesh>
  )
}


function Earth() {
 
 

  
  
 
  const cities = [
    {
      name: 'Mumbai',
      latitude: 19.0760,
      longitude: 72.8777,
      W: false,
      S: false,
    },
    {
      name: 'Tokyo',
      latitude: 35.682839,
      longitude: 139.759455,
      W: false,
      S: false,
    },
    {
      name: 'Sydney',
      latitude: -33.865143,
      longitude: 151.209900,
      W: true,
      S: true,
    },
    {
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      W: true,
      S: false,
    },
    {
      name: 'New York City',
      latitude: 40.7128,
      longitude: -74.0060,
      W: true,
      S: false,
    },
    {
      name: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      W: true,
      S: false,
    },
    {
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      W: true,
      S: false,
    },
    {
      name: 'Beijing',
      latitude: 39.9042,
      longitude: 116.4074,
      W: true,
      S: false,
    },
  ];
  

  const curvesArray=[] 
//(+ for E AND N - for W AND S)

 function convertLatLong(latitude,longitude){
 const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;
  return [latRad, lonRad]
 }
  // Sphere radius
  const radius = 5;
  // Calculate Cartesian coordinates using spherical coordinates
  function calcPosition(latRad,lonRad){
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = -radius * Math.cos(latRad) * Math.sin(lonRad); // Negative due to Three.js's coordinate system
return [x,y,z]  
  }
  function generateTubes(){
    
      for(let i=0 ;i<cities.length-1;i++){
      const startPoint = new THREE.Vector3(cities[i].x, cities[i].y, cities[i].z);
      const endPoint = new THREE.Vector3(cities[i + 1].x, cities[i + 1].y, cities[i+1].z);
      let points=[]
      for(let i=0;i<30;i++){
        let p=new THREE.Vector3().lerpVectors(startPoint,endPoint,i/30)
        p.normalize()
        points.push(p)
      }
      const curve = new THREE.CatmullRomCurve3(points);
      curvesArray.push(curve)
    }
   return(
    curvesArray.map((curve,index)=>{
      return(
        ReturnCurveMesh(curve,index)
      )
      
     })
   )
    
  }


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
        {
          cities.map((city,index)=>{
            const [latRad,longRad]= convertLatLong(city.latitude, city.longitude)
            const [x,y,z]=calcPosition(latRad,longRad)
           city.x=x
           city.y=y
           city.z=z
            return(
              <mesh position={[x,y,z]} scale={[1,1,1]} key={index}>
                <sphereGeometry args={[.06, 9, 9]} />
                <meshBasicMaterial color={0xffffff}/>
              </mesh>
            )
          })
        }
        {
          generateTubes()
        
        }
    </>
      
  );
}

export default Earth;