import { Action } from '../state/appReducer';

interface Props {
  dispatch: React.Dispatch<Action>;
}

const genomeOptions = ['GrapheneComposite', 'CarbonSteelAlloy'];

export const GenomeSequencer = ({ dispatch }: Props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-2">🧬 Genome Sequencer</h3>
      <div className="flex flex-wrap gap-2">
        {genomeOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => dispatch({ type: 'SELECT_GENOME', payload: opt })}
            className="bg-gray-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
