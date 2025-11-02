# Proposition d'Interface Web - Computer Monitoring System

## 📋 Vue d'ensemble

Interface web moderne et intuitive pour visualiser et gérer le monitoring des ordinateurs distants.

## 🏗️ Architecture de l'Interface

### Structure des Pages

```
/
├── /[role]/dashboard          → Dashboard principal avec vue d'ensemble
├── /[role]/computers          → Liste des ordinateurs monitorés
├── /[role]/computers/[id]    → Détails d'un ordinateur (métriques en temps réel)
├── /[role]/agents            → Gestion des agents
└── /[role]/settings          → Paramètres
```

### Composants Principaux

1. **Dashboard** (`/[role]/dashboard`)

    - Cards de statistiques globales (nombre d'ordinateurs, agents actifs, alertes)
    - Graphiques de tendances globales
    - Liste rapide des ordinateurs avec statuts

2. **Liste des Ordinateurs** (`/[role]/computers`)

    - Table avec colonnes : Hostname, IP, OS, Statut, Dernière mise à jour
    - Filtres par statut (ONLINE/OFFLINE/UNKNOWN)
    - Recherche par hostname/IP
    - Actions : Voir détails, Actions sur agent

3. **Détails Ordinateur** (`/[role]/computers/[id]`)

    - Header : Hostname, IP, OS, Statut agent, Dernière mise à jour
    - Métriques en temps réel (cartes)
    - Graphiques historiques :
        - CPU : Utilisation par cœur, Température
        - Mémoire : Utilisation, Tendances
        - Disques : Espace utilisé par point de montage
        - Réseau : Débit upload/download par interface
    - Liste des processus en cours
    - Sélecteur de période (1h, 6h, 24h, 7j, 30j)

4. **Gestion des Agents** (`/[role]/agents`)
    - Liste des agents avec statuts
    - Détails : ID Agent, Computer associé, Version, Dernier heartbeat
    - Actions : Regénérer clé API, Voir logs

## 📊 Métriques Affichées

### Dashboard Global

-   **Total Ordinateurs** : Nombre total d'ordinateurs monitorés
-   **Ordinateurs Actifs** : Nombre d'ordinateurs ONLINE (badge vert)
-   **Ordinateurs Inactifs** : Nombre d'ordinateurs OFFLINE (badge rouge)
-   **Agents Actifs** : Nombre d'agents avec heartbeat récent
-   **Taux de Disponibilité** : Pourcentage moyen de disponibilité

### Détails Ordinateur

-   **CPU** :
    -   Usage global (%)
    -   Usage par cœur (graphique en ligne)
    -   Température (°C) si disponible
    -   Nombre de cœurs, Modèle
-   **Mémoire** :
    -   Total / Utilisé / Libre (MB)
    -   Pourcentage d'utilisation
    -   Graphique d'évolution
-   **Disques** :
    -   Liste par point de montage
    -   Total / Utilisé / Libre (GB)
    -   Pourcentage d'utilisation
    -   Graphiques de tendances
-   **Réseau** :
    -   Par interface réseau
    -   Débit upload/download en temps réel (bps)
    -   Total upload/download (bytes cumulés)
-   **Processus** :
    -   Top processus par CPU/Mémoire
    -   Table avec PID, Programme, CPU%, Mémoire, Utilisateur

## 🎨 Design & UX

### Palette de Couleurs (selon statut)

-   **ONLINE** : Vert (`green-500`)
-   **OFFLINE** : Rouge (`red-500`)
-   **UNKNOWN** : Jaune/Orange (`yellow-500`)
-   **Chargement** : Gris (`gray-400`)

### Composants UI Utilisés

-   **shadcn/ui** : Cards, Tables, Charts, Badges, Dialogs
-   **Recharts** : Graphiques de métriques
-   **Lucide React** : Icônes (server, cpu, memory, disk, network, etc.)
-   **Tailwind CSS** : Styling responsive

### Responsive Design

-   Desktop : Layout avec sidebar + contenu principal
-   Tablet : Sidebar collapsible
-   Mobile : Bottom navigation ou menu hamburger

## 🔌 Endpoints Serveur Nécessaires

### À créer côté serveur Spring Boot

#### 1. Ordinateurs

```
GET  /api/computers                    → Liste tous les ordinateurs
GET  /api/computers/{id}               → Détails d'un ordinateur
GET  /api/computers/{id}/agents        → Agents d'un ordinateur
```

#### 2. Métriques

```
GET  /api/computers/{id}/metrics/latest     → Dernières métriques (temps réel)
GET  /api/computers/{id}/metrics            → Métriques historiques (avec pagination/filtres)
GET  /api/computers/{id}/metrics/cpu        → Métriques CPU uniquement
GET  /api/computers/{id}/metrics/memory     → Métriques Mémoire uniquement
GET  /api/computers/{id}/metrics/disk       → Métriques Disques uniquement
GET  /api/computers/{id}/metrics/network    → Métriques Réseau uniquement
GET  /api/computers/{id}/metrics/processes  → Liste des processus
```

#### 3. Agents

```
GET  /api/agents                        → Liste tous les agents
GET  /api/agents/{id}                   → Détails d'un agent
POST /api/agents/{id}/regenerate-key    → Regénérer la clé API
```

#### 4. Dashboard / Statistiques

```
GET  /api/dashboard/stats               → Statistiques globales
GET  /api/dashboard/computers-summary   → Résumé des ordinateurs
```

### Formats de Réponse Recommandés

**GET /api/computers**

```json
[
    {
        "idComputer": "hostname_abc123",
        "hostname": "server-01",
        "ipAddress": "192.168.1.100",
        "os": "Linux 6.17.6-1-default",
        "status": "ONLINE",
        "lastSeen": "2025-01-15T14:30:00Z",
        "agents": [
            {
                "idAgent": "agent_xyz789",
                "status": "ONLINE",
                "version": "0.1.0",
                "lastSeen": "2025-01-15T14:30:00Z"
            }
        ]
    }
]
```

**GET /api/computers/{id}/metrics/latest**

```json
{
    "computerId": "hostname_abc123",
    "recordedAt": "2025-01-15T14:30:00Z",
    "cpu": [
        {
            "usagePercent": 45.2,
            "cpuName": "cpu",
            "modelName": "Intel Core i7",
            "coreCount": 8,
            "perCoreUsage": [40.1, 45.2, 50.3, 35.4, 48.5, 42.6, 47.7, 43.8],
            "temperature": 65.5
        }
    ],
    "memory": {
        "totalMb": 8192,
        "usedMb": 4096,
        "freeMb": 4096,
        "usagePercent": 50.0
    },
    "disks": [
        {
            "mountPoint": "/",
            "totalGb": 100.0,
            "usedGb": 50.0,
            "freeGb": 50.0,
            "usagePercent": 50.0
        }
    ],
    "network": [
        {
            "interface": "eth0",
            "uploadSpeed": 1024.5,
            "downloadSpeed": 2048.3,
            "totalUpload": 1073741824,
            "totalDownload": 2147483648
        }
    ]
}
```

**GET /api/computers/{id}/metrics** (avec query params : `?type=cpu&from=...&to=...&limit=100`)

```json
{
  "computerId": "hostname_abc123",
  "metrics": [
    {
      "recordedAt": "2025-01-15T14:30:00Z",
      "cpu": [...],
      "memory": {...},
      "disks": [...],
      "network": [...]
    }
  ],
  "pagination": {
    "total": 1000,
    "limit": 100,
    "offset": 0
  }
}
```

## 📦 Structure de Fichiers Proposée

```
client/
├── src/
│   ├── types/
│   │   ├── Computer.ts              → Types pour Computer
│   │   ├── Agent.ts                 → Types pour Agent
│   │   ├── Metrics.ts               → Types pour les métriques
│   │   └── Dashboard.ts             → Types pour le dashboard
│   │
│   ├── features/
│   │   ├── computers/
│   │   │   ├── components/
│   │   │   │   ├── computer-list.tsx
│   │   │   │   ├── computer-card.tsx
│   │   │   │   ├── computer-status-badge.tsx
│   │   │   │   ├── computer-details-header.tsx
│   │   │   │   ├── metrics-cards.tsx
│   │   │   │   ├── cpu-chart.tsx
│   │   │   │   ├── memory-chart.tsx
│   │   │   │   ├── disk-chart.tsx
│   │   │   │   ├── network-chart.tsx
│   │   │   │   └── processes-table.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useComputers.ts
│   │   │   │   ├── useComputerMetrics.ts
│   │   │   │   └── useLatestMetrics.ts
│   │   │   ├── data/
│   │   │   │   └── schema.ts
│   │   │   └── index.tsx
│   │   │
│   │   ├── agents/
│   │   │   ├── components/
│   │   │   │   ├── agent-list.tsx
│   │   │   │   ├── agent-card.tsx
│   │   │   │   └── agent-regenerate-dialog.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAgents.ts
│   │   │   └── index.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── components/
│   │       │   ├── stats-cards.tsx
│   │       │   ├── overview-charts.tsx
│   │       │   └── recent-computers.tsx
│   │       ├── hooks/
│   │       │   └── useDashboardStats.ts
│   │       └── dashboard.tsx
│   │
│   └── lib/
│       └── api/
│           ├── computers.ts          → API calls pour computers
│           ├── metrics.ts            → API calls pour metrics
│           ├── agents.ts             → API calls pour agents
│           └── dashboard.ts          → API calls pour dashboard
│
└── app/
    └── [role]/
        ├── dashboard/
        │   └── page.tsx               → Page Dashboard
        ├── computers/
        │   ├── page.tsx               → Liste des ordinateurs
        │   └── [id]/
        │       └── page.tsx           → Détails ordinateur
        └── agents/
            └── page.tsx               → Gestion agents
```

## 🚀 Implémentation Proposée (Priorités)

### Phase 1 : Fondations

1. ✅ Créer les types TypeScript (Computer, Agent, Metrics)
2. ✅ Créer les hooks API (React Query)
3. ✅ Créer les endpoints serveur nécessaires
4. ✅ Mettre à jour la navigation (sidebar)

### Phase 2 : Dashboard

1. ✅ Page Dashboard avec stats globales
2. ✅ Cards de statistiques
3. ✅ Liste rapide des ordinateurs

### Phase 3 : Liste des Ordinateurs

1. ✅ Page liste avec table
2. ✅ Filtres et recherche
3. ✅ Navigation vers détails

### Phase 4 : Détails Ordinateur

1. ✅ Header avec informations
2. ✅ Cards métriques en temps réel
3. ✅ Graphiques historiques (CPU, Mémoire, Disque, Réseau)
4. ✅ Table des processus
5. ✅ Refresh automatique (polling)

### Phase 5 : Gestion Agents

1. ✅ Liste des agents
2. ✅ Actions sur agents
3. ✅ Regénération de clés

### Phase 6 : Améliorations

1. ⚠️ Notifications/Alertes
2. ⚠️ Export de données
3. ⚠️ Comparaison entre ordinateurs
4. ⚠️ Alertes configurées par seuils
