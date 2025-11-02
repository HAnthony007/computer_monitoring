package com.example.server.agents.data;

public class AgentCommandResponse {
    private String id;
    private String type;
    private Long pid;

    public AgentCommandResponse() {}
    public AgentCommandResponse(String id, String type, Long pid) {
        this.id = id; this.type = type; this.pid = pid;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getPid() { return pid; }
    public void setPid(Long pid) { this.pid = pid; }
}
