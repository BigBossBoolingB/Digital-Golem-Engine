use crate::{
    genome_sequencer::{DigitalGenome, GeneBlock},
    neural_weaver::{NeuralLattice, NeuralConfig},
    MetaHuman,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct IpcPayload {
    genome: GeneBlock,
    neural: NeuralConfig,
}

pub fn process_ipc_payload(json_string: &str) -> String {
    match serde_json::from_str::<IpcPayload>(json_string) {
        Ok(payload) => {
            let genome = DigitalGenome::new("ipc-gen-001".to_string(), payload.genome);
            let lattice = NeuralLattice::new(payload.neural);
            let metahuman = MetaHuman::new("Subject-IPC".to_string(), genome, lattice);
            
            serde_json::to_string(&metahuman)
                .unwrap_or_else(|e| format!("{{\"error\":\"Serialization failed: {}\"}}", e))
        }
        Err(e) => {
            format!("{{\"error\":\"Deserialization failed: {}\"}}", e)
        }
    }
}
