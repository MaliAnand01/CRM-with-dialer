"use client";

import React from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Search, Headphones } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "ON_CALL", label: "On Call" },
  { value: "RINGING", label: "Ringing" },
  { value: "IDLE", label: "Idle" },
  { value: "PAUSED", label: "On Break" },
] as const;

export function WallboardGrid() {
  const {
    agentsList,
    monitoredAgentId,
    supervisorSearchQuery,
    supervisorQueueFilter,
    supervisorStatusFilter,
    setSupervisorSearch,
    setSupervisorQueueFilter,
    setSupervisorStatusFilter,
    setSupervisionMode,
  } = useDialerStore();

  const filtered = agentsList.filter((a) => {
    const q = supervisorSearchQuery.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) || a.extension.includes(q);
    const matchQueue = supervisorQueueFilter === "ALL" || a.queue === supervisorQueueFilter;
    const matchStatus = supervisorStatusFilter === "ALL" || a.status === supervisorStatusFilter;
    return matchSearch && matchQueue && matchStatus;
  });

  const counts = {
    ON_CALL: agentsList.filter((a) => a.status === "ON_CALL").length,
    RINGING: agentsList.filter((a) => a.status === "RINGING").length,
    IDLE:    agentsList.filter((a) => a.status === "IDLE").length,
    PAUSED:  agentsList.filter((a) => a.status === "PAUSED").length,
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-3 p-3 rounded-xl"
        style={{ background: "#fff", border: "1px solid var(--border-default)" }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search name or extension..."
            value={supervisorSearchQuery}
            onChange={(e) => setSupervisorSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border text-sm outline-none"
            style={{ borderColor: "var(--border-default)", background: "var(--bg-app)", color: "var(--text-primary)" }}
          />
        </div>

        {/* Queue filter */}
        <Select value={supervisorQueueFilter} onValueChange={setSupervisorQueueFilter}>
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder="All Queues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Queues</SelectItem>
            <SelectItem value="PL_Bucket_2">PL Bucket 2</SelectItem>
            <SelectItem value="CreditCard_DPD_30">CC DPD 30</SelectItem>
            <SelectItem value="AutoLoan_Delinquency">Auto Loan</SelectItem>
            <SelectItem value="PL_Bucket_1">PL Bucket 1</SelectItem>
            <SelectItem value="NPA_PreRecovery">NPA Pre-Recovery</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filters */}
        <div
          className="flex items-center rounded-lg p-0.5"
          style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
        >
          {STATUS_FILTERS.map(({ value, label }) => {
            const count = value === "ALL" ? agentsList.length : counts[value as keyof typeof counts];
            const isActive = supervisorStatusFilter === value;
            return (
              <button
                key={value}
                onClick={() => setSupervisorStatusFilter(value)}
                className="px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap"
                style={
                  isActive
                    ? { background: "#fff", color: "var(--text-primary)", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                {label} {count !== undefined && <span style={{ color: "var(--text-muted)" }}>({count})</span>}
              </button>
            );
          })}
        </div>

        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} / {agentsList.length} agents
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {filtered.map((agent) => {
          const isMonitored = monitoredAgentId === agent.id;
          const canMonitor = agent.status === "ON_CALL";

          const cardStyle: React.CSSProperties =
            isMonitored
              ? { background: "#eff6ff", borderColor: "#93c5fd" }
              : agent.status === "ON_CALL"
              ? { background: "#fff", borderColor: "#86efac" }
              : agent.status === "RINGING"
              ? { background: "#fefce8", borderColor: "#fde047" }
              : agent.status === "PAUSED"
              ? { background: "#fff1f2", borderColor: "#fca5a5", opacity: 0.85 }
              : { background: "#f8fafc", borderColor: "var(--border-default)" };

          const dotColor =
            agent.status === "ON_CALL" ? "#16a34a"
            : agent.status === "RINGING" ? "#ca8a04"
            : agent.status === "PAUSED" ? "#dc2626"
            : "#2563eb";

          return (
            <div
              key={agent.id}
              onClick={() => canMonitor && setSupervisionMode(agent.id, "LISTEN")}
              className="rounded-lg p-2.5 border transition-all"
              style={{
                ...cardStyle,
                cursor: canMonitor ? "pointer" : "default",
                boxShadow: isMonitored ? "0 0 0 2px #3b82f6" : undefined,
              }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {agent.extension}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: dotColor }}
                />
              </div>

              {/* Name */}
              <div
                className="text-xs font-semibold truncate mb-1"
                style={{ color: "var(--text-primary)" }}
                title={agent.name}
              >
                {agent.name}
              </div>

              {/* Context */}
              {agent.status === "ON_CALL" && (
                <>
                  <div className="text-xs truncate" style={{ color: "#166534" }} title={agent.currentCustomer}>
                    {agent.currentCustomer}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs" style={{ color: "#ca8a04" }}>{agent.dpdBucket}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: "#166534" }}>
                      {fmt(agent.callDuration)}
                    </span>
                  </div>
                </>
              )}
              {agent.status === "RINGING" && (
                <div className="text-xs font-mono" style={{ color: "#854d0e" }}>
                  {fmt(agent.callDuration)}
                </div>
              )}
              {agent.status === "PAUSED" && (
                <div className="text-xs" style={{ color: "#991b1b" }}>
                  {agent.pauseReason ?? "Break"}
                </div>
              )}
              {agent.status === "IDLE" && (
                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {agent.queue.replace("CreditCard_", "CC_")}
                </div>
              )}

              {/* Monitor hint */}
              {canMonitor && (
                <div
                  className="flex items-center justify-between mt-2 pt-1.5"
                  style={{ borderTop: "1px solid #dcfce7" }}
                >
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Listen</span>
                  <Headphones size={11} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
