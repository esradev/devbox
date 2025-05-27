use serde::{Deserialize, Serialize};
use tauri::utils::platform::current_exe;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone)]
pub struct SiteData {
    #[serde(default)]
    pub id: String,
    pub name: String,
    pub url: String,
    pub username: String,
    pub application_password: String,
}

// Helper to get sites file path
fn get_sites_file() -> Result<PathBuf, String> {
    let exe_path = current_exe().map_err(|e| e.to_string())?;
    let data_dir = exe_path.parent().map(PathBuf::from).ok_or("No app data dir")?;
    std::fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
    Ok(data_dir.join("remote_wordpress_sites.json"))
}

#[tauri::command]
pub fn save_site(mut site: SiteData) -> Result<(), String> {
    let sites_file = get_sites_file()?;
    let mut sites: Vec<SiteData> = if sites_file.exists() {
        let content = std::fs::read_to_string(&sites_file).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        vec![]
    };

    // Always generate an id if missing or empty
    if site.id.trim().is_empty() {
        site.id = format!("remote-{}", chrono::Utc::now().timestamp_millis());
    }
    sites.push(site);

    let serialized = serde_json::to_string_pretty(&sites).map_err(|e| e.to_string())?;
    std::fs::write(&sites_file, &serialized).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn load_sites() -> Result<Vec<SiteData>, String> {
    let sites_file = get_sites_file()?;
    if sites_file.exists() {
        let content = std::fs::read_to_string(&sites_file).map_err(|e| e.to_string())?;
        let sites: Vec<SiteData> = serde_json::from_str(&content).unwrap_or_default();
        Ok(sites)
    } else {
        Ok(vec![])
    }
}

#[tauri::command]
pub fn delete_site(site_id: String) -> Result<(), String> {
    let sites_file = get_sites_file()?;
    let mut sites: Vec<SiteData> = if sites_file.exists() {
        let content = std::fs::read_to_string(&sites_file).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        vec![]
    };
    sites.retain(|site| site.id != site_id);
    std::fs::write(
        &sites_file,
        serde_json::to_string_pretty(&sites).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}
