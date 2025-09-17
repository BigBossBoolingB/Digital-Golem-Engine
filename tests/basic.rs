use digital_golem_engine::genome_sequencer::{
    DermalLayer, DigitalGenome, GeneBlock, MusculatureType, SkeletalMaterial,
};
use digital_golem_engine::neural_weaver::{
    FoundationalModel, MemoryMatrix, NeuralConfig, NeuralLattice,
};
use digital_golem_engine::MetaHuman;

#[test]
fn can_construct_metahuman() {
    let block = GeneBlock {
        skeletal: SkeletalMaterial::GrapheneComposite,
        musculature: MusculatureType::ElectroactivePolymer,
        dermal: DermalLayer::ChameleonPlating,
    };
    let genome = DigitalGenome::new("G-TEST".to_string(), block);
    let cfg = NeuralConfig {
        model: FoundationalModel::Chimera,
        memory: MemoryMatrix::Standard,
        has_ethical_manifold: false,
    };
    let lattice = NeuralLattice::new(cfg);
    let mh = MetaHuman::new("Unit Test Subject".to_string(), genome, lattice);

    assert_eq!(mh.id, "Unit Test Subject");
    match mh.genome.core_block.skeletal {
        SkeletalMaterial::GrapheneComposite => {}
        _ => panic!("unexpected skeletal material"),
    }
}
