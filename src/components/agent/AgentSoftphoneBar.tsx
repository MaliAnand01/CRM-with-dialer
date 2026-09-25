"use client";

import React from "react";
import { useDialerStore } from "@/store/dialerStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Mic, MicOff, Pause, Play, PhoneOff, PhoneIncoming, Clock } from "lucide-react";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AgentSoftphoneBar() {
  const {
    agentStatus,
    pauseReason,
    callDuration,
    isMuted,
    isOnHold,
    activeLead,
    currentUser,
    setAgentStatus,
    acceptCall,
    hangupCall,
    toggleMute,
    toggleHold,
  } = useDialerStore();

  const currentSelectValue =
    agentStatus === "PAUSED" ? `PAUSED_${pauseReason}` : agentStatus;

  function handleStatusChange(val: string) {
    if (val.startsWith("PAUSED_")) {
      const reason = val.replace("PAUSED_", "") as any;
      setAgentStatus("PAUSED", reason);
    } else {
      setAgentStatus(val as any);
    }
  }

  const statusConfig = {
    ON_CALL:     { label: "On Call",  dotCls: "bg-emerald-400", pillStyle: { background: "#dcfce7", color: "#166534", borderColor: "#86efac" } },
    RINGING:     { label: "Ringing", dotCls: "bg-amber-400 animate-pulse", pillStyle: { background: "#fef9c3", color: "#854d0e", borderColor: "#fde047" } },
    IDLE:        { label: "Ready",   dotCls: "bg-blue-400",    pillStyle: { background: "#dbeafe", color: "#1e40af", borderColor: "#93c5fd" } },
    PAUSED:      { label: pauseReason ? `Break — ${pauseReason}` : "On Break", dotCls: "bg-rose-400", pillStyle: { background: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" } },
    MANUAL_DIAL: { label: "Manual",  dotCls: "bg-slate-400",   pillStyle: { background: "#f1f5f9", color: "#475569", borderColor: "#e2e8f0" } },
  };
  const sc = statusConfig[agentStatus] ?? statusConfig.IDLE;

  return (
    <div
      className="tour-agent-softphone flex items-center justify-between px-6 gap-4 shrink-0"
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--border-default)",
        minHeight: 52,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      {/* Left: Status pill + customer */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0"
          style={sc.pillStyle}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dotCls}`} />
          {sc.label}
        </span>

        {activeLead && (agentStatus === "ON_CALL" || agentStatus === "RINGING") && (
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {activeLead.customerName}
            </span>
            <span className="text-sm font-mono shrink-0" style={{ color: "var(--text-secondary)" }}>
              {activeLead.maskedPhone}
            </span>
          </div>
        )}

        {/* Station Trunk info badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
          <span>Station: Ext {currentUser?.extension || "1002"}</span>
          <span>•</span>
          <span className="font-sans font-medium text-slate-700">{currentUser?.queue || "PL_Bucket_2"}</span>
        </div>
      </div>

      {/* Center: Timer */}
      {(agentStatus === "ON_CALL" || agentStatus === "RINGING") && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
          style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
        >
          <Clock size={12} style={{ color: "var(--text-muted)" }} />
          <span className="text-xs font-mono font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {formatDuration(callDuration)}
          </span>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Custom status dropdown */}
        <Select value={currentSelectValue} onValueChange={handleStatusChange}>
          <SelectTrigger size="sm" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Agent Status</SelectLabel>
              <SelectItem value="IDLE">Ready</SelectItem>
              <SelectItem value="ON_CALL">On Call</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Break</SelectLabel>
              <SelectItem value="PAUSED_LUNCH">Lunch Break</SelectItem>
              <SelectItem value="PAUSED_TEA">Tea Break</SelectItem>
              <SelectItem value="PAUSED_TRAINING">Training</SelectItem>
              <SelectItem value="PAUSED_WRAP_UP">Wrap Up</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Answer */}
        {agentStatus === "RINGING" && (
          <button
            onClick={acceptCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
            style={{ background: "#16a34a" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#15803d")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#16a34a")}
          >
            <PhoneIncoming size={13} />
            Answer
          </button>
        )}

        {/* On-call controls */}
        {agentStatus === "ON_CALL" && (
          <>
            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
              style={
                isMuted
                  ? { background: "#fee2e2", borderColor: "#fca5a5", color: "#991b1b" }
                  : { background: "var(--bg-app)", borderColor: "var(--border-default)", color: "var(--text-primary)" }
              }
            >
              {isMuted ? <MicOff size={13} /> : <Mic size={13} />}
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
              onClick={toggleHold}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
              style={
                isOnHold
                  ? { background: "#fef9c3", borderColor: "#fde047", color: "#854d0e" }
                  : { background: "var(--bg-app)", borderColor: "var(--border-default)", color: "var(--text-primary)" }
              }
            >
              {isOnHold ? <Play size={13} /> : <Pause size={13} />}
              {isOnHold ? "Resume" : "Hold"}
            </button>

            <button
              onClick={hangupCall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
              style={{ background: "#dc2626" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#b91c1c")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#dc2626")}
            >
              <PhoneOff size={13} />
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
