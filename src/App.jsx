import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { VRScene } from './components/VRScene'

function App() {
  return (
    <>
      <VRButton />
      <Canvas>
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