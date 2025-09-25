import { useState, useEffect, useReducer } from 'react';
import { GenomeSequencer } from './components/GenomeSequencer';
import { NeuralWeaver } from './components/NeuralWeaver';
import { appReducer, initialState } from './state/appReducer';
import { CrucibleViewer } from './components/CrucibleViewer';

function App() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [config, setConfig] = useState(null);
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    window.ipcRenderer?.on('python-stdout', (_event, data: string) => {
      setOutput((prevOutput) => prevOutput + data);
    });

    window.ipcRenderer?.on('get-config-reply', (_event, data) => {
      setConfig(data);
    });

    window.ipcRenderer?.send('get-config');
  }, []);

  useEffect(() => {
    if (config && state.selectedGenome) {
      const newConfig = JSON.parse(JSON.stringify(config));
      newConfig.entity.operational_systems[0].purpose = state.selectedGenome;
      setConfig(newConfig);
    }
  }, [state.selectedGenome]);

  useEffect(() => {
    if (config && state.selectedNeural) {
      const newConfig = JSON.parse(JSON.stringify(config));
      newConfig.entity.operational_systems[1].purpose = state.selectedNeural;
      setConfig(newConfig);
    }
  }, [state.selectedNeural]);

  const handleStart = () => {
    window.ipcRenderer?.send('write-temp-config', config);
  };

  useEffect(() => {
    window.ipcRenderer?.on('write-temp-config-reply', (_event, tempConfigPath) => {
      window.ipcRenderer?.send('run-python', tempConfigPath);
    });
  }, []);

  const handleSend = () => {
    window.ipcRenderer?.send('python-stdin', input + '\n');
    setInput('');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Digital Golem Engine</h1>
        <button
          onClick={handleStart}
          className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
        >
          Start AI
        </button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        <div className="md:col-span-1 flex flex-col gap-4">
          <GenomeSequencer dispatch={dispatch} />
          <NeuralWeaver dispatch={dispatch} />
          <CrucibleViewer config={config} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex-grow bg-black rounded-lg p-4 overflow-auto">
            <pre>{output}</pre>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-gray-800 rounded-lg p-2"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;