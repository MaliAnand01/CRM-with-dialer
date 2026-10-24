"use client";

import React, { useState } from "react";
import { Settings, Users, Database, Shield, DatabaseBackup, Radio, Megaphone, Plus } from "lucide-react";
import { GatewaysTab } from "@/components/supervisor/GatewaysTab";
import { CampaignCreatorModal } from "@/components/supervisor/CampaignCreatorModal";

// ---------------------------------------------------------------------------
// Mock campaign list for the Campaigns panel
// ---------------------------------------------------------------------------

const MOCK_CAMPAIGNS = [
  { id: "CAM-001", name: "PL Collections — Oct Batch",    product: "Personal Loan",    status: "active",  leads: 4280, dialMode: "Predictive", gateway: "Own 2G" },
  { id: "CAM-002", name: "Auto Loan Recovery — Q4",       product: "Auto Loan",         status: "active",  leads: 1450, dialMode: "Predictive", gateway: "Rent 4G" },
  { id: "CAM-003", name: "Credit Card 30 DPD",            product: "Credit Card",       status: "paused",  leads: 2910, dialMode: "Progressive", gateway: "Own 2G" },
  { id: "CAM-004", name: "NACH Bounce Recovery",          product: "NACH Mandate",      status: "paused",  leads: 890,  dialMode: "Preview",     gateway: "Auto" },
  { id: "CAM-005", name: "Tele-Verification Nov",         product: "Verification",      status: "draft",   leads: 3200, dialMode: "Manual",      gateway: "Rent 4G" },
];

type CampaignStatus = "active" | "paused" | "draft";

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, { label: string; bg: string; color: string }> = {
    active: { label: "Active",  bg: "#dcfce7", color: "#166534" },
    paused: { label: "Paused",  bg: "#fef9c3", color: "#92400e" },
    draft:  { label: "Draft",   bg: "var(--bg-app)", color: "var(--text-secondary)" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ background: s.bg, color: s.color, border: status === "draft" ? "1px solid var(--border-default)" : "none" }}
    >
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SettingsTab
// ---------------------------------------------------------------------------

export function SettingsTab() {
  const [activeTab, setActiveTab] = useState("ingestion");
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const NAV = [
    { id: "ingestion",  label: "Lead Ingestion",  icon: Database },
    { id: "campaigns",  label: "Campaigns",        icon: Megaphone },
    { id: "gateways",   label: "Gateways",         icon: Radio },
    { id: "users",      label: "Users & Roles",    icon: Users },
    { id: "security",   label: "Security (DLP)",   icon: Shield },
    { id: "general",    label: "General Config",   icon: Settings },
  ];

  return (
    <>
      {showCampaignModal && (
        <CampaignCreatorModal onClose={() => setShowCampaignModal(false)} />
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            System Settings & Integrations
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Manage campaigns, telephony gateways, lead ingestion, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left nav */}
          <div className="md:col-span-1 space-y-1">
            {NAV.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left"
                style={
                  activeTab === t.id
                    ? { background: "var(--brand-light)", color: "var(--brand-primary-text)" }
                    : { color: "var(--text-secondary)" }
                }
                onMouseEnter={(e) => {
                  if (activeTab !== t.id) (e.currentTarget as HTMLElement).style.background = "var(--bg-app)";
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== t.id) (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Right content */}
          <div className="md:col-span-3">

            {/* Gateways */}
            {activeTab === "gateways" && <GatewaysTab />}

            {/* Campaigns */}
            {activeTab === "campaigns" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Campaign Manager</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      Create and manage outbound dialling campaigns. Each campaign binds a lead list to a gateway pool and a dial strategy.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCampaignModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
                    style={{ background: "var(--brand-primary)", color: "#fff" }}
                  >
                    <Plus size={13} />
                    New Campaign
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "var(--bg-app)", borderBottom: "1px solid var(--border-default)" }}>
                        {["Campaign", "Product", "Leads", "Dial Mode", "Gateway", "Status", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_CAMPAIGNS.map((c, i) => (
                        <tr
                          key={c.id}
                          style={{
                            background: i % 2 === 0 ? "#fff" : "var(--bg-app)",
                            borderBottom: "1px solid var(--border-subtle)",
                          }}
                        >
                          <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                            {c.name}
                          </td>
                          <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{c.product}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: "var(--text-primary)" }}>
                            {c.leads.toLocaleString()}
                          </td>
                          <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{c.dialMode}</td>
                          <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{c.gateway}</td>
                          <td className="px-4 py-3">
                            <CampaignStatusBadge status={c.status as CampaignStatus} />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="text-xs font-medium cursor-pointer px-2 py-1 rounded-md"
                              style={{ color: "var(--brand-primary)", border: "1px solid var(--brand-primary)" }}
                            >
                              {c.status === "active" ? "Pause" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lead Ingestion */}
            {activeTab === "ingestion" && (
              <div className="p-6 rounded-xl space-y-6" style={{ background: "#fff", border: "1px solid var(--border-default)" }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Lead Ingestion Settings</h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    Configure how leads arrive in the CRM. You can map CBS (Core Banking System) APIs or manually upload CSV lists.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg flex items-center justify-between" style={{ border: "1px solid var(--border-default)", background: "var(--bg-app)" }}>
                    <div className="flex items-center gap-3">
                      <DatabaseBackup size={18} style={{ color: "var(--brand-primary)" }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Automated API Sync (Core Banking)</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Webhooks active: CBS_PULL, PTP_PUSH</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer" style={{ background: "var(--brand-primary)", color: "#fff" }}>
                      Configure Endpoints
                    </button>
                  </div>
                  <div className="p-4 rounded-lg flex items-center justify-between" style={{ border: "1px solid var(--border-default)", background: "var(--bg-app)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "#dcfce7", color: "#166534" }}>CSV</div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Manual Lead Upload (CSV / Excel)</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Standard Vicidial layout format</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border" style={{ background: "#fff", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                      Upload File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="p-6 rounded-xl space-y-6" style={{ background: "#fff", border: "1px solid var(--border-default)" }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Data Loss Prevention (DLP)</h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    Protect sensitive PII (Personally Identifiable Information) data.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    "Disable Right-Click and Text Selection on Agent Views",
                    "Disable Print Screen / Screenshot shortcuts",
                    "Mask Phone Numbers and Email Addresses by Default",
                    "Log all lead exports to Audit Trail",
                  ].map((setting, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}>
                      <input type="checkbox" defaultChecked className="w-4 h-4" style={{ accentColor: "var(--brand-primary)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{setting}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "users" || activeTab === "general") && (
              <div className="p-6 rounded-xl" style={{ background: "#fff", border: "1px solid var(--border-default)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>This section is currently under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
