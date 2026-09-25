"use client";

import React, { useEffect } from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, Phone, ShieldCheck, Users, Headphones, LogOut, CheckCircle2 } from "lucide-react";

export function Navbar() {
  const {
    currentRole,
    setRole,
    agentStatus,
    pauseReason,
    setAgentStatus,
    simulateIncomingCall,
    tick,
  } = useDialerStore();

  // Tick timer every second for realistic live contact center metrics
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-2xs">
      <div className="flex h-13 items-center justify-between px-4 sm:px-6">
        {/* Brand & Telephony Telemetry */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold tracking-tight">
              FD
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-slate-900">
                FinTel Dialer
              </span>
              <span className="ml-2 text-2xs text-slate-500 font-mono hidden md:inline">
                v2.4-enterprise
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 border-l border-slate-200 pl-4 text-xs text-slate-500">
            <span className="inline-flex items-center text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5" />
              SIP Gateway: Active
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5" />
              AMI Bridge: 200/200 Synced
            </span>
          </div>
        </div>

        {/* Center: Quick Pitch Simulation Trigger */}
        <div className="flex items-center space-x-2">
          {currentRole === "agent" && (
            <Button
              variant="outline"
              size="xs"
              onClick={simulateIncomingCall}
              className="text-xs font-medium border-slate-300 hover:bg-slate-100"
              title="Test screen-pop and softphone connect for presentation demo"
            >
              <PhoneCall className="mr-1.5 h-3.5 w-3.5 text-slate-700" />
              Simulate Inbound Call
            </Button>
          )}

          {/* Role Switcher */}
          <div className="inline-flex items-center rounded border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setRole("agent")}
              className={`flex items-center rounded px-3 py-1 text-xs font-medium transition-colors ${
                currentRole === "agent"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Headphones className="mr-1.5 h-3.5 w-3.5" />
              Agent Workspace
            </button>
            <button
              onClick={() => setRole("supervisor")}
              className={`flex items-center rounded px-3 py-1 text-xs font-medium transition-colors ${
                currentRole === "supervisor"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Supervisor Floor (200 Seats)
            </button>
          </div>
        </div>

        {/* Right: User identity & Status */}
        <div className="flex items-center space-x-3 text-xs">
          {currentRole === "agent" ? (
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 hidden sm:inline">Agent Ext: 1042 (Amit V.)</span>
              <select
                value={agentStatus === "PAUSED" ? `PAUSED_${pauseReason}` : agentStatus}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith("PAUSED_")) {
                    const reason = val.replace("PAUSED_", "") as any;
                    setAgentStatus("PAUSED", reason);
                  } else {
                    setAgentStatus(val as any);
                  }
                }}
                className="h-7 text-xs border border-slate-300 rounded bg-white px-2 py-0.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="IDLE">Ready (Waiting)</option>
                <option value="ON_CALL">On Call</option>
                <option value="PAUSED_LUNCH">Pause: Lunch</option>
                <option value="PAUSED_TEA">Pause: Tea Break</option>
                <option value="PAUSED_TRAINING">Pause: Training</option>
                <option value="PAUSED_WRAP_UP">Pause: Wrap-Up</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                Supervisor Privileges
              </span>
              <span className="text-slate-600 hidden sm:inline">Floor Manager (OpCenter 1)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
