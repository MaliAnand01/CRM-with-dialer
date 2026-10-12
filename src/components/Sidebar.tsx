"use client";

import React from "react";
import { useDialerStore, DashboardView } from "@/store/dialerStore";
import {
  Headphones,
  LayoutDashboard,
  FolderOpen,
  Disc,
  BarChart2,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ElementType;
}

// Role-specific nav items — agent and supervisor see different menus
const AGENT_NAV: NavItem[] = [
  { id: "agent",      label: "My Calling Desk",  icon: Headphones  },
  { id: "leads",      label: "Leads & Accounts",  icon: FolderOpen  },
  { id: "recordings", label: "My Recordings",     icon: Disc        },
  { id: "analytics",  label: "My Performance",    icon: BarChart2   },
];

const SUPERVISOR_NAV: NavItem[] = [
  { id: "floor",      label: "Floor Overview",    icon: LayoutDashboard },
  { id: "leads",      label: "Leads & Accounts",  icon: FolderOpen      },
  { id: "recordings", label: "Call Recordings",   icon: Disc            },
  { id: "analytics",  label: "Analytics",         icon: BarChart2       },
  { id: "settings",   label: "Campaign Settings", icon: ArrowLeftRight  },
];

export function Sidebar() {
  const { currentRole, setRole, activeView, setActiveView, agentStatus, currentUser, logout } = useDialerStore();

  const navItems = currentRole === "agent" ? AGENT_NAV : SUPERVISOR_NAV;

  function handleNavClick(item: NavItem) {
    setActiveView(item.id);
  }

  function toggleRole() {
    const newRole = currentRole === "agent" ? "supervisor" : "agent";
    setRole(newRole);
    setActiveView(newRole === "supervisor" ? "floor" : "agent");
  }

  const statusDotColor =
    agentStatus === "ON_CALL" ? "#4ade80"
    : agentStatus === "RINGING" ? "#fbbf24"
    : agentStatus === "PAUSED" ? "#f87171"
    : "#60a5fa";

  const statusLabel =
    agentStatus === "ON_CALL" ? "On Call"
    : agentStatus === "RINGING" ? "Ringing..."
    : agentStatus === "PAUSED" ? "On Break"
    : "Ready";

  return (
    <aside
      className="tour-sidebar flex flex-col shrink-0 h-full select-none"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: "var(--header-height)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <img
          src="/diallo-logo.jpg"
          alt="Diallo"
          className="w-8 h-8 rounded-lg object-contain shadow-xs border border-white/10 shrink-0"
        />
        <div className="min-w-0">
          <div className="font-bold text-base leading-none tracking-wide text-white">
            Diallo
          </div>
          <div className="text-[11px] mt-1 font-medium truncate" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
            BPO & Operations CRM
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-1">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={
              currentRole === "agent"
                ? { background: "var(--brand-primary)", color: "#fff" }
                : { background: "#0284c7", color: "#fff" }
            }
          >
            {currentRole === "agent" ? "Agent" : "Supervisor"}
          </span>
          <span className="text-xs truncate text-slate-200">
            {currentUser?.name || (currentRole === "agent" ? "Pooja Verma" : "Vikram Malhotra")}
          </span>
        </div>
      </div>

      {/* Nav section label */}
      <div className="px-4 pt-4 pb-1">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#334155" }}>
          {currentRole === "agent" ? "Agent" : "Supervisor"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                `tour-nav-${item.id}`,
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 cursor-pointer text-left"
              )}
              style={
                isActive
                  ? { background: "var(--bg-sidebar-active)", color: "#fff" }
                  : { color: "#64748b" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-sidebar-hover)";
                  (e.currentTarget as HTMLElement).style.color = "#cbd5e1";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.color = "#64748b";
                }
              }}
            >
              <Icon size={16} strokeWidth={1.75} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Agent status indicator (only for agent role) */}
      {currentRole === "agent" && (
        <div className="px-3 pb-2">
          <div
            className="px-3 py-2.5 rounded-lg flex items-center gap-2.5"
            style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: statusDotColor }}
            />
            <div className="min-w-0">
              <div className="text-xs font-medium" style={{ color: "#e2e8f0" }}>
                {statusLabel}
              </div>
              <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                Ext {currentUser?.extension || "1002"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User footer */}
      <div
        className="px-3 py-3 flex items-center justify-between shrink-0"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex items-center justify-center rounded-full shrink-0 font-semibold text-xs text-white"
            style={{ width: 30, height: 30, background: "#334155" }}
          >
            {currentUser?.avatarInitials || (currentRole === "agent" ? "PV" : "VM")}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>
              {currentUser?.name || (currentRole === "agent" ? "Pooja Verma" : "Vikram Malhotra")}
            </div>
            <div className="text-xs truncate" style={{ color: "#475569" }}>
              {currentUser?.role === "agent"
                ? `Ext ${currentUser.extension || "1002"} • ${currentUser.queue || "PL_Bucket_2"}`
                : "Floor Operations Director"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleRole}
            title={`Switch to ${currentRole === "agent" ? "Supervisor" : "Agent"} view`}
            className="p-1.5 rounded-md cursor-pointer transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1e293b";
              (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "#475569";
            }}
          >
            <ArrowLeftRight size={14} />
          </button>

          <button
            onClick={logout}
            title="Sign out of station"
            className="p-1.5 rounded-md cursor-pointer transition-colors text-slate-400 hover:text-red-400 hover:bg-slate-800"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
