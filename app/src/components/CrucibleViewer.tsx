import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface MetaHumanData {
  id: string;
  genome: {
    id: string;
    core_block: {
      skeletal: string;
      musculature: string;
      dermal: string;
    };
  };
  neural_lattice: {
    config: {
      model: any;
      memory: string;
      has_ethical_manifold: boolean;
    };
  };
}

const ProceduralMesh = ({ data }: { data: MetaHumanData | null }) => {
  if (!data) return null;

  let geometry: JSX.Element = <boxGeometry args={[2, 2, 2]} />;
  if (data.genome.core_block.skeletal === 'GrapheneComposite') {
    geometry = <icosahedronGeometry args={[1.5, 0]} />;
  }

  let color = 'gray';
  if (data.genome.core_block.dermal === 'BioLuminescentSheath') {
    color = 'lightblue';
  } else if (data.genome.core_block.dermal === 'ChameleonPlating') {
    color = 'purple';
  }

  return (
    <mesh scale={1.5}>
      {geometry}
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
};

export const CrucibleViewer: React.FC = () => {
  const [metaHuman, setMetaHuman] = useState<MetaHumanData | null>(null);

  useEffect(() => {
    window.api?.on?.('metahuman-generated', (data: string) => {
      try {
        const parsedData = JSON.parse(data);
        setMetaHuman(parsedData);
      } catch (e) {
        console.error("Failed to parse MetaHuman JSON:", e);
      }
    });
  }, []);

  return (
    <div className="p-4 bg-black rounded-lg h-full">
      <h3 className="text-lg font-bold mb-2">👁️ Crucible Viewer</h3>
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <ProceduralMesh data={metaHuman} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
