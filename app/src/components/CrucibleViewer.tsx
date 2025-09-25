import { Canvas } from '@react-three/fiber';

interface Props {
  config: {
    entity: {
      operational_systems: {
        name: string;
        purpose: string;
      }[];
    };
  } | null;
}

function colorForGenome(purpose: string | null): string {
  switch (purpose) {
    case 'GrapheneComposite':
      return 'hotpink';
    case 'CarbonSteelAlloy':
      return 'lightgreen';
    default:
      return 'royalblue';
  }
}

function scaleForNeural(purpose: string | null): [number, number, number] {
  switch (purpose) {
    case 'Gopher(280B)':
      return [1.2, 1.2, 1.2];
    case 'DeepSeekMoE':
      return [1.6, 1.2, 1.6];
    case 'Chimera':
      return [2.0, 2.0, 2.0];
    default:
      return [1, 1, 1];
  }
}

export const CrucibleViewer = ({ config }: Props) => {
  if (!config) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg h-full">
        <h3 className="text-lg font-bold mb-2">👁️ Crucible Viewer</h3>
        <p>No configuration loaded.</p>
      </div>
    );
  }

  const aegisSystem = config.entity.operational_systems.find(
    (system) => system.name === 'A.E.G.I.S._X._Protocol'
  );
  const luxCoreSystem = config.entity.operational_systems.find(
    (system) => system.name === 'Lux_Core'
  );

  const genomePurpose = aegisSystem?.purpose ?? null;
  const neuralPurpose = luxCoreSystem?.purpose ?? null;

  const objectColor = colorForGenome(genomePurpose);
  const scale = scaleForNeural(neuralPurpose);

  return (
    <div className="p-4 bg-gray-800 rounded-lg h-full">
      <h3 className="text-lg font-bold mb-2">👁️ Crucible Viewer</h3>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh scale={scale}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={objectColor} />
        </mesh>
      </Canvas>
    </div>
  );
};