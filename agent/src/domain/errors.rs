use thiserror::Error;

#[derive(Debug, Error)]
pub enum AgentError {
    #[error("missing API key (use --api-key or set API_KEY)")]
    MissingApiKey,
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Http(#[from] reqwest::Error),
    #[error(transparent)]
    Json(#[from] serde_json::Error),
}
