use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.iter().any(|a| a == "--handshake") {
        digital_golem_engine::ipc::perform_handshake();
        return;
    }
    
    if let Some(data_index) = args.iter().position(|a| a == "--data") {
        if let Some(json_data) = args.get(data_index + 1) {
            match digital_golem_engine::ipc::process_meta_human_data(json_data) {
                Ok(()) => println!("Meta-Human data processed successfully!"),
                Err(e) => eprintln!("Error processing meta-human data: {}", e),
            }
            return;
        } else {
            eprintln!("Error: --data flag requires a JSON payload");
            return;
        }
    }

    println!("Digital Golem Engine core. Use --handshake to test IPC or --data <json> to process meta-human data.");
}
