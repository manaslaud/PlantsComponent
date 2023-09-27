import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './components/Earth';
import { Scene } from 'three';
import * as THREE from 'three';



function App() {
  
  return (
    <div className='w-[full] h-screen'>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 12] }}
        gl={{ antialias: true, pixelRatio: window.devicePixelRatio,alpha:true }}
      >
        <OrbitControls />
        <color attach="background" args={['#000']} />
      <Earth/>    
      </Canvas>
    </div>
  );
}

export default App;
