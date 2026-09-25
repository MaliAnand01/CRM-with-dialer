"use client";

import React from "react";
import { useDialerStore } from "@/store/dialerStore";
import { CheckCircle2, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export function DispositionPanel() {
  const {
    activeLead,
    dispositionStatus,
    ptpAmount,
    ptpDate,
    remarks,
    sendWhatsAppNotice,
    setDispositionField,
    submitDisposition,
    dispositionToast,
    clearToast,
  } = useDialerStore();

  const isPTP = dispositionStatus === "PTP";

  return (
    <div
      className="tour-agent-disposition rounded-xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-app)" }}
      >
        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Log Call Activity
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Record outcome and commitments
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Toast */}
        {dispositionToast && (
          <div
            className="flex items-start justify-between gap-2 p-3 rounded-lg text-xs"
            style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534" }}
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <span>{dispositionToast}</span>
            </div>
            <button onClick={clearToast} className="font-bold text-base leading-none cursor-pointer shrink-0">×</button>
          </div>
        )}

        {/* Call Outcome — Custom Select */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Call Outcome <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <Select value={dispositionStatus} onValueChange={(v) => setDispositionField("dispositionStatus", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Positive</SelectLabel>
                <SelectItem value="PTP">Promise to Pay (PTP)</SelectItem>
                <SelectItem value="PAID">Customer Already Paid</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Follow-up</SelectLabel>
                <SelectItem value="CALL_BACK">Call Back Requested</SelectItem>
                <SelectItem value="DISPUTE">Dispute — Interest / Charges</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Negative</SelectLabel>
                <SelectItem value="RTP">Refused to Pay</SelectItem>
                <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
                <SelectItem value="RINGING_NO_ANSWER">No Answer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* PTP fields */}
        {isPTP && (
          <div
            className="p-4 rounded-lg space-y-3"
            style={{ background: "#f0fdf4", border: "1px solid #86efac" }}
          >
            <div className="text-xs font-semibold" style={{ color: "#166534" }}>
              Payment Commitment
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  Amount (₹) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="number"
                  value={ptpAmount}
                  onChange={(e) => setDispositionField("ptpAmount", e.target.value)}
                  placeholder="14250"
                  className="w-full h-9 rounded-lg border px-3 text-sm font-mono outline-none"
                  style={{ borderColor: "#86efac", background: "#fff", color: "var(--text-primary)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#86efac")}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  Payment Date <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="date"
                  value={ptpDate}
                  onChange={(e) => setDispositionField("ptpDate", e.target.value)}
                  className="w-full h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ borderColor: "#86efac", background: "#fff", color: "var(--text-primary)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Conversation Notes
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setDispositionField("remarks", e.target.value)}
            placeholder="Note borrower response, reason for delay, or next steps..."
            className="w-full rounded-lg border p-3 text-sm outline-none resize-none"
            style={{ borderColor: "var(--border-default)", background: "#fff", color: "var(--text-primary)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
          />
        </div>

        {/* WhatsApp toggle */}
        <div
          className="p-3.5 rounded-lg"
          style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
        >
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={sendWhatsAppNotice}
              onChange={(e) => setDispositionField("sendWhatsAppNotice", e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: "var(--brand-primary)" }}
            />
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Send WhatsApp payment link
            </span>
          </label>
          {sendWhatsAppNotice && (
            <div
              className="mt-3 p-2.5 rounded-lg text-xs font-mono leading-relaxed"
              style={{ background: "#fff", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
            >
              &quot;Dear {activeLead?.customerName ?? "Customer"}, your payment of ₹{ptpAmount || "—"} is due on {ptpDate || "—"}. Pay via UPI: pay.fintel.in/quickpay&quot;
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={submitDisposition}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold text-white cursor-pointer"
          style={{ background: "var(--text-primary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1e293b")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--text-primary)")}
        >
          <Check size={15} />
          Save & Ready Next Call
        </button>
      </div>
    </div>
  );
}
