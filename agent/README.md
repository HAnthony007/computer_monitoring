# cm-agent (Rust)

Agent Rust léger pour envoyer les métriques de la machine vers le serveur Spring Boot.

## Prérequis


Installation de Rust (fish):
 
```fish
curl -fsSL https://sh.rustup.rs | sh -s -- -y
set -Ux PATH $HOME/.cargo/bin $PATH
rustc -V
cargo -V
```

## Build
 
```fish
cd agent
cargo build --release
```
Le binaire sera dans `agent/target/release/cm-agent`.

## Utilisation

L'agent charge automatiquement un fichier `.env` s'il existe dans le dossier courant et résout la clé API dans cet ordre: `--api-key` > `--api-key-file` > variable d'environnement `API_KEY` > fichier `API_KEY_FILE`.

Commandes disponibles:

- `register`: enregistre la machine auprès du serveur et affiche une clé API à utiliser ensuite

  Flags utiles: `--server-url`, `--hostname`, `--ip-address`, `--agent-version`, `--agent-os` (tous optionnels; auto-détection par défaut)

- `run`: collecte et envoie les métriques en boucle, et envoie un heartbeat périodique

  - Flags:
    - `--server-url` (ou `SERVER_URL`) défaut: `http://localhost:8080`
    - `--api-key` (ou `API_KEY`) format: `idAgent.secret`
    - `--api-key-file` (ou `API_KEY_FILE`) chemin vers un fichier contenant la clé
    - `--heartbeat-secs` (ou `HEARTBEAT_SECS`) défaut: `30`
    - `--interval-secs` (ou `INTERVAL_SECS`) défaut: `10`
    - `--dry-run` pour afficher le JSON sans envoyer

Comportement automatique (sans saisie manuelle de clé):

- Si aucune clé n'est fournie via les options ci-dessus, l'agent:
  1) tente de lire une clé mise en cache à l'emplacement par défaut `~/.config/cm-agent/api_key` (ou chemin défini par `CM_AGENT_KEY_FILE`)
  2) à défaut, s'auto-enregistre auprès du serveur (`/api/agent/register`) avec détection automatique (hostname, IP, OS, version), récupère une `apiKey`, la sauvegarde au chemin ci-dessus (permissions 600) et démarre l'envoi des métriques

Exemples (fish):
 
```fish
# 1) Obtenir une clé API via l'enregistrement
./target/release/cm-agent register --server-url http://localhost:8080

# 2) Envoi réel toutes les 10s (avec heartbeat)
set -x API_KEY agent_seed_0001.926297b0fde540c1857ba1fbe6fa8f46
./target/release/cm-agent run --server-url http://localhost:8080

# Afficher seulement le payload
./target/release/cm-agent run --dry-run
```

Le payload envoyé:
 
```json
{
  "cpu": [{"usagePercent": 12.3, "recordedAt": "2025-11-01T12:00:00Z"}],
  "memory": [{"totalMb": 8192, "usedMb": 2048, "recordedAt": "..."}],
  "disks": [{"mountPoint": "/", "totalGb": 100.0, "usedGb": 25.0, "recordedAt": "..."}],
  "network": [{"interface": "eth0", "rxBytes": 123456, "txBytes": 7890, "recordedAt": "..."}]
}
```

## Service systemd (optionnel)

Crée `~/.config/systemd/user/cm-agent.service`:
 
```ini
[Unit]
Description=Computer Monitoring Rust Agent
After=network-online.target

[Service]
ExecStart=%h/computer_monitoring/agent/target/release/cm-agent --server-url http://localhost:8080
Environment=API_KEY=agent_seed_0001.926297b0fde540c1857ba1fbe6fa8f46
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

Puis:
 
```fish
systemctl --user daemon-reload
systemctl --user enable --now cm-agent.service
journalctl --user -u cm-agent.service -f
```

## Notes
 
- L’agent utilise `sysinfo` pour CPU/Mémoire/Disques/Réseau.
- Les bytes réseau sont cumulés depuis le boot (pas un débit). Les agrégations côté serveur peuvent calculer les deltas si nécessaire.
- Le serveur doit accepter l’entête `X-API-Key`.
- Cache de clé: par défaut dans `~/.config/cm-agent/api_key` (override via `CM_AGENT_KEY_FILE`).


