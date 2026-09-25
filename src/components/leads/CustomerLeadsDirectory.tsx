"use client";

import React, { useState } from "react";
import { useDialerStore, BankingCustomer } from "@/store/dialerStore";
import { Search, Phone, Download, ChevronRight } from "lucide-react";
import { LeadProfileDrawer } from "./LeadProfileDrawer";

interface LeadItem {
  id: string;
  loanNo: string;
  name: string;
  phone: string;
  overdue: number;
  total: number;
  bucket: string;
  dueDate: string;
  lastOutcome: string;
  outcomeType: "ptp" | "callback" | "dispute" | "refused";
}

const mockLeads: LeadItem[] = [
  { id: "LD-101", loanNo: "BLR-PL-94812", name: "Rameshwar K. Sharma", phone: "+91 98765 XXXXX", overdue: 14250, total: 184500, bucket: "Bucket 2", dueDate: "10-Sep-2026", lastOutcome: "PTP — 28 Sep", outcomeType: "ptp" },
  { id: "LD-102", loanNo: "MUM-CC-83109", name: "Sunil S. Deshmukh",   phone: "+91 98201 XXXXX", overdue: 8900,  total: 62400,  bucket: "Bucket 1", dueDate: "15-Sep-2026", lastOutcome: "Call Back",      outcomeType: "callback" },
  { id: "LD-103", loanNo: "DEL-AL-72910", name: "Harish Chandra Gupta",phone: "+91 99112 XXXXX", overdue: 21500, total: 340000, bucket: "Bucket 3", dueDate: "05-Aug-2026", lastOutcome: "Dispute",         outcomeType: "dispute" },
  { id: "LD-104", loanNo: "BLR-PL-10928", name: "Vikram Malhotra",     phone: "+91 97410 XXXXX", overdue: 18200, total: 210000, bucket: "Bucket 2", dueDate: "12-Sep-2026", lastOutcome: "PTP — 30 Sep",    outcomeType: "ptp" },
  { id: "LD-105", loanNo: "HYD-CC-91823", name: "K. Venkatesh Rao",    phone: "+91 98490 XXXXX", overdue: 12400, total: 95000,  bucket: "Bucket 1", dueDate: "18-Sep-2026", lastOutcome: "PTP — 25 Sep",    outcomeType: "ptp" },
  { id: "LD-106", loanNo: "PUN-PL-44102", name: "Anand Kulkarni",      phone: "+91 98220 XXXXX", overdue: 9800,  total: 145000, bucket: "Bucket 1", dueDate: "20-Sep-2026", lastOutcome: "Call Back",        outcomeType: "callback" },
];

// Convert a LeadItem to a BankingCustomer for the profile drawer
function leadToBankingCustomer(lead: LeadItem): BankingCustomer {
  const bucketMap: Record<string, BankingCustomer["dpdBucket"]> = {
    "Bucket 1": "Bucket 1 (1-30 DPD)",
    "Bucket 2": "Bucket 2 (31-60 DPD)",
    "Bucket 3": "Bucket 3 (61-90 DPD)",
  };
  return {
    id: lead.id,
    loanAccountNo: lead.loanNo,
    customerName: lead.name,
    maskedPhone: lead.phone,
    dpdBucket: bucketMap[lead.bucket] || "Bucket 1 (1-30 DPD)",
    totalOutstanding: lead.total,
    overdueEmi: lead.overdue,
    emiDueDate: lead.dueDate,
    tenureRemaining: "18 of 36 Months",
    productType: lead.loanNo.includes("CC") ? "Credit Card" : lead.loanNo.includes("AL") ? "Auto Loan (Secured)" : "Personal Loan (Unsecured)",
    mandateStatus: lead.outcomeType === "ptp" ? "Active (Auto-Debit)" : "Bounced (Insufficient Funds)",
    employer: "Not Available",
    assignedQueue: "Collections_Tier_2",
    pastInteractions: [
      {
        id: "INT-GEN-1",
        date: "20-Sep-2026 10:30 AM",
        agent: "System Generated",
        disposition: lead.lastOutcome.includes("PTP") ? "PTP (Promise to Pay)" : lead.lastOutcome,
        notes: lead.lastOutcome.includes("PTP")
          ? `Customer committed to pay by ${lead.lastOutcome.replace("PTP — ", "")}.`
          : "Last interaction recorded from campaign auto-dialer.",
        ptpAmount: lead.outcomeType === "ptp" ? lead.overdue : undefined,
        ptpDate: lead.outcomeType === "ptp" ? lead.lastOutcome.replace("PTP — ", "") : undefined,
      },
    ],
  };
}

