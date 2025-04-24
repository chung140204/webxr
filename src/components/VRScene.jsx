import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Interactive, useXR } from '@react-three/xr'
import { useGLTF } from '@react-three/drei'

function Box({ color, size, scale, children, ...props }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const [grabbed, setGrabbed] = useState(false)

  useFrame((state, delta) => {
    if (!grabbed) {
      ref.current.rotation.x += delta * 0.2
      ref.current.rotation.y += delta * 0.2
    }
  })

  return (
    <Interactive 
      onSelect={() => setGrabbed(!grabbed)}
      onHover={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <mesh
        {...props}
        ref={ref}
        scale={grabbed ? scale * 1.5 : scale}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={hovered ? 'hotpink' : color} />
        {children}
      </mesh>
    </Interactive>
  )
}

function Floor(props) {
  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial color="#808080" roughness={1} metalness={0} />
    </mesh>
  )
}

export function VRScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 6, 0]} intensity={1} />
      <Floor position={[0, 0, 0]} />
      
      {/* Generate multiple boxes with random positions */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={i}
          color={`hsl(${Math.random() * 360}, 100%, 75%)`}
          size={[0.15, 0.15, 0.15]}
          scale={1}
          position={[
            Math.random() * 2 - 1,
            Math.random() * 2,
            Math.random() * 2 - 1
          ]}
        />
      ))}
    </>
  )
} 