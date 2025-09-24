import { useState, useEffect } from 'react';

function App() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    window.ipcRenderer?.on('python-stdout', (_event, data: string) => {
      setOutput((prevOutput) => prevOutput + data);
    });
  }, []);

  const handleStart = () => {
    window.ipcRenderer?.send('run-python');
  };

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
      <main className="flex-grow flex flex-col gap-4">
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
      </main>
    </div>
  );
}

export default App;