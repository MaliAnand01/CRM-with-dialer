"use client";

import React from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Search, PhoneCall, Bell, LogOut } from "lucide-react";

export function Header() {
  const { currentRole, setRole, activeView, setActiveView, simulateIncomingCall, currentUser, logout } =
    useDialerStore();

  const pageTitle: Record<string, string> = {
    agent: "Agent Desk",
    floor: "Supervisor Floor",
    leads: "Leads & Accounts",
    recordings: "Call Recordings",
    analytics: "Analytics",
  };

  return (
    <header
      className="flex items-center justify-between px-6 shrink-0 gap-4"
      style={{
        height: "var(--header-height)",
        background: "var(--bg-header)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      {/* Page title */}
      <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
        {pageTitle[activeView] ?? "Dashboard"}
      </h1>

      {/* Center — search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search borrower, loan ID, phone..."
            className="w-full h-9 pl-9 pr-3 rounded-lg text-sm border outline-none transition-colors"
            style={{
              background: "var(--bg-app)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* View toggle */}
        <div
          className="tour-role-switcher flex items-center rounded-lg p-0.5 gap-0.5"
          style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)" }}
        >
          <button
            onClick={() => { setRole("agent"); setActiveView("agent"); }}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
            style={
              currentRole === "agent"
                ? { background: "#fff", color: "var(--text-primary)", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }
                : { color: "var(--text-secondary)" }
            }
          >
            Agent View
          </button>
          <button
            onClick={() => { setRole("supervisor"); setActiveView("floor"); }}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
            style={
              currentRole === "supervisor"
                ? { background: "#fff", color: "var(--text-primary)", boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }
                : { color: "var(--text-secondary)" }
            }
          >
            Supervisor View
          </button>
        </div>

        {/* Simulate call button */}
        <button
          onClick={() => { setActiveView("agent"); setRole("agent"); simulateIncomingCall(); }}
          className="tour-agent-simulate flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          style={{
            background: "var(--brand-primary)",
            color: "#fff",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--brand-primary)")}
        >
          <PhoneCall size={13} />
          Simulate Call
        </button>

        {/* Bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-app)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
        </button>

        {/* User profile & Sign Out */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {currentUser.name}
              </div>
              <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                {currentUser.role === "agent"
                  ? `Ext ${currentUser.extension} • ${currentUser.queue}`
                  : "Floor Director (200 Seats)"}
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out of Station"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
