export interface AppState {
  selectedGenome: string | null;
  selectedNeural: string | null;
}

export type Action =
  | { type: 'SELECT_GENOME'; payload: string }
  | { type: 'SELECT_NEURAL'; payload: string };

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
