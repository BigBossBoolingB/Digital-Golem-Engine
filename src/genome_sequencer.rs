#[derive(Debug, Clone)]
pub enum SkeletalMaterial {
    GrapheneComposite,
    CarbonSteelAlloy,
}
#[derive(Debug, Clone)]
pub enum MusculatureType {
    CarbonFiberWeave,
    ElectroactivePolymer,
}
#[derive(Debug, Clone)]
pub enum DermalLayer {
    BioLuminescentSheath,
    ChameleonPlating,
}
#[derive(Debug, Clone)]
pub struct GeneBlock {
    pub skeletal: SkeletalMaterial,
    pub musculature: MusculatureType,
    pub dermal: DermalLayer,
}
#[derive(Debug)]
pub struct DigitalGenome {
    pub id: String,
    pub core_block: GeneBlock,
}
impl DigitalGenome {
    pub fn new(id: String, block: GeneBlock) -> Self {
        DigitalGenome {
            id,
            core_block: block,
        }
    }
}
