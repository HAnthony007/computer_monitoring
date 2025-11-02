export type ComputerStatus = "ONLINE" | "OFFLINE" | "UNKNOWN";

export type Computer = {
    idComputer: string;
    hostname: string;
    ipAddress: string;
    os: string;
    status?: ComputerStatus;
    lastSeen?: string;
    agents?: Agent[];
};

export type Agent = {
    idAgent: string;
    idComputer: string;
    status: ComputerStatus;
    version?: string;
    lastSeen?: string;
    createdAt?: string;
};

export type ComputerWithAgent = Computer & {
    agent: Agent;
};
