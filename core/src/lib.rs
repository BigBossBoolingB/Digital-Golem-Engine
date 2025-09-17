pub mod ipc;
pub mod genome_sequencer;
pub mod neural_weaver;

use genome_sequencer::DigitalGenome;
use neural_weaver::NeuralLattice;

#[derive(Debug)]
pub struct MetaHuman {
    pub id: String,
    pub genome: DigitalGenome,
    pub neural_lattice: NeuralLattice,
}

impl MetaHuman {
    pub fn new(id: String, genome: DigitalGenome, neural_lattice: NeuralLattice) -> Self {
        Self {
            id,
            genome,
            neural_lattice,
        }
    }

    pub fn print_summary(&self) {
        println!("=== MetaHuman Profile Summary ===");
        println!("🤖 Subject ID: {}", self.id);
        println!("🧬 Genome Block: {:?}", self.genome.core_block);
        println!("🧠 Neural Configuration: {:?}", self.neural_lattice.config);
        println!("🤖 Status: Meta-Human successfully generated!");
        println!("================================");
    }
}
