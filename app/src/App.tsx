import { useReducer } from 'react'

type SkeletalMaterial = 'GrapheneComposite' | 'CarbonSteelAlloy'
type MusculatureType = 'CarbonFiberWeave' | 'ElectroactivePolymer'
type DermalLayer = 'BioLuminescentSheath' | 'ChameleonPlating'

type FoundationalModel = 'Gopher' | 'DeepSeekMoE' | 'Chimera'
type MemoryMatrix = 'Standard' | 'RETROProtocol'

type GenomeState = {
  skeletal: SkeletalMaterial
  musculature: MusculatureType
  dermal: DermalLayer
}

type LatticeState = {
  model: FoundationalModel
  memory: MemoryMatrix
  hasEthicalManifold: boolean
}

type State = { genome: GenomeState; lattice: LatticeState }

type Action =
  | { type: 'SET_SKELETAL'; value: SkeletalMaterial }
  | { type: 'SET_MUSCULATURE'; value: MusculatureType }
  | { type: 'SET_DERMAL'; value: DermalLayer }
  | { type: 'SET_MODEL'; value: FoundationalModel }
  | { type: 'SET_MEMORY'; value: MemoryMatrix }
  | { type: 'TOGGLE_ETHICAL' }

const initialState: State = {
  genome: {
    skeletal: 'GrapheneComposite',
    musculature: 'ElectroactivePolymer',
    dermal: 'ChameleonPlating',
  },
  lattice: {
    model: 'DeepSeekMoE',
    memory: 'RETROProtocol',
    hasEthicalManifold: true,
  },
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SKELETAL':
      return { ...state, genome: { ...state.genome, skeletal: action.value } }
    case 'SET_MUSCULATURE':
      return { ...state, genome: { ...state.genome, musculature: action.value } }
    case 'SET_DERMAL':
      return { ...state, genome: { ...state.genome, dermal: action.value } }
    case 'SET_MODEL':
      return { ...state, lattice: { ...state.lattice, model: action.value } }
    case 'SET_MEMORY':
      return { ...state, lattice: { ...state.lattice, memory: action.value } }
    case 'TOGGLE_ETHICAL':
      return { ...state, lattice: { ...state.lattice, hasEthicalManifold: !state.lattice.hasEthicalManifold } }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="w-screen h-screen bg-slate-900 text-slate-100">
      <header className="px-4 py-3 border-b border-slate-800">
        <h1 className="text-xl font-semibold">Project Chimera: Digital Golem Engine</h1>
      </header>
      <main className="flex h-[calc(100vh-56px)]">
        <div className="w-1/2 flex flex-col divide-y divide-slate-800">
          <section className="p-4 h-1/2 overflow-auto">
            <h2 className="text-lg font-medium mb-3">Genome Sequencer</h2>
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm text-slate-300">Skeletal Material</p>
                <div className="flex gap-2">
                  {(['GrapheneComposite', 'CarbonSteelAlloy'] as SkeletalMaterial[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => dispatch({ type: 'SET_SKELETAL', value: opt })}
                      className={`px-3 py-1 rounded border ${state.genome.skeletal === opt ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-300">Musculature Type</p>
                <div className="flex gap-2">
                  {(['CarbonFiberWeave', 'ElectroactivePolymer'] as MusculatureType[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => dispatch({ type: 'SET_MUSCULATURE', value: opt })}
                      className={`px-3 py-1 rounded border ${state.genome.musculature === opt ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-300">Dermal Layer</p>
                <div className="flex gap-2">
                  {(['BioLuminescentSheath', 'ChameleonPlating'] as DermalLayer[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => dispatch({ type: 'SET_DERMAL', value: opt })}
                      className={`px-3 py-1 rounded border ${state.genome.dermal === opt ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="p-4 h-1/2 overflow-auto">
            <h2 className="text-lg font-medium mb-3">Neural Lattice Weaver</h2>
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm text-slate-300">Foundational Model</p>
                <div className="flex gap-2">
                  {(['Gopher', 'DeepSeekMoE', 'Chimera'] as FoundationalModel[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => dispatch({ type: 'SET_MODEL', value: opt })}
                      className={`px-3 py-1 rounded border ${state.lattice.model === opt ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-300">Memory Matrix</p>
                <div className="flex gap-2">
                  {(['Standard', 'RETROProtocol'] as MemoryMatrix[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => dispatch({ type: 'SET_MEMORY', value: opt })}
                      className={`px-3 py-1 rounded border ${state.lattice.memory === opt ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-300">Ethical Manifold</label>
                <input
                  type="checkbox"
                  checked={state.lattice.hasEthicalManifold}
                  onChange={() => dispatch({ type: 'TOGGLE_ETHICAL' })}
                />
              </div>
            </div>
          </section>
        </div>

        <section className="w-1/2 p-4 border-l border-slate-800 overflow-auto">
          <h2 className="text-lg font-medium mb-3">Crucible Viewer</h2>
          <div className="bg-slate-800 rounded p-4">
            <pre className="text-xs">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        </section>
      </main>
    </div>
  )
}
