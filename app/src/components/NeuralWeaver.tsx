import { Action } from '../state/appReducer';

interface Props {
  dispatch: React.Dispatch<Action>;
}

const neuralOptions = [
  {
    name: 'Gopher(280B)',
    data: {
      model: { Gopher: 280000000000 },
      memory: 'Standard',
      has_ethical_manifold: true
    }
  },
  {
    name: 'DeepSeekMoE',
    data: {
      model: { DeepSeekMoE: { total_params: 16000000000, active_params: 2800000000 } },
      memory: 'RETROProtocol',
      has_ethical_manifold: true
    }
  },
  {
    name: 'Chimera',
    data: {
      model: 'Chimera',
      memory: 'Standard',
      has_ethical_manifold: false
    }
  }
];

export const NeuralWeaver = ({ dispatch }: Props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-2">🧠 Neural Lattice Weaver</h3>
      <div className="flex flex-wrap gap-2">
        {neuralOptions.map((opt) => (
          <button
            key={opt.name}
            onClick={() => dispatch({ type: 'SELECT_NEURAL', payload: opt.data })}
            className="bg-gray-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
};
