"use client";

import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignForm {
  // Step 1 — Identity
  name: string;
  description: string;
  product: string;
  dialMode: string;
  // Step 2 — Lead list
  leadSource: string;
  leadFile: string;
  totalLeads: number;
  // Step 3 — Telephony
  gateway: string;
  callerId: string;
  maxAttempts: string;
  cooldownHours: string;
  dialRatio: string;
  // Step 4 — Schedule
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  weekdays: string[];
}

const STEPS = ["Identity", "Lead List", "Telephony", "Schedule", "Review"];

const PRODUCTS = [
  "Personal Loan Collections",
  "Auto Loan Recovery",
  "Credit Card 30 DPD",
  "Home Loan Mortgage",
  "NACH Mandate Bounce",
  "Tele-Verification",
  "E-Commerce Recovery",
  "Field Collection Routing",
];

const DIAL_MODES = [
  { value: "predictive", label: "Predictive — system dials ahead of agent availability" },
  { value: "progressive", label: "Progressive — one call per available agent" },
  { value: "preview",     label: "Preview — agent reviews lead before dial" },
  { value: "manual",      label: "Manual — agent dials manually" },
];

const GATEWAY_POOLS = [
  { value: "own-2g",   label: "Own 2G — Server 180 (Dinstar UC2000-VE, 13 GW)" },
  { value: "rent-4g",  label: "Rent 4G — Server 181 (Dinstar DWG2000F-4G, 12 GW)" },
  { value: "auto",     label: "Auto — load-balance across all registered trunks" },
];

const LEAD_SOURCES = [
  { value: "cbs-api",  label: "CBS API pull — Core Banking System webhook" },
  { value: "csv",      label: "CSV / Excel upload" },
  { value: "crm-queue",label: "CRM Queue — existing CRM segment" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EMPTY_FORM: CampaignForm = {
  name: "", description: "", product: "", dialMode: "predictive",
  leadSource: "", leadFile: "", totalLeads: 0,
  gateway: "auto", callerId: "+91 80XXXXX400", maxAttempts: "3",
  cooldownHours: "4", dialRatio: "3",
  startDate: "", endDate: "", startTime: "09:00", endTime: "18:00",
  weekdays: ["Mon","Tue","Wed","Thu","Fri"],
};

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
      {children}
    </label>
  );
}

function Input({
  value, onChange, placeholder, type = "text",
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
      style={{
        border: "1px solid var(--border-default)",
        background: "#fff",
        color: "var(--text-primary)",
      }}
    />
  );
}

