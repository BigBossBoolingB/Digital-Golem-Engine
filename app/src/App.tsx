import { useReducer } from 'react';
import { GenomeSequencer } from './components/GenomeSequencer';
import { CrucibleViewer } from './components/CrucibleViewer';
import { appReducer, initialState } from './state/appReducer';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Digital Golem Engine</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        <div className="md:col-span-1 flex flex-col gap-4">
          <GenomeSequencer dispatch={dispatch} />
        </div>
        <div className="md:col-span-2">
          <CrucibleViewer appState={state} />
        </div>
      </main>
    </div>
  );
}

export default App;
