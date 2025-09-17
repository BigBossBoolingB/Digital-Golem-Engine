use crate::{GeneBlock, NeuralConfig, MetaHuman};
use serde_json;

pub fn perform_handshake() {
    println!("Rust Core Connected: Handshake successful.");
}

pub fn process_meta_human_data(json_data: &str) -> Result<(), Box<dyn std::error::Error>> {
    let data: serde_json::Value = serde_json::from_str(json_data)?;
    
    let selected_genome = data["selectedGenome"]
        .as_str()
        .ok_or("Missing selectedGenome")?;
    let selected_neural = data["selectedNeural"]
        .as_str()
        .ok_or("Missing selectedNeural")?;
    
    let gene_block = GeneBlock {
        name: selected_genome.to_string(),
    };
    
    let neural_config = NeuralConfig {
        name: selected_neural.to_string(),
    };
    
    let meta_human = MetaHuman::new(gene_block, neural_config);
    meta_human.print_summary();
    
    Ok(())
}
