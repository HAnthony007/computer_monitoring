use clap::{ArgAction, Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser, Debug, Clone)]
#[command(name = "cm-agent", version, about = "Computer Monitoring Rust Agent")]
pub struct Cli {
    /// Server base URL (without trailing slash)
    #[arg(long, env = "SERVER_URL", global = true, default_value = "http://localhost:8080")]
    pub server_url: String,

    #[command(subcommand)]
    pub command: Option<Commands>,
}

#[derive(Subcommand, Debug, Clone)]
pub enum Commands {
    /// Run the agent loop (collect + send)
    Run {
        /// API Key in form: <agentId>.<secret>
        #[arg(long, env = "API_KEY")]
        api_key: Option<String>,

        /// Path to a file containing the API key
        #[arg(long, env = "API_KEY_FILE")]
        api_key_file: Option<PathBuf>,

        /// Metrics send interval in seconds
        #[arg(long, env = "INTERVAL_SECS", default_value_t = 10)]
        interval_secs: u64,

        /// Heartbeat interval in seconds
        #[arg(long, env = "HEARTBEAT_SECS", default_value_t = 30)]
        heartbeat_secs: u64,

        /// Print payloads to stdout
        #[arg(long, action = ArgAction::SetTrue)]
        dry_run: bool,
    },

    /// Register this machine to obtain an API key
    Register {
        /// Explicit hostname (auto if omitted)
        #[arg(long, env = "HOSTNAME")]
        hostname: Option<String>,

        /// Explicit IP address (auto if omitted)
        #[arg(long, env = "IP_ADDRESS")]
        ip_address: Option<String>,

        /// OS description (auto if omitted)
        #[arg(long, env = "AGENT_OS")]
        os: Option<String>,

        /// Agent version override
        #[arg(long, env = "AGENT_VERSION")]
        agent_version: Option<String>,
    },
}