function Select({
  value, onChange, children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
      style={{
        border: "1px solid var(--border-default)",
        background: "#fff",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Step panels
// ---------------------------------------------------------------------------

function Step1({ form, set }: { form: CampaignForm; set: (k: keyof CampaignForm, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Campaign name</Label>
        <Input value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. PL Collections — October Batch" />
      </div>
      <div>
        <Label>Description (internal)</Label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Brief note for supervisors..."
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{ border: "1px solid var(--border-default)", background: "#fff", color: "var(--text-primary)" }}
        />
      </div>
      <div>
        <Label>Product vertical</Label>
        <Select value={form.product} onChange={(v) => set("product", v)}>
          <option value="">Select product</option>
          {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
      </div>
      <div>
        <Label>Dial mode</Label>
        <div className="space-y-2">
          {DIAL_MODES.map((m) => (
            <label key={m.value} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg"
              style={{
                border: form.dialMode === m.value ? "1px solid var(--brand-primary)" : "1px solid var(--border-default)",
                background: form.dialMode === m.value ? "var(--brand-light)" : "#fff",
              }}
            >
              <input
                type="radio"
                value={m.value}
                checked={form.dialMode === m.value}
                onChange={() => set("dialMode", m.value)}
                className="mt-0.5 shrink-0"
                style={{ accentColor: "var(--brand-primary)" }}
              />
              <div>
                <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{m.label.split(" —")[0]}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{m.label.split(" —")[1]}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ form, set }: { form: CampaignForm; set: (k: keyof CampaignForm, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Lead source</Label>
        <div className="space-y-2">
          {LEAD_SOURCES.map((s) => (
            <label key={s.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg"
              style={{
                border: form.leadSource === s.value ? "1px solid var(--brand-primary)" : "1px solid var(--border-default)",
                background: form.leadSource === s.value ? "var(--brand-light)" : "#fff",
              }}
            >
              <input
                type="radio"
                value={s.value}
                checked={form.leadSource === s.value}
                onChange={() => set("leadSource", s.value)}
                style={{ accentColor: "var(--brand-primary)" }}
              />
              <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{s.label}</span>
            </label>
          ))}
        </div>
      </div>
      {form.leadSource === "csv" && (
        <div>
          <Label>Upload file</Label>
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
            style={{ borderColor: "var(--border-default)", background: "var(--bg-app)" }}
          >
            <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Click to select CSV / XLSX file
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              Required columns: phone, name, loan_account, dpd_bucket
            </p>
          </div>
        </div>
      )}
      {form.leadSource === "cbs-api" && (
        <div>
          <Label>CBS API endpoint</Label>
          <Input value="" onChange={() => {}} placeholder="https://core-banking.internal/api/v1/leads" />
        </div>
      )}
      <div>
        <Label>Estimated lead count</Label>
        <Input
          type="number"
          value={form.totalLeads}
          onChange={(v) => set("totalLeads", Number(v))}
          placeholder="e.g. 5000"
        />
      </div>
      <div
        className="p-3 rounded-lg text-xs"
        style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
      >
        Phone numbers are stored masked in the CRM. Agents see only the last 5 digits. Full number is passed directly to Asterisk for dialling and never displayed in the browser.
      </div>
    </div>
  );
}

function Step3({ form, set }: { form: CampaignForm; set: (k: keyof CampaignForm, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Gateway pool</Label>
        <Select value={form.gateway} onChange={(v) => set("gateway", v)}>
          {GATEWAY_POOLS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </Select>
      </div>
      <div>
        <Label>Outbound caller ID</Label>
        <Input value={form.callerId} onChange={(v) => set("callerId", v)} placeholder="+91 80XXXXX400" />
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Must be a DID registered on Asterisk trunk. Shown to customer on incoming call.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Max dial attempts per lead</Label>
          <Select value={form.maxAttempts} onChange={(v) => set("maxAttempts", v)}>
            {["1","2","3","4","5","6"].map((n) => <option key={n} value={n}>{n} attempts</option>)}
          </Select>
        </div>
        <div>
          <Label>Cooldown between attempts</Label>
          <Select value={form.cooldownHours} onChange={(v) => set("cooldownHours", v)}>
            {["1","2","4","6","8","12","24"].map((n) => <option key={n} value={n}>{n} hours</option>)}
          </Select>
        </div>
      </div>
      {form.dialMode === "predictive" && (
        <div>
          <Label>Predictive dial ratio (calls per agent)</Label>
          <Select value={form.dialRatio} onChange={(v) => set("dialRatio", v)}>
            {["1","2","3","4","5"].map((n) => <option key={n} value={n}>{n}:1</option>)}
          </Select>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Higher ratio increases throughput but raises abandon rate. Start at 3:1 and adjust.
          </p>
        </div>
      )}
    </div>
  );
}

function Step4({ form, set }: { form: CampaignForm; set: (k: keyof CampaignForm, v: any) => void }) {
  function toggleDay(day: string) {
    const next = form.weekdays.includes(day)
      ? form.weekdays.filter((d) => d !== day)
      : [...form.weekdays, day];
    set("weekdays", next);
  }
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start date</Label>
          <Input type="date" value={form.startDate} onChange={(v) => set("startDate", v)} />
        </div>
        <div>
          <Label>End date</Label>
          <Input type="date" value={form.endDate} onChange={(v) => set("endDate", v)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Daily start time</Label>
          <Input type="time" value={form.startTime} onChange={(v) => set("startTime", v)} />
        </div>
        <div>
          <Label>Daily end time</Label>
          <Input type="time" value={form.endTime} onChange={(v) => set("endTime", v)} />
        </div>
      </div>
      <div>
        <Label>Active days</Label>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
              style={
                form.weekdays.includes(day)
                  ? { background: "var(--brand-primary)", color: "#fff" }
                  : { background: "#fff", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }
              }
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div
        className="p-3 rounded-lg text-xs"
        style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
      >
        All times are IST. TRAI regulations prohibit outbound calls before 09:00 and after 21:00. The system will enforce these limits automatically.
      </div>
    </div>
  );
}

function Step5({ form }: { form: CampaignForm }) {
  const rows = [
    ["Campaign name",     form.name || "—"],
    ["Product vertical",  form.product || "—"],
    ["Dial mode",         form.dialMode],
    ["Lead source",       form.leadSource || "—"],
    ["Estimated leads",   form.totalLeads ? `${form.totalLeads.toLocaleString()}` : "—"],
    ["Gateway pool",      GATEWAY_POOLS.find(g => g.value === form.gateway)?.label.split(" —")[0] || "Auto"],
    ["Caller ID",         form.callerId || "—"],
    ["Max attempts",      `${form.maxAttempts} × with ${form.cooldownHours}h cooldown`],
    ["Schedule",          form.startDate && form.endDate ? `${form.startDate} to ${form.endDate}` : "Not set"],
    ["Daily window",      `${form.startTime} – ${form.endTime} IST`],
    ["Active days",       form.weekdays.join(", ") || "—"],
  ];
  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Review all settings before saving. The campaign will be created in a paused state — a supervisor must activate it from the Campaign Manager.
      </p>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className="flex items-center justify-between px-4 py-3 text-xs"
            style={{
              borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : "none",
              background: i % 2 === 0 ? "#fff" : "var(--bg-app)",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>{k}</span>
            <span className="font-semibold text-right max-w-[60%]" style={{ color: "var(--text-primary)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal shell
// ---------------------------------------------------------------------------

export function CampaignCreatorModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CampaignForm>(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  function set(key: keyof CampaignForm, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(onClose, 1800);
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4, 51, 75, 0.55)" }}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl shadow-xl flex flex-col"
        style={{ background: "#fff", border: "1px solid var(--border-default)", maxHeight: "92vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              New Campaign
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "var(--text-secondary)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={
                    i < step
                      ? { background: "#16a34a", color: "#fff" }
                      : i === step
                        ? { background: "var(--brand-primary)", color: "#fff" }
                        : { background: "var(--bg-app)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }
                  }
                >
                  {i < step ? <Check size={11} /> : i + 1}
                </div>
                <span
                  className="text-xs font-medium hidden sm:block"
                  style={{ color: i === step ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-px mx-2"
                  style={{ background: i < step ? "#16a34a" : "var(--border-default)" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {saved ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
                <Check size={20} style={{ color: "#16a34a" }} />
              </div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Campaign created</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Saved in paused state. Activate from Campaign Manager.
              </div>
            </div>
          ) : (
            <>
              {step === 0 && <Step1 form={form} set={set} />}
              {step === 1 && <Step2 form={form} set={set} />}
              {step === 2 && <Step3 form={form} set={set} />}
              {step === 3 && <Step4 form={form} set={set} />}
              {step === 4 && <Step5 form={form} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!saved && (
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderTop: "1px solid var(--border-default)" }}
          >
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer border"
              style={
                step === 0
                  ? { opacity: 0.4, borderColor: "var(--border-default)", color: "var(--text-secondary)", cursor: "not-allowed" }
                  : { borderColor: "var(--border-default)", color: "var(--text-primary)", background: "#fff" }
              }
            >
              <ChevronLeft size={14} />
              Back
            </button>
            {isLast ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: "var(--brand-primary)", color: "#fff" }}
              >
                Save campaign
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background: "var(--brand-primary)", color: "#fff" }}
              >
                Continue
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
