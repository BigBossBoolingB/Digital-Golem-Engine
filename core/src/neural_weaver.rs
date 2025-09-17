use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum FoundationalModel { Gopher(u64), DeepSeekMoE { total_params: u64, active_params: u64 }, Chimera }
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum MemoryMatrix { Standard, RETROProtocol }

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct NeuralConfig {
    pub model: FoundationalModel,
    pub memory: MemoryMatrix,
    pub has_ethical_manifold: bool,
}
#[derive(Debug, Serialize)]
pub struct NeuralLattice {
    pub config: NeuralConfig,
}
impl NeuralLattice {
    pub fn new(config: NeuralConfig) -> Self {
        NeuralLattice { config }
    }
}
