use digital_golem_engine::genome_sequencer::{
    DermalLayer, DigitalGenome, GeneBlock, MusculatureType, SkeletalMaterial,
};
use digital_golem_engine::neural_weaver::{
    FoundationalModel, MemoryMatrix, NeuralConfig, NeuralLattice,
};
use digital_golem_engine::MetaHuman;

fn main() {
    println!("--- Initializing Digital Golem Engine ---");

    let first_genome_block = GeneBlock {
        skeletal: SkeletalMaterial::GrapheneComposite,
        musculature: MusculatureType::ElectroactivePolymer,
        dermal: DermalLayer::ChameleonPlating,
    };
    let first_genome = DigitalGenome::new("G-001".to_string(), first_genome_block);

    let first_lattice_config = NeuralConfig {
        model: FoundationalModel::DeepSeekMoE {
            total_params: 236,
            active_params: 21,
        },
        memory: MemoryMatrix::RETROProtocol,
        has_ethical_manifold: true,
    };
    let first_lattice = NeuralLattice::new(first_lattice_config);

    let subject_alpha = MetaHuman::new("Subject Alpha".to_string(), first_genome, first_lattice);

    subject_alpha.print_summary();
}
