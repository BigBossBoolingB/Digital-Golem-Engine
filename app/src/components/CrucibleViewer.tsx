import { Canvas } from '@react-three/fiber';
import { AppState } from '../state/appReducer';

interface Props {
  appState: AppState;
}

function scaleForNeural(selection: string | null): [number, number, number] {
  switch (selection) {
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

export const CrucibleViewer = ({ appState }: Props) => {
  const objectColor = appState.selectedGenome ? 'royalblue' : 'gray';
  const scale = scaleForNeural(appState.selectedNeural);

  return (
    <div className="p-4 bg-black rounded-lg h-full">
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