const bucketStyle: Record<string, { bg: string; color: string; border: string }> = {
  "Bucket 1": { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
  "Bucket 2": { bg: "#ffedd5", color: "#9a3412", border: "#fed7aa" },
  "Bucket 3": { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
};

const outcomeStyle: Record<string, { bg: string; color: string }> = {
  ptp:      { bg: "#dcfce7", color: "#166534" },
  callback: { bg: "#dbeafe", color: "#1e40af" },
  dispute:  { bg: "#fef9c3", color: "#854d0e" },
  refused:  { bg: "#fee2e2", color: "#991b1b" },
};

const BUCKET_FILTERS = ["ALL", "Bucket 1", "Bucket 2", "Bucket 3"] as const;

export function CustomerLeadsDirectory() {
  const [search, setSearch] = useState("");
  const [bucketFilter, setBucketFilter] = useState("ALL");
  const { setRole, setActiveView, simulateIncomingCall, openLeadProfile } = useDialerStore();

  const filtered = mockLeads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.name.toLowerCase().includes(q) || l.loanNo.toLowerCase().includes(q);
    const matchBucket = bucketFilter === "ALL" || l.bucket === bucketFilter;
    return matchSearch && matchBucket;
  });

  function handleRowClick(lead: LeadItem) {
    openLeadProfile(leadToBankingCustomer(lead));
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Leads & Accounts
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Search and filter active borrower accounts across delinquency buckets.
            </p>
          </div>
          <button
            onClick={() => alert("Leads exported to CSV.")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-colors"
            style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)", background: "#fff" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#fff")}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-3 p-3 rounded-xl"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div className="relative flex-1 min-w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search name or loan ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border text-sm outline-none"
              style={{ borderColor: "var(--border-default)", background: "var(--bg-app)", color: "var(--text-primary)" }}
            />
          </div>

          <div
            className="flex items-center rounded-lg p-0.5"
            style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
          >
            {BUCKET_FILTERS.map((b) => (
              <button
                key={b}
                onClick={() => setBucketFilter(b)}
                className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors"
                style={
                  bucketFilter === b
                    ? { background: "#fff", color: "var(--text-primary)", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                {b === "ALL" ? "All Buckets" : b}
              </button>
            ))}
          </div>

          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {filtered.length} records
          </span>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-app)" }}>
                  {["Borrower", "Loan ID", "Phone", "Overdue EMI", "Outstanding", "Bucket", "Last Outcome", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold"
                      style={{ color: "var(--text-secondary)", fontSize: 12 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const bs = bucketStyle[lead.bucket] ?? bucketStyle["Bucket 1"];
                  const os = outcomeStyle[lead.outcomeType];
                  return (
                    <tr
                      key={lead.id}
                      className="transition-colors cursor-pointer group"
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                      onClick={() => handleRowClick(lead)}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                            style={{ background: "var(--bg-sidebar)" }}
                          >
                            {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-semibold whitespace-nowrap group-hover:text-blue-700 transition-colors" style={{ color: "var(--text-primary)" }}>
                              {lead.name}
                            </span>
                            <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                              Click to view profile
                              <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        {lead.loanNo}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold" style={{ color: "#dc2626" }}>
                        ₹{lead.overdue.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        ₹{lead.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{ background: bs.bg, color: bs.color, borderColor: bs.border }}
                        >
                          {lead.bucket}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: os.bg, color: os.color }}
                        >
                          {lead.lastOutcome}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setRole("agent"); setActiveView("agent"); simulateIncomingCall(); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer transition-colors whitespace-nowrap"
                          style={{ background: "var(--brand-primary)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary-hover)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary)")}
                        >
                          <Phone size={12} />
                          Dial
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Profile Drawer */}
      <LeadProfileDrawer />
    </>
  );
}
