"use client";

import React, { useState, useMemo } from "react";
import {
  useDialerStore,
  ALL_200_AGENTS,
  FloorAgent,
} from "@/store/dialerStore";
import {
  Eye,
  EyeOff,
  Search,
  AlertCircle,
  X,
  Users,
  ChevronRight,
} from "lucide-react";

const QUEUES = [
  "PL_Bucket_2",
  "CreditCard_DPD_30",
  "AutoLoan_Delinquency",
  "PL_Bucket_1",
  "NPA_PreRecovery",
];

export function LoginPage() {
  const { loginAgent, loginSupervisor } = useDialerStore();

  const [activeTab, setActiveTab] = useState<"agent" | "supervisor">("agent");

  // Agent form
  const [agentId, setAgentId] = useState("AGT-1002");
  const [agentPassword, setAgentPassword] = useState("agent123");
  const [extension, setExtension] = useState("1002");
  const [selectedQueue, setSelectedQueue] = useState("PL_Bucket_2");
  const [showAgentPass, setShowAgentPass] = useState(false);

  // Supervisor form
  const [supervisorId, setSupervisorId] = useState("SUP-2001");
  const [supervisorPassword, setSupervisorPassword] = useState("supervisor123");
  const [showSupervisorPass, setShowSupervisorPass] = useState(false);

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Agent picker modal
  const [isAgentPickerOpen, setIsAgentPickerOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const filteredAgents = useMemo(() => {
    if (!agentSearch.trim()) return ALL_200_AGENTS.slice(0, 50);
    const q = agentSearch.toLowerCase();
    return ALL_200_AGENTS.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.extension.includes(q) ||
        a.queue.toLowerCase().includes(q)
    );
  }, [agentSearch]);

  function handlePickAgent(agent: FloorAgent) {
    setAgentId(agent.id);
    setExtension(agent.extension);
    setSelectedQueue(agent.queue);
    setAgentPassword("agent123");
    setErrorMsg(null);
    setIsAgentPickerOpen(false);
  }

  function handleAgentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginAgent(agentId, agentPassword, selectedQueue);
      if (!res.success) {
        setErrorMsg(res.error || "Login failed. Check your credentials.");
        setIsSubmitting(false);
      }
    }, 300);
  }

  function handleSupervisorSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginSupervisor(supervisorId, supervisorPassword);
      if (!res.success) {
        setErrorMsg(res.error || "Login failed. Check your credentials.");
        setIsSubmitting(false);
      }
    }, 300);
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8"
      style={{
        background: "#f8fafc",
        fontFamily: "var(--font-sans, inherit)",
      }}
    >
      <div className="w-full max-w-[420px]">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center rounded-xl font-bold text-white text-lg mb-4"
            style={{ width: 44, height: 44, background: "var(--brand-primary)" }}
          >
            F
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            FinTel CRM
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6 sm:p-7"
          style={{
            background: "#fff",
            border: "1px solid var(--border-default)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Tab Switcher */}
          <div
            className="grid grid-cols-2 p-1 rounded-lg mb-6"
            style={{ background: "#f1f5f9" }}
          >
            <button
              type="button"
              onClick={() => { setActiveTab("agent"); setErrorMsg(null); }}
              className="py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer"
              style={
                activeTab === "agent"
                  ? { background: "#fff", color: "#0f172a", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }
                  : { color: "#64748b" }
              }
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("supervisor"); setErrorMsg(null); }}
              className="py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer"
              style={
                activeTab === "supervisor"
                  ? { background: "#fff", color: "#0f172a", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }
                  : { color: "#64748b" }
              }
            >
              Supervisor
            </button>
          </div>

          {/* Error */}
          {errorMsg && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg text-sm mb-4"
              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AGENT FORM */}
          {activeTab === "agent" && (
            <form onSubmit={handleAgentSubmit} className="space-y-4">
              {/* Quick select */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">
                    Demo Profiles
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAgentPickerOpen(true)}
                    className="text-xs font-medium cursor-pointer flex items-center gap-1"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    All 200 agents
                    <ChevronRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "AGT-1002", name: "Pooja Verma", ext: "1002", queue: "PL_Bucket_2" },
                    { id: "AGT-1001", name: "Rahul Sharma", ext: "1001", queue: "CreditCard_DPD_30" },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAgentId(preset.id);
                        setExtension(preset.ext);
                        setSelectedQueue(preset.queue);
                        setAgentPassword("agent123");
                        setErrorMsg(null);
                      }}
                      className="px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer"
                      style={
                        agentId === preset.id
                          ? { background: "var(--brand-primary-light)", borderColor: "var(--brand-primary)", color: "var(--brand-primary-text)" }
                          : { background: "#fff", borderColor: "var(--border-default)", color: "#334155" }
                      }
                    >
                      <div className="text-xs font-semibold">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{preset.id} — Ext {preset.ext}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Agent ID
                </label>
                <input
                  type="text"
                  required
                  value={agentId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAgentId(val);
                    const clean = val.replace(/\D/g, "");
                    if (clean.length === 4) setExtension(clean);
                  }}
                  placeholder="e.g. AGT-1002 or 1002"
                  className="w-full h-10 px-3 rounded-lg text-sm border outline-none transition-colors"
                  style={{
                    background: "#fff",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showAgentPass ? "text" : "password"}
                    required
                    value={agentPassword}
                    onChange={(e) => setAgentPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-10 px-3 pr-10 rounded-lg text-sm border outline-none transition-colors"
                    style={{
                      background: "#fff",
                      borderColor: "var(--border-default)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAgentPass(!showAgentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showAgentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Extension & Queue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Extension
                  </label>
                  <input
                    type="text"
                    required
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    placeholder="1002"
                    className="w-full h-10 px-3 rounded-lg text-sm font-mono border outline-none transition-colors"
                    style={{
                      background: "#fff",
                      borderColor: "var(--border-default)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Queue
                  </label>
                  <select
                    value={selectedQueue}
                    onChange={(e) => setSelectedQueue(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg text-sm border cursor-pointer outline-none transition-colors"
                    style={{
                      background: "#fff",
                      borderColor: "var(--border-default)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                  >
                    {QUEUES.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  background: "var(--brand-primary)",
                  color: "#fff",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = "var(--brand-primary-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-primary)"; }}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* SUPERVISOR FORM */}
          {activeTab === "supervisor" && (
            <form onSubmit={handleSupervisorSubmit} className="space-y-4">
              {/* Quick select */}
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-2">
                  Demo Profile
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSupervisorId("SUP-2001");
                    setSupervisorPassword("supervisor123");
                    setErrorMsg(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg text-left border transition-colors cursor-pointer"
                  style={{
                    background: supervisorId === "SUP-2001" ? "#f5f3ff" : "#fff",
                    borderColor: supervisorId === "SUP-2001" ? "#7c3aed" : "var(--border-default)",
                    color: supervisorId === "SUP-2001" ? "#5b21b6" : "#334155",
                  }}
                >
                  <div className="text-xs font-semibold">Vikram Malhotra</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    SUP-2001 — Floor Operations (200 Seats)
                  </div>
                </button>
              </div>

              {/* Supervisor ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supervisor ID
                </label>
                <input
                  type="text"
                  required
                  value={supervisorId}
                  onChange={(e) => setSupervisorId(e.target.value)}
                  placeholder="e.g. SUP-2001"
                  className="w-full h-10 px-3 rounded-lg text-sm border outline-none transition-colors"
                  style={{
                    background: "#fff",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSupervisorPass ? "text" : "password"}
                    required
                    value={supervisorPassword}
                    onChange={(e) => setSupervisorPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-10 px-3 pr-10 rounded-lg text-sm border outline-none transition-colors"
                    style={{
                      background: "#fff",
                      borderColor: "var(--border-default)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSupervisorPass(!showSupervisorPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showSupervisorPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  background: "#7c3aed",
                  color: "#fff",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = "#6d28d9"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#7c3aed"; }}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}
        </div>

        {/* Credentials hint */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Demo credentials — Agent: <span className="text-slate-500 font-mono">agent123</span> · Supervisor: <span className="text-slate-500 font-mono">supervisor123</span>
        </p>
      </div>

      {/* Agent Picker Modal */}
      {isAgentPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className="w-full max-w-xl rounded-xl p-5 flex flex-col max-h-[80vh]"
            style={{
              background: "#fff",
              border: "1px solid var(--border-default)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  Select Agent
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  200 agents configured — pick one to auto-fill the login form.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAgentPickerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="my-3 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                placeholder="Search by name, ID, extension, or queue..."
                className="w-full h-9 pl-9 pr-3 rounded-lg text-sm border outline-none transition-colors"
                style={{
                  background: "#fff",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {filteredAgents.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">
                  No agent matches &ldquo;{agentSearch}&rdquo;
                </div>
              ) : (
                filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => handlePickAgent(agent)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs"
                        style={{ background: "var(--brand-primary-light)", color: "var(--brand-primary-text)" }}
                      >
                        {agent.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {agent.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {agent.id} — Ext {agent.extension}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                      {agent.queue}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200 text-right">
              <span className="text-xs text-slate-400">
                Showing {filteredAgents.length} of 200 agents
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
