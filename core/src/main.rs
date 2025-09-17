use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.iter().any(|a| a == "--handshake") {
        digital_golem_engine::ipc::perform_handshake();
        return;
    }

    println!("Digital Golem Engine core. Use --handshake to test IPC.");
}
