#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod sites;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            sites::save_site,
            sites::load_sites,
            sites::delete_site
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
