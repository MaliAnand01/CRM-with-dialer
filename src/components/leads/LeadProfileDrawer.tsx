"use client";

import React, { useState } from "react";
import { useDialerStore, BankingCustomer } from "@/store/dialerStore";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Phone,
  FileText,
  Clock,
  User,
  CreditCard,
  Building,
  Calendar,
  Shield,
  ChevronRight,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "history", label: "History", icon: Clock },
  { id: "guide", label: "Call Guide", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function LeadProfileDrawer() {
  const { viewingLeadProfile, closeLeadProfile, setRole, setActiveView, simulateIncomingCall } =
    useDialerStore();
  const [tab, setTab] = useState<TabId>("overview");

  if (!viewingLeadProfile) return null;

  const lead = viewingLeadProfile;

  const dpdColor = lead.dpdBucket.includes("Bucket 4") || lead.dpdBucket.includes("90+")
    ? { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" }
    : lead.dpdBucket.includes("Bucket 3") || lead.dpdBucket.includes("61")
    ? { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" }
    : lead.dpdBucket.includes("Bucket 2") || lead.dpdBucket.includes("31")
    ? { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" }
    : { bg: "#fef9c3", text: "#854d0e", border: "#fde047" };

  function handleDialLead() {
    setRole("agent");
    setActiveView("agent");
    simulateIncomingCall();
    closeLeadProfile();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeLeadProfile}
      />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ borderLeft: "1px solid var(--border-default)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="flex items-center justify-center rounded-xl font-bold text-white text-base shrink-0"
                style={{ width: 48, height: 48, background: "var(--bg-sidebar)" }}
              >
                {lead.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    className="text-base font-semibold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {lead.customerName}
                  </h2>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0"
                    style={{
                      background: dpdColor.bg,
                      color: dpdColor.text,
                      borderColor: dpdColor.border,
                    }}
                  >
                    {lead.dpdBucket}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="font-mono">Loan #{lead.loanAccountNo}</span>
                  <span className="flex items-center gap-1">
                    <Phone size={11} />
                    {lead.maskedPhone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDialLead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white cursor-pointer"
                style={{ background: "var(--brand-primary)" }}
              >
                <Phone size={13} />
                Dial
              </button>
              <button
                onClick={closeLeadProfile}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Shield badge */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{
                background: "var(--bg-app)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              <Shield size={12} />
              Number Masked
            </div>
            <div
              className="text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{
                background: "var(--bg-app)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              {lead.assignedQueue}
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div
          className="grid grid-cols-4 divide-x divide-slate-200 shrink-0"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          {[
            {
              label: "Overdue EMI",
              value: `₹${lead.overdueEmi.toLocaleString("en-IN")}`,
              sub: `Due: ${lead.emiDueDate}`,
              color: "#dc2626",
            },
            {
              label: "Outstanding",
              value: `₹${lead.totalOutstanding.toLocaleString("en-IN")}`,
              sub: lead.tenureRemaining,
              color: "var(--text-primary)",
            },
            {
              label: "NACH / Mandate",
              value: lead.mandateStatus.includes("Bounced") ? "Bounced" : "Active",
              sub: lead.mandateStatus.includes("(")
                ? lead.mandateStatus.split("(")[1].replace(")", "")
                : "Auto-Debit",
              color: lead.mandateStatus.includes("Bounced") ? "#dc2626" : "#16a34a",
            },
            {
              label: "Product",
              value: lead.productType.split("(")[0].trim(),
              sub: "Retail Banking",
              color: "var(--text-primary)",
            },
          ].map((kpi) => (
            <div key={kpi.label} className="px-4 py-3">
              <div className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>
                {kpi.label}
              </div>
              <div className="text-sm font-bold font-mono" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {kpi.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 shrink-0">
          <div className="flex gap-0" style={{ borderBottom: "1px solid var(--border-default)" }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2"
                style={
                  tab === id
                    ? {
                        color: "var(--brand-primary)",
                        borderBottomColor: "var(--brand-primary)",
                        marginBottom: -1,
                      }
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
                    {lead.pastInteractions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "overview" && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["Employer", lead.employer],
                ["Payment Mode", "Auto-Debit NACH (Bounced)"],
                ["Monthly EMI", "₹14,250"],
                ["Co-Borrower", "Sunita Sharma (Spouse)"],
                ["Repayment Cycle", "10th of every month"],
                ["Last Notice", "EMI Reminder via SMS"],
              ].map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-3 py-2"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                    {key}
                  </span>
                  <span className="text-xs font-semibold text-right" style={{ color: "var(--text-primary)" }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-3">
              {lead.pastInteractions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg p-4"
                  style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium" style={{ color: "var(--text-muted)" }}>
                      {item.date}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.disposition}
                    </Badge>
                  </div>
                  <div className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    By:{" "}
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.agent}
                    </span>
                  </div>
                  {item.ptpAmount && (
                    <div
                      className="inline-block text-xs font-semibold px-2 py-1 rounded-md mb-2"
                      style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}
                    >
                      PTP: ₹{item.ptpAmount.toLocaleString("en-IN")} on {item.ptpDate}
                    </div>
                  )}
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.notes}
                  </p>
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
                style={{
                  background: "var(--bg-app)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                &quot;Good day, am I speaking with Mr./Ms. {lead.customerName}? My name is ___
                calling regarding loan account #{lead.loanAccountNo}. We noticed an overdue
                EMI of ₹{lead.overdueEmi.toLocaleString("en-IN")} due on {lead.emiDueDate}.
                Can you confirm when you plan to clear this payment?&quot;
              </div>
              <ul className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Verify identity before stating any figures — ask for date of birth or last 4 digits of PAN.</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>If borrower commits, capture the exact PTP amount and date in the disposition panel.</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Remind the borrower that a payment link will be sent via WhatsApp immediately after the call.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
