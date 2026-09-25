"use client";

import React from "react";
import { Download, TrendingUp, TrendingDown, Target, Clock, Phone, IndianRupee } from "lucide-react";
import { useDialerStore } from "@/store/dialerStore";

const topAgents = [
  { name: "Amit Verma",    ext: "1042", calls: 148, ptp: 245000, rate: "72.4%", up: true },
  { name: "Priya Nair",    ext: "1018", calls: 139, ptp: 198000, rate: "69.1%", up: true },
  { name: "Sneha Patel",   ext: "1033", calls: 142, ptp: 184500, rate: "70.8%", up: true },
  { name: "Rahul Sharma",  ext: "1089", calls: 125, ptp: 152000, rate: "66.5%", up: false },
  { name: "Karan Mehta",   ext: "1102", calls: 131, ptp: 141000, rate: "68.2%", up: true },
];

const globalKpis = [
  { label: "Floor PTP Recovery",   value: "₹18.45 L", sub: "428 promises · Target ₹25 L",   trend: "+14%", up: true, progress: 74, color: "#10b981" },
  { label: "Overall Connect Rate", value: "68.4%",     sub: "8,420 attempts · Benchmark 65%", trend: "Above target", up: true, progress: 68, color: "#3b82f6" },
  { label: "Floor AHT",            value: "3m 34s",    sub: "Talk + wrap-up · Cap 4m",        trend: "Optimal", up: true, progress: 82, color: "#f59e0b" },
  { label: "WhatsApp Conversions", value: "72.8%",     sub: "312 UPI payments verified",       trend: "312 paid", up: true, progress: 73, color: "#8b5cf6" },
];

const agentKpis = [
  { label: "My PTP Today",       value: "₹1.42 L",  sub: "Daily Target: ₹2.5 L",            trend: "On track", up: true, progress: 56, color: "#10b981", icon: IndianRupee },
  { label: "My Connect Rate",    value: "71.2%",    sub: "185 attempts today",              trend: "Top 10%",  up: true, progress: 71, color: "#3b82f6", icon: Phone },
  { label: "My AHT",             value: "2m 50s",   sub: "Target: <3m 30s",                 trend: "Excellent", up: true, progress: 90, color: "#f59e0b", icon: Clock },
  { label: "Quality Score",      value: "96%",      sub: "Based on 5 audited calls",        trend: "Passed",    up: true, progress: 96, color: "#8b5cf6", icon: Target },
];

export function AnalyticsDashboard() {
  const { currentRole } = useDialerStore();
  const isAgent = currentRole === "agent";
  const kpis = isAgent ? agentKpis : globalKpis;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {isAgent ? "My Performance" : "Floor Analytics"}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {isAgent
              ? "Track your daily targets, handle times, and quality scores."
              : "Recovery performance across 200 calling seats — current shift."}
          </p>
        </div>
        <button
          onClick={() => alert("Report downloaded.")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-colors"
          style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)", background: "#fff" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#fff")}
        >
          <Download size={14} />
          {isAgent ? "My Export" : "Download Report"}
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#fff", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{k.label}</span>
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={k.up ? { background: "#dcfce7", color: "#166534" } : { background: "#fee2e2", color: "#991b1b" }}
              >
                {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {k.trend}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>
              {k.value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{k.sub}</div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-app)" }}>
              <div className="h-full rounded-full" style={{ width: `${k.progress}%`, background: k.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard - SUPERVISOR ONLY */}
      {!isAgent ? (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div
            className="px-5 py-4 flex justify-between items-center"
            style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-app)" }}
          >
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Shift Leaderboard
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Top agents ranked by PTP recovery
              </div>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-app)" }}>
                {["Rank", "Agent", "Extension", "Calls", "PTP Volume", "Connect Rate", "Tier"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left font-medium"
                    style={{ color: "var(--text-muted)", fontSize: 11 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAgents.map((ag, i) => (
                <tr
                  key={ag.ext}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                >
                  <td className="px-5 py-3">
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={
                        i === 0
                          ? { background: "#fef9c3", color: "#854d0e" }
                          : i === 1
                          ? { background: "#f1f5f9", color: "#475569" }
                          : { background: "#fff7ed", color: "#9a3412" }
                      }
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "var(--bg-sidebar)" }}
                      >
                        {ag.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{ag.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                    Ext {ag.ext}
                  </td>
                  <td className="px-5 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>
                    {ag.calls}
                  </td>
                  <td className="px-5 py-3 font-mono font-semibold" style={{ color: "#16a34a" }}>
                    ₹{ag.ptp.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>
                    {ag.rate}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: "#dcfce7", color: "#166534" }}
                    >
                      High Yield
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Summary grid - SUPERVISOR ONLY */}
      {!isAgent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Shifts Completed", value: "2 of 3", sub: "Morning · Afternoon running", color: "#3b82f6" },
            { label: "Drop Call Rate",   value: "1.2%",   sub: "Under 3% regulatory cap",    color: "#10b981" },
            { label: "DND Scrubbed",     value: "1,840",  sub: "Leads removed from rotation", color: "#f59e0b" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{ background: "#fff", border: "1px solid var(--border-default)" }}
            >
              <div
                className="w-2.5 h-10 rounded-full shrink-0"
                style={{ background: s.color }}
              />
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                <div className="text-xl font-bold font-mono mt-0.5" style={{ color: "var(--text-primary)" }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
