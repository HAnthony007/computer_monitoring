use std::fs;
use std::io::Write;
use std::path::PathBuf;

pub fn default_key_path() -> PathBuf {
    if let Ok(p) = std::env::var("CM_AGENT_KEY_FILE") { return PathBuf::from(p); }
    if let Some(home) = std::env::var_os("HOME") {
        return PathBuf::from(home).join(".config").join("cm-agent").join("api_key");
    }
    PathBuf::from(".cm-agent-api-key")
}

pub fn read_api_key_from_path(path: &PathBuf) -> Option<String> {
    match fs::read_to_string(path) {
        Ok(s) => Some(s.trim().to_string()),
        Err(_) => None,
    }
}

pub fn ensure_parent_dir(path: &PathBuf) -> std::io::Result<()> {
    if let Some(parent) = path.parent() { fs::create_dir_all(parent)?; }
    Ok(())
}

#[cfg(unix)]
pub fn set_secure_perms(path: &PathBuf) -> std::io::Result<()> {
    use std::os::unix::fs::PermissionsExt;
    let perms = fs::Permissions::from_mode(0o600);
    fs::set_permissions(path, perms)
}

#[cfg(not(unix))]
pub fn set_secure_perms(_path: &PathBuf) -> std::io::Result<()> { Ok(()) }

pub fn write_api_key_to_path(path: &PathBuf, key: &str) -> std::io::Result<()> {
    ensure_parent_dir(path)?;
    let mut f = fs::OpenOptions::new().create(true).write(true).truncate(true).open(path)?;
    f.write_all(key.as_bytes())?;
    set_secure_perms(path)?;
    Ok(())
}
