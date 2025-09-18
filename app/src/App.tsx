import { useReducer } from 'react';
import { GenomeSequencer } from './components/GenomeSequencer';
import { NeuralWeaver } from './components/NeuralWeaver';
import { CrucibleViewer } from './components/CrucibleViewer';
import { appReducer, initialState } from './state/appReducer';
import jsonData from './data/G1_Rook_S1_Archie.json';

function App() {
  const [, dispatch] = useReducer(appReducer, initialState);

  const handleConnect = () => {
    if (window.api) {
      window.api.send('connect-rust');
    } else {
      window.electron?.ipcRenderer.send('connect-rust');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Digital Golem Engine</h1>
        <button
          onClick={handleConnect}
          className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
        >
          Connect to Rust Core
        </button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        <div className="md:col-span-1 flex flex-col gap-4">
          <GenomeSequencer dispatch={dispatch} />
          <NeuralWeaver dispatch={dispatch} />
        </div>
        <div className="md:col-span-2">
          <CrucibleViewer jsonData={jsonData} />
        </div>
      </main>
    </div>
  );
}

export default App;
