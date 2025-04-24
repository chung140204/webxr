import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { OrbitControls } from '@react-three/drei'
import { VRScene } from './components/VRScene'

function App() {
  return (
    <>
      <VRButton />
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
        <XR>
          <Controllers />
          <Hands />
          <VRScene />
        </XR>
      </Canvas>
    </>
  )
}

export default App 