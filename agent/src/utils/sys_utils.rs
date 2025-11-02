use hostname::get as get_hostname_os;

pub fn detect_hostname() -> String {
    get_hostname_os().ok().and_then(|s| s.into_string().ok()).unwrap_or_else(|| "unknown-host".into())
}

pub fn detect_ip() -> String {
    match get_if_addrs::get_if_addrs() {
        Ok(addrs) => addrs
            .into_iter()
            .filter(|a| !a.is_loopback())
            .find_map(|a| match a.ip() {
                std::net::IpAddr::V4(v4) => Some(v4.to_string()),
                _ => None,
            })
            .unwrap_or_else(|| "127.0.0.1".into()),
        Err(_) => "127.0.0.1".into(),
    }
}

pub fn detect_os_string() -> String {
    let info = os_info::get();
    format!("{} {}", info.os_type(), info.version())
}

pub fn agent_version() -> String { env!("CARGO_PKG_VERSION").to_string() }
