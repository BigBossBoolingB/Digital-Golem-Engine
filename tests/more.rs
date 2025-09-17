use digital_golem_engine::genome_sequencer::{
    DermalLayer, DigitalGenome, GeneBlock, MusculatureType, SkeletalMaterial,
};
use digital_golem_engine::neural_weaver::{
    FoundationalModel, MemoryMatrix, NeuralConfig, NeuralLattice,
};

#[test]
fn digital_genome_new_sets_fields() {
    let block = GeneBlock {
        skeletal: SkeletalMaterial::CarbonSteelAlloy,
        musculature: MusculatureType::CarbonFiberWeave,
        dermal: DermalLayer::BioLuminescentSheath,
    };
    let genome = DigitalGenome::new("G-XYZ".to_string(), block.clone());
    assert_eq!(genome.id, "G-XYZ");
    match genome.core_block.skeletal {
        SkeletalMaterial::CarbonSteelAlloy => {}
        _ => panic!("unexpected skeletal material"),
    }
    match genome.core_block.musculature {
        MusculatureType::CarbonFiberWeave => {}
        _ => panic!("unexpected musculature type"),
    }
    match genome.core_block.dermal {
        DermalLayer::BioLuminescentSheath => {}
        _ => panic!("unexpected dermal layer"),
    }
}

#[test]
fn neural_lattice_new_sets_config() {
    let cfg = NeuralConfig {
        model: FoundationalModel::Gopher(42),
        memory: MemoryMatrix::RETROProtocol,
        has_ethical_manifold: true,
    };
    let lattice = NeuralLattice::new(cfg);
    match lattice.config.model {
        FoundationalModel::Gopher(n) => assert_eq!(n, 42),
        _ => panic!("unexpected model variant"),
    }
    match lattice.config.memory {
        MemoryMatrix::RETROProtocol => {}
        _ => panic!("unexpected memory matrix"),
    }
    assert!(lattice.config.has_ethical_manifold);
}
