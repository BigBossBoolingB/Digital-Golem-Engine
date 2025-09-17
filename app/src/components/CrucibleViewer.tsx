import { Canvas } from '@react-three/fiber';
import { AppState } from '../state/appReducer';

interface Props {
  appState: AppState;
}

export const CrucibleViewer = ({ appState }: Props) => {
  const objectColor = appState.selectedGenome ? 'royalblue' : 'gray';

  return (
    <div className="p-4 bg-black rounded-lg h-full">
      <h3 className="text-lg font-bold mb-2">👁️ Crucible Viewer</h3>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={objectColor} />
        </mesh>
      </Canvas>
    </div>
  );
};
