"use client";

import React, { useState } from "react";
import { useDialerStore, BankingCustomer } from "@/store/dialerStore";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Phone,
  PhoneCall,
  FileText,
  Clock,
  User,
  Shield,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  ArrowUpRight,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Financial & Loan Details", icon: User },
  { id: "history", label: "Interaction & Call History", icon: Clock },
  { id: "commitments", label: "Payment Commitments (PTP)", icon: CheckCircle2 },
  { id: "guide", label: "Call Script & Compliance", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CustomerProfileModal() {
  const { viewingLeadProfile, closeLeadProfile, setRole, setActiveView, simulateIncomingCall } =
    useDialerStore();
  const [tab, setTab] = useState<TabId>("overview");

  if (!viewingLeadProfile) return null;

  const lead = viewingLeadProfile;

  const dpdColor =
    lead.dpdBucket.includes("Bucket 4") || lead.dpdBucket.includes("90+")
      ? { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" }
      : lead.dpdBucket.includes("Bucket 3") || lead.dpdBucket.includes("61")
      ? { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" }
      : lead.dpdBucket.includes("Bucket 2") || lead.dpdBucket.includes("31")
      ? { bg: "#fef9c3", text: "#854d0e", border: "#fde047" }
      : { bg: "#dcfce7", text: "#166534", border: "#86efac" };

  function handleDialLead() {
    setRole("agent");
    setActiveView("agent");
    simulateIncomingCall();
    closeLeadProfile();
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={closeLeadProfile}
      />

      {/* Modal Dialog Container */}
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div
          className="px-6 py-5 shrink-0 border-b border-slate-200 bg-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="flex items-center justify-center rounded-2xl font-bold text-white text-lg shrink-0 shadow-sm"
                style={{ width: 52, height: 52, background: "var(--bg-sidebar)" }}
              >
                {lead.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 truncate">
                    {lead.customerName}
                  </h1>
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
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                  <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Loan #{lead.loanAccountNo}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <Phone size={12} className="text-slate-400" />
                    {lead.maskedPhone}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    <Shield size={11} />
                    DLP Masked
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-medium text-slate-600">{lead.assignedQueue}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                onClick={handleDialLead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer transition-all shadow-sm hover:shadow"
                style={{ background: "var(--brand-primary)" }}
              >
                <PhoneCall size={14} />
                Initiate Call
              </button>
              <button
                onClick={closeLeadProfile}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Metric Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200 shrink-0">
          <div className="p-4 sm:px-6 sm:py-3.5">
            <div className="text-xs font-medium text-slate-500 mb-0.5">Overdue Balance</div>
            <div className="text-base font-bold font-mono text-rose-600">
              ₹{lead.overdueEmi.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Due date: {lead.emiDueDate}</div>
          </div>
          <div className="p-4 sm:px-6 sm:py-3.5">
            <div className="text-xs font-medium text-slate-500 mb-0.5">Total Outstanding</div>
            <div className="text-base font-bold font-mono text-slate-900">
              ₹{lead.totalOutstanding.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{lead.tenureRemaining}</div>
          </div>
          <div className="p-4 sm:px-6 sm:py-3.5">
            <div className="text-xs font-medium text-slate-500 mb-0.5">NACH Mandate Status</div>
            <div
              className={`text-base font-bold flex items-center gap-1.5 ${
                lead.mandateStatus.includes("Bounced") ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {lead.mandateStatus.includes("Bounced") ? "Bounced" : "Active"}
              <span className="text-xs font-normal text-slate-500">
                ({lead.mandateStatus.includes("(") ? lead.mandateStatus.split("(")[1].replace(")", "") : "Auto-Debit"})
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Primary clearing bank: HDFC</div>
          </div>
          <div className="p-4 sm:px-6 sm:py-3.5">
            <div className="text-xs font-medium text-slate-500 mb-0.5">Loan Category</div>
            <div className="text-base font-bold text-slate-900">
              {lead.productType.split("(")[0].trim()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Retail Banking Portfolio</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 shrink-0 border-b border-slate-200 bg-white">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  tab === id
                    ? "text-blue-700 border-blue-700 font-semibold"
                    : "text-slate-500 border-transparent hover:text-slate-800"
                }`}
              >
                <Icon size={15} />
                {label}
                {id === "history" && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">
                    {lead.pastInteractions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content — Generously Spaced & Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: Financial & Loan Details */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Employment & Borrower Profile */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  <Building2 size={16} className="text-blue-600" />
                  Employment & Borrower Identity
                </div>
                <div className="space-y-3">
                  {[
                    ["Current Employer", lead.employer || "Infosys Technologies Ltd, Bengaluru"],
                    ["Designation / Sector", "Senior Technical Lead · IT Services"],
                    ["Monthly Salary Band", "₹1,20,000 – ₹1,50,000 / month"],
                    ["Monthly EMI", `₹${lead.overdueEmi.toLocaleString("en-IN")}`],
                    ["Co-Borrower / Guarantor", "Sunita Sharma (Spouse)"],
                    ["Borrower Residence", "Koramangala 4th Block, Bengaluru, Karnataka"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-800 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Banking & Account Details */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  <CreditCard size={16} className="text-blue-600" />
                  Loan Structure & Auto-Debit Parameters
                </div>
                <div className="space-y-3">
                  {[
                    ["Loan Account Number", lead.loanAccountNo],
                    ["Original Disbursal Date", "14-Jan-2024 · ₹5,00,000"],
                    ["Repayment Cycle", "10th of every month"],
                    ["Auto-Debit Mandate", "HDFC Bank · A/C Ending in **4812"],
                    ["Mandate Bounce Reason", "Insufficient Funds on 10-Sep-2026"],
                    ["Delinquency Tier", `${lead.dpdBucket} · Collection Priority High`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-800 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Interaction & Call History */}
          {tab === "history" && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Chronological Touchpoints ({lead.pastInteractions.length} Total)
                </div>
                <span className="text-xs text-slate-400">All dates synced with Asterisk telephony logs</span>
              </div>

              <div className="space-y-3">
                {lead.pastInteractions.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span className="text-xs font-mono font-semibold text-slate-800">{item.date}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          Agent: <strong className="text-slate-700">{item.agent}</strong>
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2.5 py-0.5 font-medium ${
                          item.disposition.includes("PTP") || item.disposition.includes("Promise")
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : item.disposition.includes("Refused")
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : item.disposition.includes("Dispute")
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-blue-50 text-blue-800 border-blue-300"
                        }`}
                      >
                        {item.disposition}
                      </Badge>
                    </div>

                    {item.ptpAmount && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>
                          PTP Commitment: ₹{item.ptpAmount.toLocaleString("en-IN")}{" "}
                          {item.ptpDate ? `scheduled for ${item.ptpDate}` : ""}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Payment Commitments (PTP) */}
          {tab === "commitments" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Promise to Pay (PTP) Ledger</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Automated tracking of payment promises and WhatsApp link dispatch status</p>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 text-left">
                    <th className="py-3 px-5">Commitment Date</th>
                    <th className="py-3 px-5">Promised Amount</th>
                    <th className="py-3 px-5">Scheduled Pay Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Payment Link Dispatch</th>
                    <th className="py-3 px-5">Handled By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-5 font-mono text-slate-700">Today, Just now</td>
                    <td className="py-3 px-5 font-bold font-mono text-emerald-700">
                      ₹{lead.overdueEmi.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-5 font-mono">28-Sep-2026</td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Pending Clearance
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <Send size={12} />
                        WhatsApp Link Dispatched
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-700 font-medium">Vikram Gupta (Ext 1002)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-5 font-mono text-slate-700">18-Sep-2026</td>
                    <td className="py-3 px-5 font-bold font-mono text-slate-700">₹14,250</td>
                    <td className="py-3 px-5 font-mono">22-Sep-2026</td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                        Broken (Salary Delayed)
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500">SMS Reminder Sent</td>
                    <td className="py-3 px-5 text-slate-700 font-medium">Amit Verma (Ext 1024)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Call Script & Guidelines */}
          {tab === "guide" && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  <FileText size={16} className="text-blue-600" />
                  Mandatory Statutory Opening Disclosure (RBI / Fair Practices Compliant)
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-slate-800 text-sm leading-relaxed italic">
                  &quot;Good day, am I speaking with <strong>Mr./Ms. {lead.customerName}</strong>? My name is calling from the FinTel Retail Collections Unit on behalf of your creditor regarding your personal loan account <strong>#{lead.loanAccountNo}</strong>. We noticed an overdue EMI of <strong>₹{lead.overdueEmi.toLocaleString("en-IN")}</strong> that was due on <strong>{lead.emiDueDate}</strong>. Can you confirm when you plan to settle this balance?&quot;
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                    Mandatory Borrower Identity Checks
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Confirm Date of Birth or registered residential postal pincode.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Never state figures to third parties before confirming full borrower identity.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>All calls are monitored and recorded for quality assurance under bank guidelines.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                    PTP Negotiation Guidelines
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Always aim for full overdue payment clearance within 3 business days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>If full payment is difficult, negotiate a partial minimum payment of 50%.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Remind customer that automated WhatsApp payment links will be dispatched immediately.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const LeadProfileDrawer = CustomerProfileModal;
