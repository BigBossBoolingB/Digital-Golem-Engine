import { useReducer } from 'react';
import { GenomeSequencer } from './components/GenomeSequencer';
import { NeuralWeaver } from './components/NeuralWeaver';
import { CrucibleViewer } from './components/CrucibleViewer';
import { appReducer, initialState } from './state/appReducer';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleConnect = () => {
    if (!state.selectedGenome || !state.selectedNeural) {
      alert('Please select a Genome and Neural option first.');
      return;
    }

    const payload = {
      genome: {
        skeletal: state.selectedGenome.skeletal,
        musculature: state.selectedGenome.musculature,
        dermal: state.selectedGenome.dermal,
      },
      neural: {
        model: state.selectedNeural.model,
        memory: state.selectedNeural.memory,
        has_ethical_manifold: state.selectedNeural.has_ethical_manifold,
      },
    };

    window.api?.send('connect-rust', JSON.stringify(payload));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Digital Golem Engine</h1>
        <button 
          onClick={handleConnect} 
          className="mt-4 py-2 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg disabled:bg-gray-500"
          disabled={!state.selectedGenome || !state.selectedNeural}
        >
          Generate MetaHuman
        </button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        <div className="md:col-span-1 flex flex-col gap-4">
          <GenomeSequencer dispatch={dispatch} />
          <NeuralWeaver dispatch={dispatch} />
        </div>
        <div className="md:col-span-2">
          <CrucibleViewer />
        </div>
      </main>
    </div>
  );
}

export default App;
