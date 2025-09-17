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

pub fn process_ipc_payload(json_string: &str) {
    match serde_json::from_str::<IpcPayload>(json_string) {
        Ok(payload) => {
            let genome = DigitalGenome::new("ipc-gen-001".to_string(), payload.genome);
            let lattice = NeuralLattice::new(payload.neural);
            let metahuman = MetaHuman::new("Subject-IPC".to_string(), genome, lattice);
            metahuman.print_summary();
        }
        Err(e) => {
            println!("Error deserializing payload: {}", e);
        }
    }
}
