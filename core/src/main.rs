use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() > 1 {
        let json_payload = &args[1];
        digital_golem_engine::ipc::process_ipc_payload(json_payload);
    } else {
        println!("--- Digital Golem Engine: Ready for IPC ---");
    }
}
