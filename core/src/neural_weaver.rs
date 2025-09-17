use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub enum FoundationalModel { Gopher(u64), DeepSeekMoE { total_params: u64, active_params: u64 }, Chimera }
#[derive(Debug, Clone, Deserialize)]
pub enum MemoryMatrix { Standard, RETROProtocol }

#[derive(Debug, Clone, Deserialize)]
pub struct NeuralConfig {
    pub model: FoundationalModel,
    pub memory: MemoryMatrix,
    pub has_ethical_manifold: bool,
}
#[derive(Debug)]
pub struct NeuralLattice {
    pub config: NeuralConfig,
}
impl NeuralLattice {
    pub fn new(config: NeuralConfig) -> Self {
        NeuralLattice { config }
    }
}
