"use client";

import React, { useState } from "react";
import { SupervisorChartsView } from "@/components/supervisor/SupervisorChartsView";
import { WallboardGrid } from "@/components/supervisor/WallboardGrid";
import { CallRecordingsTab } from "@/components/supervisor/CallRecordingsTab";
import { SupervisionAudioPanel } from "@/components/supervisor/SupervisionAudioPanel";
import { BarChart2, Users, Disc, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview",    label: "Performance",    icon: BarChart2 },
  { id: "wallboard",   label: "Agent Wallboard", icon: Users },
  { id: "recordings",  label: "Recordings",      icon: Disc },
  { id: "queues",      label: "Queue Health",     icon: Server },
] as const;

type TabId = typeof TABS[number]["id"];

export function SupervisorFloorTabs() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Supervisor Floor
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Live floor control, wallboard, recordings, and queue health.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          200 seats active
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 rounded-xl p-1"
        style={{ background: "#fff", border: "1px solid var(--border-default)" }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`tour-supervisor-${id} flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex-1 justify-center`}
            style={
              tab === id
                ? {
                    background: "var(--brand-primary)",
                    color: "#fff",
                  }
                : {
                    color: "var(--text-secondary)",
                  }
            }
            onMouseEnter={(e) => {
              if (tab !== id) (e.currentTarget as HTMLElement).style.background = "var(--bg-app)";
            }}
            onMouseLeave={(e) => {
              if (tab !== id) (e.currentTarget as HTMLElement).style.background = "";
            }}
          >
            <Icon size={14} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "overview"   && <SupervisorChartsView />}
      {tab === "wallboard"  && <WallboardGrid />}
      {tab === "recordings" && <CallRecordingsTab />}
      {tab === "queues"     && <QueueHealthView />}

      {/* Floating audio supervision panel */}
      <SupervisionAudioPanel />
    </div>
  );
}

function QueueHealthView() {
  const queues = [
    {
      name: "Campaign Health",
      color: "#3b82f6",
      rows: [
        ["Total Live Campaigns", "4 Active"],
        ["Average Wait Time", "12s"],
        ["Abandon Rate", "2.1% (SLA: <5%)"],
        ["Service Level", "94% (Target: 90%)"],
      ],
    },
    {
      name: "Lead Queues",
      color: "#8b5cf6",
      rows: [
        ["PL_Bucket_2", "4,280 remaining"],
        ["CreditCard_DPD_30", "2,910 remaining"],
        ["AutoLoan_Delinquency", "1,450 remaining"],
        ["PL_Bucket_1", "6,120 remaining"],
      ],
    },
    {
      name: "Agent Utilization",
      color: "#10b981",
      rows: [
        ["Available / Idle", "31 Agents"],
        ["On Call / Talking", "138 Agents"],
        ["On Break / Wrap-up", "31 Agents"],
        ["Occupancy Rate", "84.5%"],
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {queues.map((q) => (
        <div
          key={q.name}
          className="rounded-xl p-5 space-y-4"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: q.color }}
            />
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {q.name}
            </span>
          </div>
          <div className="space-y-2.5">
            {q.rows.map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between text-xs py-1.5"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <span style={{ color: "var(--text-secondary)" }}>{key}</span>
                <span className="font-semibold font-mono" style={{ color: "var(--text-primary)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
