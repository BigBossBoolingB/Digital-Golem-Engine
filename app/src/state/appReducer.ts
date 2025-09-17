interface GeneBlock { skeletal: string; musculature: string; dermal: string; }
interface NeuralConfig { model: any; memory: string; has_ethical_manifold: boolean; }

export interface AppState {
  selectedGenome: GeneBlock | null;
  selectedNeural: NeuralConfig | null;
}

export type Action = 
  | { type: 'SELECT_GENOME'; payload: GeneBlock }
  | { type: 'SELECT_NEURAL'; payload: NeuralConfig };

export const initialState: AppState = {
  selectedGenome: null,
  selectedNeural: null,
};

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_GENOME':
      return { ...state, selectedGenome: action.payload };
    case 'SELECT_NEURAL':
      return { ...state, selectedNeural: action.payload };
    default:
      return state;
  }
}
