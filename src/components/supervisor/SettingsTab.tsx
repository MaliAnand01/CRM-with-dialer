"use client";

import React, { useState } from "react";
import { Settings, Users, Database, Shield, DatabaseBackup } from "lucide-react";

export function SettingsTab() {
  const [activeTab, setActiveTab] = useState("ingestion");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          System Settings & Integrations
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Manage core configurations, lead ingestion, and DLP security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {[
            { id: "ingestion", label: "Lead Ingestion", icon: Database },
            { id: "users", label: "Users & Roles", icon: Users },
            { id: "security", label: "Security (DLP)", icon: Shield },
            { id: "general", label: "General Config", icon: Settings },
          ].map((t) => (
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

        <div className="md:col-span-3">
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
                  <button className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors" style={{ background: "var(--brand-primary)", color: "#fff" }}>
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
                  <button className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border" style={{ background: "#fff", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                    Upload File
                  </button>
                </div>
              </div>
            </div>
          )}

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
  );
}
