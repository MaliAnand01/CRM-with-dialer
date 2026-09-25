"use client";

import React, { useState } from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Headphones, Mic, Users, X, PauseCircle, UserX, RefreshCw } from "lucide-react";
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

const MODES = [
  { id: "LISTEN",  label: "Silent Listen", sub: "Customer cannot hear",  icon: Headphones, color: "#3b82f6" },
  { id: "WHISPER", label: "Coach Agent",   sub: "Agent only hears you",  icon: Mic,        color: "#f59e0b" },
  { id: "BARGE",   label: "Join Call",     sub: "3-way conference",      icon: Users,      color: "#f43f5e" },
] as const;

export function SupervisionAudioPanel() {
  const {
    monitoredAgentId,
    activeSupervisionMode,
    agentsList,
    setSupervisionMode,
    stopSupervision,
    remoteForcePause,
    remoteForceLogout,
    remoteReassignQueue,
  } = useDialerStore();

  const [selectedQueue, setSelectedQueue] = useState("PL_Bucket_2");

  if (!monitoredAgentId) return null;

  const agent = agentsList.find((a) => a.id === monitoredAgentId);
  if (!agent) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 shadow-2xl rounded-xl overflow-hidden" style={{ background: "#0f172a" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #1e293b" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold text-white">Audio Monitoring</span>
        </div>
        <button
          onClick={stopSupervision}
          className="p-1.5 rounded-md cursor-pointer transition-colors"
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1e293b"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Agent strip */}
        <div
          className="flex items-center justify-between p-3 rounded-lg"
          style={{ background: "#1e293b" }}
        >
          <div>
            <div className="text-sm font-semibold text-white">{agent.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              Ext {agent.extension} · {agent.currentCustomer ?? "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: "#64748b" }}>Duration</div>
            <div className="text-sm font-mono font-bold text-emerald-400">
              {fmt(agent.callDuration)}
            </div>
          </div>
        </div>

        {/* Mode buttons */}
        <div>
          <div className="text-xs font-medium mb-2" style={{ color: "#64748b" }}>
            Supervision mode
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map(({ id, label, sub, icon: Icon, color }) => {
              const isActive = activeSupervisionMode === id;
              return (
                <button
                  key={id}
                  onClick={() => setSupervisionMode(agent.id, id)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors"
                  style={
                    isActive
                      ? { background: `${color}22`, borderColor: color, color: "#fff" }
                      : { background: "#1e293b", borderColor: "#334155", color: "#94a3b8" }
                  }
                >
                  <Icon size={14} style={{ color: isActive ? color : "#64748b" }} />
                  <span className="font-medium text-center leading-tight">{label}</span>
                  <span className="text-center leading-tight" style={{ color: "#64748b", fontSize: 10 }}>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Waveform */}
        {activeSupervisionMode && (
          <div
            className="p-3 rounded-lg space-y-2"
            style={{ background: "#0a0f1e", border: "1px solid #1e293b" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live stream
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                {activeSupervisionMode === "LISTEN" ? "Monitoring" : activeSupervisionMode === "WHISPER" ? "Coaching" : "In Conference"}
              </span>
            </div>
            <div className="flex items-end gap-px h-6">
              {[40, 70, 55, 90, 65, 35, 80, 95, 45, 75, 85, 55, 90, 50, 70, 40].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, background: "#10b981", opacity: 0.75 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Floor actions */}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
          <div className="text-xs font-medium mb-2.5" style={{ color: "#64748b" }}>
            Agent actions
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => remoteForcePause(agent.id, "WRAP_UP")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#334155")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#1e293b")}
            >
              <PauseCircle size={12} />
              Force Break
            </button>

            <button
              onClick={() => remoteForceLogout(agent.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              style={{ background: "#1e293b", color: "#fca5a5", border: "1px solid #334155" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#450a0a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1e293b"; }}
            >
              <UserX size={12} />
              Log Out
            </button>

            <div className="flex items-center gap-1.5">
              <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                <SelectTrigger size="sm" className="w-40" style={{ background: "#1e293b", borderColor: "#334155", color: "#cbd5e1" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PL_Bucket_2">PL Bucket 2</SelectItem>
                  <SelectItem value="CreditCard_DPD_30">CC DPD 30</SelectItem>
                  <SelectItem value="AutoLoan_Delinquency">Auto Loan</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => remoteReassignQueue(agent.id, selectedQueue)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#334155")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#1e293b")}
                title="Reassign queue"
              >
                <RefreshCw size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
