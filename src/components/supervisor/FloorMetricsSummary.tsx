"use client";

import React from "react";
import { useDialerStore } from "@/store/dialerStore";

export function FloorMetricsSummary() {
  const { agentsList } = useDialerStore();

  const total = agentsList.length;
  const onCall  = agentsList.filter((a) => a.status === "ON_CALL").length;
  const ringing = agentsList.filter((a) => a.status === "RINGING").length;
  const idle    = agentsList.filter((a) => a.status === "IDLE").length;
  const paused  = agentsList.filter((a) => a.status === "PAUSED").length;
  const onCallPct = Math.round((onCall / total) * 100);

  const metrics = [
    { label: "Active Calls",  value: onCall,  sub: `${onCallPct}% of floor`,  dot: "#16a34a", bg: "#f0fdf4", border: "#86efac", text: "#166534" },
    { label: "Ringing",       value: ringing, sub: "Connecting...",            dot: "#ca8a04", bg: "#fefce8", border: "#fde047", text: "#854d0e" },
    { label: "Available",     value: idle,    sub: "Ready for call",           dot: "#2563eb", bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
    { label: "On Break",      value: paused,  sub: "Lunch & Tea",              dot: "#dc2626", bg: "#fff1f2", border: "#fca5a5", text: "#991b1b" },
    { label: "Connect Rate",  value: "68.4%", sub: "Target: 65%",             dot: "#8b5cf6", bg: "#faf5ff", border: "#d8b4fe", text: "#6d28d9" },
    { label: "PTP Recovery",  value: "₹18.45L", sub: "428 promises",          dot: "#10b981", bg: "#f0fdf4", border: "#86efac", text: "#166534" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl p-4"
          style={{ background: m.bg, border: `1px solid ${m.border}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: m.text }}>{m.label}</span>
            <span className="w-2 h-2 rounded-full" style={{ background: m.dot }} />
          </div>
          <div className="text-xl font-bold font-mono" style={{ color: m.text }}>
            {m.value}
          </div>
          <div className="text-xs mt-0.5" style={{ color: m.text, opacity: 0.7 }}>
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
