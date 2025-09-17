pub mod genome_sequencer;
pub mod neural_weaver;

use genome_sequencer::DigitalGenome;
use neural_weaver::NeuralLattice;

#[derive(Debug)]
pub struct MetaHuman {
    pub id: String,
    pub genome: DigitalGenome,
    pub lattice: NeuralLattice,
}

impl MetaHuman {
    pub fn new(id: String, genome: DigitalGenome, lattice: NeuralLattice) -> Self {
        MetaHuman {
            id,
            genome,
            lattice,
        }
    }

    pub fn print_summary(&self) {
        println!("\n--- MetaHuman Profile: {} ---", self.id);
        println!("Genome ID: {}", self.genome.id);
        println!("  - Skeletal: {:?}", self.genome.core_block.skeletal);
        println!("  - Musculature: {:?}", self.genome.core_block.musculature);
        println!("Lattice Architecture: ");
        println!("  - Model: {:?}", self.lattice.config.model);
        println!("  - Memory: {:?}", self.lattice.config.memory);
        println!("------------------------------------");
    }
}
