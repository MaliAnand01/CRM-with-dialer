"use client";

import React, { useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle, Radio, Server } from "lucide-react";

type GWStatus = "registered" | "unregistered" | "degraded";

interface Gateway {
  id: string;
  label: string;
  server: "180" | "181";
  pool: "Own 2G" | "Rent 4G";
  model: string;
  sipHost: string;
  channels: number;
  active: number;
  status: GWStatus;
  uptime: string;
}

const GATEWAYS: Gateway[] = [
  { id: "gw-180-01", label: "GW-180-01", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.101", channels: 32, active: 28, status: "registered",   uptime: "14d 06h" },
  { id: "gw-180-02", label: "GW-180-02", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.102", channels: 32, active: 30, status: "registered",   uptime: "14d 06h" },
  { id: "gw-180-03", label: "GW-180-03", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.103", channels: 32, active: 25, status: "registered",   uptime: "14d 05h" },
  { id: "gw-180-04", label: "GW-180-04", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.104", channels: 32, active: 0,  status: "unregistered", uptime: "—" },
  { id: "gw-180-05", label: "GW-180-05", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.105", channels: 32, active: 31, status: "registered",   uptime: "14d 04h" },
  { id: "gw-180-06", label: "GW-180-06", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.106", channels: 32, active: 29, status: "registered",   uptime: "12d 11h" },
  { id: "gw-180-07", label: "GW-180-07", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.107", channels: 32, active: 18, status: "degraded",     uptime: "3d 02h" },
  { id: "gw-180-08", label: "GW-180-08", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.108", channels: 32, active: 32, status: "registered",   uptime: "14d 06h" },
  { id: "gw-180-09", label: "GW-180-09", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.109", channels: 32, active: 27, status: "registered",   uptime: "14d 06h" },
  { id: "gw-180-10", label: "GW-180-10", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.110", channels: 32, active: 30, status: "registered",   uptime: "14d 06h" },
  { id: "gw-180-11", label: "GW-180-11", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.111", channels: 32, active: 24, status: "registered",   uptime: "10d 18h" },
  { id: "gw-180-12", label: "GW-180-12", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.112", channels: 32, active: 22, status: "registered",   uptime: "14d 06h" },
  { id: "gw-180-13", label: "GW-180-13", server: "180", pool: "Own 2G", model: "Dinstar UC2000-VE",     sipHost: "192.168.1.113", channels: 32, active: 29, status: "registered",   uptime: "14d 06h" },
  { id: "gw-181-01", label: "GW-181-01", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.151", channels: 16, active: 15, status: "registered",   uptime: "9d 14h" },
  { id: "gw-181-02", label: "GW-181-02", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.152", channels: 16, active: 16, status: "registered",   uptime: "9d 14h" },
  { id: "gw-181-03", label: "GW-181-03", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.153", channels: 16, active: 14, status: "registered",   uptime: "9d 13h" },
  { id: "gw-181-04", label: "GW-181-04", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.154", channels: 16, active: 0,  status: "unregistered", uptime: "—" },
  { id: "gw-181-05", label: "GW-181-05", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.155", channels: 16, active: 12, status: "registered",   uptime: "7d 08h" },
  { id: "gw-181-06", label: "GW-181-06", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.156", channels: 16, active: 13, status: "registered",   uptime: "9d 14h" },
  { id: "gw-181-07", label: "GW-181-07", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.157", channels: 16, active: 16, status: "registered",   uptime: "9d 14h" },
  { id: "gw-181-08", label: "GW-181-08", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.158", channels: 16, active: 11, status: "degraded",     uptime: "1d 20h" },
  { id: "gw-181-09", label: "GW-181-09", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.159", channels: 16, active: 15, status: "registered",   uptime: "9d 14h" },
  { id: "gw-181-10", label: "GW-181-10", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.160", channels: 16, active: 14, status: "registered",   uptime: "9d 14h" },
  { id: "gw-181-11", label: "GW-181-11", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.161", channels: 16, active: 12, status: "registered",   uptime: "9d 12h" },
  { id: "gw-181-12", label: "GW-181-12", server: "181", pool: "Rent 4G", model: "Dinstar DWG2000F-4G", sipHost: "192.168.1.162", channels: 16, active: 16, status: "registered",   uptime: "9d 14h" },
];

function StatusBadge({ status }: { status: GWStatus }) {
  const map: Record<GWStatus, { label: string; bg: string; color: string }> = {
    registered:   { label: "Registered",  bg: "#dcfce7", color: "#166534" },
    unregistered: { label: "Unreachable", bg: "#fee2e2", color: "#991b1b" },
    degraded:     { label: "Degraded",    bg: "#fef9c3", color: "#92400e" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ background: s.bg, color: s.color }}
    >
      {status === "registered" ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
      {s.label}
    </span>
  );
}

function UtilBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const color = pct >= 90 ? "#dc2626" : pct >= 70 ? "#f36c21" : "#16a34a";
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border-default)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-secondary)" }}>
        {used}/{total}
      </span>
    </div>
  );
}

function PoolSummary({ pool, gateways }: { pool: string; gateways: Gateway[] }) {
  const totalChannels  = gateways.reduce((a, g) => a + g.channels, 0);
  const activeChannels = gateways.reduce((a, g) => a + g.active, 0);
  const registered     = gateways.filter((g) => g.status === "registered").length;
  const issues         = gateways.filter((g) => g.status !== "registered").length;

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--border-default)" }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{pool}</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{gateways.length} gateways</div>
        </div>
        <div
          className="text-xs font-medium px-2 py-0.5 rounded-md"
          style={issues > 0 ? { background: "#fee2e2", color: "#991b1b" } : { background: "#dcfce7", color: "#166534" }}
        >
          {issues > 0 ? `${issues} issue${issues > 1 ? "s" : ""}` : "All healthy"}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active channels", value: `${activeChannels}/${totalChannels}` },
          { label: "Registered", value: `${registered}` },
          { label: "Issues", value: `${issues}` },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</div>
            <div className="text-base font-semibold font-mono mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</div>
          </div>
        ))}
      </div>
      <UtilBar used={activeChannels} total={totalChannels} />
    </div>
  );
}

export function GatewaysTab() {
  const [serverFilter, setServerFilter] = useState<"all" | "180" | "181">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | GWStatus>("all");

  const filtered = GATEWAYS.filter((g) => {
    if (serverFilter !== "all" && g.server !== serverFilter) return false;
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    return true;
  });

  const pool2G        = GATEWAYS.filter((g) => g.pool === "Own 2G");
  const pool4G        = GATEWAYS.filter((g) => g.pool === "Rent 4G");
  const totalActive   = GATEWAYS.reduce((a, g) => a + g.active, 0);
  const totalChannels = GATEWAYS.reduce((a, g) => a + g.channels, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Telephony Gateways (Dinstar)
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            25 physical VoIP gateways registered as SIP trunks on Asterisk. Servers 180 and 181.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border"
          style={{ background: "#fff", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
        >
          <RefreshCw size={12} />
          Sync Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PoolSummary pool="Own 2G — Server 180 (UC2000-VE GSM)" gateways={pool2G} />
        <PoolSummary pool="Rent 4G — Server 181 (DWG2000F-4G)" gateways={pool4G} />
      </div>

      <div
        className="rounded-xl p-4 flex items-center gap-4"
        style={{ background: "#fff", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <Radio size={15} style={{ color: "var(--brand-primary)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
            Total channel utilisation
          </span>
        </div>
        <div className="flex-1">
          <UtilBar used={totalActive} total={totalChannels} />
        </div>
        <span className="text-xs font-mono font-semibold shrink-0" style={{ color: "var(--text-primary)" }}>
          {Math.round((totalActive / totalChannels) * 100)}%
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
          <Server size={13} />
          <span>Server:</span>
        </div>
        {(["all", "180", "181"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setServerFilter(s)}
            className="px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
            style={
              serverFilter === s
                ? { background: "var(--brand-primary)", color: "#fff" }
                : { background: "#fff", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }
            }
          >
            {s === "all" ? "All servers" : `Server ${s}`}
          </button>
        ))}
        <div className="w-px h-4 mx-1" style={{ background: "var(--border-default)" }} />
        {(["all", "registered", "degraded", "unregistered"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
            style={
              statusFilter === s
                ? { background: "var(--brand-primary)", color: "#fff" }
                : { background: "#fff", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }
            }
          >
            {s === "all" ? "All status" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--bg-app)", borderBottom: "1px solid var(--border-default)" }}>
                {["Gateway", "Pool", "Server", "Model", "SIP Host", "Channels", "Status", "Uptime"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((gw, i) => (
                <tr
                  key={gw.id}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "var(--bg-app)",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{gw.label}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{gw.pool}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>{gw.server}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{gw.model}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>{gw.sipHost}</td>
                  <td className="px-4 py-3 min-w-[140px]"><UtilBar used={gw.active} total={gw.channels} /></td>
                  <td className="px-4 py-3"><StatusBadge status={gw.status} /></td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>{gw.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="px-4 py-3 text-xs"
          style={{ borderTop: "1px solid var(--border-default)", background: "var(--bg-app)", color: "var(--text-secondary)" }}
        >
          Showing {filtered.length} of {GATEWAYS.length} gateways
        </div>
      </div>
    </div>
  );
}
