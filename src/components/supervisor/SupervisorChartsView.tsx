"use client";

import React from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const hourlyCallData = [
  { hour: "9 AM", dialed: 420, connected: 290 },
  { hour: "10 AM", dialed: 680, connected: 470 },
  { hour: "11 AM", dialed: 890, connected: 620 },
  { hour: "12 PM", dialed: 780, connected: 540 },
  { hour: "1 PM",  dialed: 510, connected: 340 },
  { hour: "2 PM",  dialed: 820, connected: 580 },
  { hour: "3 PM",  dialed: 940, connected: 670 },
  { hour: "4 PM",  dialed: 710, connected: 490 },
];

const dispositionData = [
  { name: "Promise to Pay",  value: 428, color: "#10b981" },
  { name: "Call Back",       value: 245, color: "#3b82f6" },
  { name: "Refused to Pay",  value: 162, color: "#f43f5e" },
  { name: "Interest Dispute",value: 118, color: "#f59e0b" },
  { name: "Already Cleared", value: 92,  color: "#8b5cf6" },
];

const hourlyRevenueData = [
  { hour: "9 AM",  amount: 1.2 },
  { hour: "10 AM", amount: 2.8 },
  { hour: "11 AM", amount: 3.9 },
  { hour: "12 PM", amount: 2.1 },
  { hour: "1 PM",  amount: 1.4 },
  { hour: "2 PM",  amount: 3.5 },
  { hour: "3 PM",  amount: 4.2 },
  { hour: "4 PM",  amount: 2.3 },
];

const topAgents = [
  { rank: 1, name: "Amit Verma",    ext: "1042", calls: 148, ptp: 245000, rate: "72.4%" },
  { rank: 2, name: "Priya Nair",    ext: "1018", calls: 139, ptp: 198000, rate: "69.1%" },
  { rank: 3, name: "Sneha Patel",   ext: "1033", calls: 142, ptp: 184500, rate: "70.8%" },
  { rank: 4, name: "Rahul Sharma",  ext: "1089", calls: 125, ptp: 152000, rate: "66.5%" },
  { rank: 5, name: "Karan Mehta",   ext: "1102", calls: 131, ptp: 141000, rate: "68.2%" },
];

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "none",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "12px",
};

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  progress?: number;
  progressColor?: string;
  trend?: string;
  trendUp?: boolean;
  accentColor?: string;
}

function KpiCard({ label, value, sub, progress, progressColor = "#3b82f6", trend, trendUp, accentColor = "#3b82f6" }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ background: "#fff", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        {trend && (
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={trendUp
              ? { background: "#dcfce7", color: "#166534" }
              : { background: "#fee2e2", color: "#991b1b" }
            }
          >
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {sub}
      </div>
      {progress !== undefined && (
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--bg-app)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: progressColor }}
          />
        </div>
      )}
    </div>
  );
}

export function SupervisorChartsView() {
  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="tour-supervisor-metrics grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="PTP Recovery Today"
          value="₹18.45 L"
          sub="428 commitments · Target ₹25 L"
          progress={74}
          progressColor="#10b981"
          trend="+14.2%"
          trendUp
        />
        <KpiCard
          label="Connect Rate"
          value="68.4%"
          sub="8,420 dials · Benchmark 65%"
          progress={68.4}
          progressColor="#3b82f6"
          trend="Above target"
          trendUp
        />
        <KpiCard
          label="Floor Utilization"
          value="138 / 200"
          sub="31 idle · 21 on break"
          progress={69}
          progressColor="#8b5cf6"
        />
        <KpiCard
          label="Avg Handle Time"
          value="3m 34s"
          sub="Talk + wrap-up · Cap 4m"
          progress={82}
          progressColor="#f59e0b"
          trend="Optimal"
          trendUp
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area chart */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Call Volume by Hour
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Total dials vs connected calls
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#cbd5e1" }} />
                Dialed
              </span>
              <span className="flex items-center gap-1.5" style={{ color: "var(--brand-primary)" }}>
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--brand-primary)" }} />
                Connected
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyCallData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gConnect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1d4ed8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="dialed"    stroke="#cbd5e1" strokeWidth={1.5} fill="url(#gDial)" />
                <Area type="monotone" dataKey="connected" stroke="#1d4ed8" strokeWidth={2}   fill="url(#gConnect)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart */}
        <div
          className="rounded-xl p-5 flex flex-col"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Call Outcomes
          </div>
          <div className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            Today&apos;s shift dispositions
          </div>
          <div className="flex-1 min-h-0" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dispositionData}
                  cx="50%" cy="50%"
                  innerRadius={48} outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dispositionData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {dispositionData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold font-mono" style={{ color: "var(--text-primary)" }}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart + leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                PTP Collections by Hour
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                ₹ Lakhs committed per hour
              </div>
            </div>
            <span
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: "#dcfce7", color: "#166534" }}
            >
              Peak: 3 PM — ₹4.2L
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: any) => [`₹${v}L`, "PTP Amount"]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-app)" }}
          >
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Top Agents
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Ranked by PTP recovery
              </div>
            </div>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-lg"
              style={{ background: "var(--brand-light)", color: "var(--brand-primary-text)", border: "1px solid var(--brand-light)" }}
            >
              Live shift
            </span>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Rank", "Agent", "Calls", "PTP Volume", "Connect %"].map((h) => (
                  <th
                    key={h}
                    className="py-2.5 px-4 text-left font-medium"
                    style={{ color: "var(--text-muted)", background: "var(--bg-app)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAgents.map((ag) => (
                <tr
                  key={ag.ext}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                >
                  <td className="py-3 px-4">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                      style={
                        ag.rank === 1
                          ? { background: "#fef9c3", color: "#854d0e" }
                          : ag.rank === 2
                          ? { background: "#f1f5f9", color: "#475569" }
                          : { background: "#fff7ed", color: "#9a3412" }
                      }
                    >
                      {ag.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--text-primary)" }}>
                    {ag.name}
                    <span className="ml-2 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {ag.ext}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono" style={{ color: "var(--text-secondary)" }}>
                    {ag.calls}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold" style={{ color: "#16a34a" }}>
                    ₹{ag.ptp.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 font-mono" style={{ color: "var(--text-secondary)" }}>
                    {ag.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
