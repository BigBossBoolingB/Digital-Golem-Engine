use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum SkeletalMaterial { GrapheneComposite, CarbonSteelAlloy }
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum MusculatureType { CarbonFiberWeave, ElectroactivePolymer }
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum DermalLayer { BioLuminescentSheath, ChameleonPlating }

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GeneBlock {
    pub skeletal: SkeletalMaterial,
    pub musculature: MusculatureType,
    pub dermal: DermalLayer,
}
#[derive(Debug, Serialize)]
pub struct DigitalGenome {
    pub id: String,
    pub core_block: GeneBlock,
}
impl DigitalGenome {
    pub fn new(id: String, block: GeneBlock) -> Self {
        DigitalGenome { id, core_block: block }
    }
}
