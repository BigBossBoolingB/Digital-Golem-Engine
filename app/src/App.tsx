import { useState, useEffect, useReducer } from 'react';
import { GenomeSequencer } from './components/GenomeSequencer';
import { NeuralWeaver } from './components/NeuralWeaver';
import { CrucibleViewer } from './components/CrucibleViewer';
import { appReducer, initialState } from './state/appReducer';

function App() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [config, setConfig] = useState(null);
  const [robotState, setRobotState] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Request initial config on mount
    window.ipcRenderer?.send('get-config');

    const handlePythonStdout = (_event: any, data: string) => {
      try {
        const parsed = JSON.parse(data);
        switch (parsed.type) {
          case 'status':
            // You might want to display this status somewhere in the UI
            break;
          case 'delta':
            setOutput((prevOutput) => prevOutput + parsed.content);
            break;
          case 'robot_state':
            setRobotState(parsed.content);
            break;
          case 'error':
            setErrorMessage(parsed.content);
            break;
          case 'done':
            // The full response is now in `parsed.content`, which is already accumulated in `output`
            break;
        }
      } catch (e) {
        // Fallback for non-JSON data
        setOutput((prevOutput) => prevOutput + data);
      }
    };

    const handlePythonStderr = (_event: any, data: string) => {
        setErrorMessage(prev => prev ? `${prev}\n${data}` : data);
    };

    const handleGetConfigReply = (_event: any, data: any) => {
      if (data.error) {
        setErrorMessage(`Failed to load config: ${data.error}`);
      } else {
        setConfig(data);
      }
    };

    const handleSaveConfigReply = (_event: any, data: any) => {
        if (data.error) {
            setSaveStatus(`Error saving config: ${data.error}`);
        } else {
            setSaveStatus('Config saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000); // Clear message after 3s
        }
    };

    window.ipcRenderer?.on('python-stdout', handlePythonStdout);
    window.ipcRenderer?.on('python-stderr', handlePythonStderr);
    window.ipcRenderer?.on('get-config-reply', handleGetConfigReply);
    window.ipcRenderer?.on('save-config-reply', handleSaveConfigReply);

    return () => {
      window.ipcRenderer?.off('python-stdout', handlePythonStdout);
      window.ipcRenderer?.off('python-stderr', handlePythonStderr);
      window.ipcRenderer?.off('get-config-reply', handleGetConfigReply);
      window.ipcRenderer?.off('save-config-reply', handleSaveConfigReply);
    };
  }, []);

  useEffect(() => {
    if (config && state.selectedGenome) {
      const newConfig = JSON.parse(JSON.stringify(config));
      const aegisSystem = newConfig.entity.operational_systems.find(
        (system: { name: string; }) => system.name === 'A.E.G.I.S._X._Protocol'
      );
      if (aegisSystem) {
        aegisSystem.purpose = state.selectedGenome;
        setConfig(newConfig);
      }
    }
  }, [state.selectedGenome]);

  useEffect(() => {
    if (config && state.selectedNeural) {
      const newConfig = JSON.parse(JSON.stringify(config));
      const luxCoreSystem = newConfig.entity.operational_systems.find(
        (system: { name: string; }) => system.name === 'Lux_Core'
      );
      if (luxCoreSystem) {
        luxCoreSystem.purpose = state.selectedNeural;
        setConfig(newConfig);
      }
    }
  }, [state.selectedNeural]);

  const handleRunPython = () => {
    setOutput('');
    setErrorMessage('');
    setRobotState(null);
    window.ipcRenderer?.send('run-python');
  };

  const handleSaveConfig = () => {
      if (config) {
          window.ipcRenderer?.send('save-config', config);
      }
  };

  const handleSend = () => {
    setOutput('');
    setErrorMessage('');
    const message = { type: 'command', content: input };
    window.ipcRenderer?.send('python-stdin', message);
    setInput('');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Digital Golem Engine</h1>
        <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={handleSaveConfig}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Save Config
            </button>
            <button
              onClick={handleRunPython}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Run AI
            </button>
        </div>
        {saveStatus && <p className="text-sm mt-2 text-green-400">{saveStatus}</p>}
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        <div className="md:col-span-1 flex flex-col gap-4">
          <GenomeSequencer dispatch={dispatch} />
          <NeuralWeaver dispatch={dispatch} />
          <CrucibleViewer config={config} />
          {robotState && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🤖 Robot State</h3>
              <pre className="text-xs">{JSON.stringify(robotState, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex-grow bg-black rounded-lg p-4 overflow-auto">
            <pre>{output}</pre>
          </div>
          {errorMessage && (
            <div className="p-4 bg-red-800 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🚨 Failsafe Alert / Error</h3>
              <pre className="text-xs whitespace-pre-wrap">{errorMessage}</pre>
            </div>
          )}
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