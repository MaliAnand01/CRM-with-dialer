"use client";

import React, { useState } from "react";
import { Play, Pause, Download, Search, X } from "lucide-react";
import { useDialerStore, CallRecording } from "@/store/dialerStore";

const dispStyle: Record<string, { bg: string; color: string }> = {
  ptp:      { bg: "#dcfce7", color: "#166534" },
  refused:  { bg: "#fee2e2", color: "#991b1b" },
  callback: { bg: "#dbeafe", color: "#1e40af" },
  dispute:  { bg: "#fef9c3", color: "#854d0e" },
};

export function CallRecordingsTab() {
  const { callRecordings } = useDialerStore();
  const [playingId, setPlayingId] = useState<string | null>(callRecordings[0]?.id || null);
  const [speed, setSpeed] = useState(1);
  const [search, setSearch] = useState("");

  const playing = callRecordings.find((r) => r.id === playingId);

  const filtered = callRecordings.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(q) ||
      r.leadId.toLowerCase().includes(q) ||
      r.agentName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-3 p-3 rounded-xl"
        style={{ background: "#fff", border: "1px solid var(--border-default)" }}
      >
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search customer, loan ID, or agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border text-sm outline-none"
            style={{ borderColor: "var(--border-default)", background: "var(--bg-app)", color: "var(--text-primary)" }}
          />
        </div>
        <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
          Storage: Asterisk Spool (WAV)
        </span>
        <button
          onClick={() => alert("Audit log exported.")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors"
          style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)", background: "#fff" }}
        >
          <Download size={13} />
          Export Log
        </button>
      </div>

      {/* Player */}
      {playingId && playing && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: "#0f172a" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white">{playing.customerName}</div>
              <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                {playing.leadId} · {playing.agentName} (Ext {playing.agentExt}) · {playing.disposition}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="flex items-center rounded-lg overflow-hidden text-xs"
                style={{ background: "#1e293b" }}
              >
                {[1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className="px-2.5 py-1.5 font-mono cursor-pointer transition-colors"
                    style={speed === s ? { background: "#334155", color: "#fff" } : { color: "#94a3b8" }}
                  >
                    {s}×
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPlayingId(null)}
                className="p-1.5 rounded-md cursor-pointer"
                style={{ color: "#64748b" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1e293b"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Waveform */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ background: "#0a0f1e" }}
          >
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              style={{ background: "#fff", color: "#0f172a" }}
            >
              <Pause size={14} />
            </button>
            <div className="flex-1 flex items-end gap-px h-8">
              {[30,45,60,20,80,95,40,70,85,30,60,90,100,75,45,35,60,80,50,70,90,65,40,80,95,55,35,65,85,45,50,75,90,60,30,70,85,95,40,60,80,55,30,70,90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, background: i < 18 ? "#10b981" : "#1e293b" }}
                />
              ))}
            </div>
            <span className="text-xs font-mono shrink-0" style={{ color: "#64748b" }}>
              01:14 / {playing.duration}
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#fff", border: "1px solid var(--border-default)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-app)" }}>
                {["Customer", "Phone", "Agent", "Disposition", "Duration", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const ds = dispStyle[item.dispositionType];
                const isPlaying = playingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "var(--text-primary)" }}>{item.customerName}</div>
                      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{item.leadId}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                      {item.maskedPhone}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm" style={{ color: "var(--text-primary)" }}>{item.agentName}</div>
                      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Ext {item.agentExt}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: ds.bg, color: ds.color }}
                      >
                        {item.disposition}
                      </span>
                      {item.ptpAmount && (
                        <div className="text-xs font-mono mt-1" style={{ color: "#166534" }}>
                          ₹{item.ptpAmount.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                      {item.duration}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {item.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPlayingId(isPlaying ? null : item.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors"
                          style={
                            isPlaying
                              ? { background: "#0f172a", color: "#fff", borderColor: "#0f172a" }
                              : { background: "#fff", color: "var(--text-primary)", borderColor: "var(--border-default)" }
                          }
                        >
                          {isPlaying ? <Pause size={11} /> : <Play size={11} />}
                          {isPlaying ? "Pause" : "Play"}
                        </button>
                        <button
                          onClick={() => alert(`Downloading ${item.id}.wav`)}
                          className="p-1.5 rounded-lg border cursor-pointer transition-colors"
                          style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                          title="Download recording"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
