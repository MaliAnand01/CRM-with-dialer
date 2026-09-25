"use client";

import React, { useState } from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Badge } from "@/components/ui/badge";
import { Phone, Shield, User, Clock, FileText, ExternalLink } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "history",  label: "History",  icon: Clock },
  { id: "guide",    label: "Call Guide", icon: FileText },
] as const;

type TabId = typeof TABS[number]["id"];

export function Customer360Card() {
  const { activeLead, openLeadProfile, dispositionSubmitted } = useDialerStore();
  const [tab, setTab] = useState<TabId>("overview");

  if (!activeLead) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl p-16 text-center"
        style={{ background: "#fff", border: "1px solid var(--border-default)", minHeight: 320 }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{ background: "var(--bg-app)" }}
        >
          <User size={20} style={{ color: "var(--text-muted)" }} />
        </div>
        <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          No active lead
        </div>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          When a call connects, the borrower profile will appear here.
        </div>
      </div>
    );
  }

  const dpdColor =
    activeLead.dpdBucket.includes("Bucket 4") || activeLead.dpdBucket.includes("90+")
      ? { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" }
      : activeLead.dpdBucket.includes("Bucket 3") || activeLead.dpdBucket.includes("61")
      ? { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" }
      : activeLead.dpdBucket.includes("Bucket 2") || activeLead.dpdBucket.includes("31")
      ? { bg: "#fef9c3", text: "#854d0e", border: "#fde047" }
      : { bg: "#dcfce7", text: "#166534", border: "#86efac" };

  return (
    <div
      className="tour-agent-customer-360 rounded-xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid var(--border-default)" }}
    >
      {/* Header section */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="flex items-center justify-center rounded-xl font-bold text-white text-base shrink-0"
              style={{ width: 48, height: 48, background: "var(--bg-sidebar)" }}
            >
              {activeLead.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {activeLead.customerName}
                </h2>
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                  style={{ background: dpdColor.bg, color: dpdColor.text, borderColor: dpdColor.border }}
                >
                  {activeLead.dpdBucket}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                  Loan #{activeLead.loanAccountNo}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <Phone size={11} />
                  {activeLead.maskedPhone}
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {activeLead.assignedQueue}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openLeadProfile(activeLead)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs"
              title="Open full Customer 360 profile modal"
            >
              <ExternalLink size={12} />
              Full Profile
            </button>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0"
              style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
            >
              <Shield size={12} />
              Number Masked
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div
        className="grid grid-cols-4 divide-x divide-slate-200"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        {[
          {
            label: "Overdue EMI",
            value: `₹${activeLead.overdueEmi.toLocaleString("en-IN")}`,
            sub: `Due: ${activeLead.emiDueDate}`,
            valueColor: "#dc2626",
          },
          {
            label: "Outstanding",
            value: `₹${activeLead.totalOutstanding.toLocaleString("en-IN")}`,
            sub: activeLead.tenureRemaining,
            valueColor: "var(--text-primary)",
          },
          {
            label: "NACH / Mandate",
            value: activeLead.mandateStatus.includes("Bounced") ? "Bounced" : "Active",
            sub: activeLead.mandateStatus.includes("(") ? activeLead.mandateStatus.split("(")[1].replace(")", "") : "Auto-Debit",
            valueColor: activeLead.mandateStatus.includes("Bounced") ? "#dc2626" : "#16a34a",
          },
          {
            label: "Product",
            value: activeLead.productType.split("(")[0].trim(),
            sub: "Retail Banking",
            valueColor: "var(--text-primary)",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="px-5 py-4">
            <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              {kpi.label}
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: kpi.valueColor }}>
              {kpi.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Saved Activity Notification */}
      {dispositionSubmitted && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <strong>Call Activity Saved:</strong> Customer history & PTP commitment updated. Select{" "}
              <strong>History</strong> tab below to inspect.
            </span>
          </div>
          <button
            onClick={() => setTab("history")}
            className="text-xs font-semibold text-emerald-700 underline cursor-pointer hover:text-emerald-900 shrink-0 ml-2"
          >
            View History →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex gap-0" style={{ borderBottom: "1px solid var(--border-default)" }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2"
              style={
                tab === id
                  ? { color: "var(--brand-primary)", borderBottomColor: "var(--brand-primary)", marginBottom: -1 }
                  : { color: "var(--text-secondary)", borderBottomColor: "transparent" }
              }
            >
              <Icon size={13} />
              {label}
              {id === "history" && (
                <span
                  className="ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: "var(--bg-app)", color: "var(--text-secondary)" }}
                >
                  {activeLead.pastInteractions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-5">
        {tab === "overview" && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              ["Employer", activeLead.employer],
              ["Payment Mode", "Auto-Debit NACH (Bounced)"],
              ["Monthly EMI", "₹14,250"],
              ["Co-Borrower", "Sunita Sharma (Spouse)"],
              ["Repayment Cycle", "10th of every month"],
              ["Last Notice", "EMI Reminder via SMS"],
            ].map(([key, val]) => (
              <div key={key} className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="text-xs" style={{ color: "var(--text-muted)", flexShrink: 0 }}>{key}</span>
                <span className="text-xs font-medium text-right" style={{ color: "var(--text-primary)" }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-4">
            {activeLead.pastInteractions.map((item) => (
              <div
                key={item.id}
                className="rounded-lg p-4"
                style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{item.date}</span>
                  <Badge variant="outline" className="text-xs">{item.disposition}</Badge>
                </div>
                <div className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  By: <span className="font-medium" style={{ color: "var(--text-primary)" }}>{item.agent}</span>
                </div>
                {item.ptpAmount && (
                  <div
                    className="inline-block text-xs font-semibold px-2 py-1 rounded-md mb-2"
                    style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}
                  >
                    PTP: ₹{item.ptpAmount.toLocaleString("en-IN")} on {item.ptpDate}
                  </div>
                )}
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.notes}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "guide" && (
          <div className="space-y-4">
            <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Standard Collections Conversation Guide
            </div>
            <div
              className="p-4 rounded-lg text-sm leading-relaxed italic"
              style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            >
              &quot;Good day, am I speaking with Mr./Ms. {activeLead.customerName}? My name is calling regarding loan account #{activeLead.loanAccountNo}. We noticed an overdue EMI of ₹{activeLead.overdueEmi.toLocaleString("en-IN")} due on {activeLead.emiDueDate}. Can you confirm when you plan to clear this payment?&quot;
            </div>
            <ul className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li className="flex gap-2"><span>•</span><span>Verify identity before stating any figures — ask for date of birth or last 4 digits of PAN.</span></li>
              <li className="flex gap-2"><span>•</span><span>If borrower commits, capture the exact PTP amount and date in the disposition panel.</span></li>
              <li className="flex gap-2"><span>•</span><span>Remind the borrower that a payment link will be sent via WhatsApp immediately after the call.</span></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
