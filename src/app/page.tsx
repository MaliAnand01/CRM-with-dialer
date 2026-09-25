"use client";

import React, { useEffect } from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AgentSoftphoneBar } from "@/components/agent/AgentSoftphoneBar";
import { Customer360Card } from "@/components/agent/Customer360Card";
import { DispositionPanel } from "@/components/agent/DispositionPanel";
import { SupervisorFloorTabs } from "@/components/supervisor/SupervisorFloorTabs";
import { CallRecordingsTab } from "@/components/supervisor/CallRecordingsTab";
import { CustomerLeadsDirectory } from "@/components/leads/CustomerLeadsDirectory";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { LoginPage } from "@/components/auth/LoginPage";
import { DemoTour } from "@/components/DemoTour";
import { SettingsTab } from "@/components/supervisor/SettingsTab";

export default function Home() {
  const { activeView, tick, isAuthenticated, restoreSession } = useDialerStore();

  // Restore authenticated session from localStorage if present
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Tick the store every second for live simulation (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick, isAuthenticated]);

  // Show login portal if user is not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--bg-app)" }}>
      <DemoTour />
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {/* AGENT DESK */}
          {activeView === "agent" && (
            <div className="flex flex-col h-full">
              <AgentSoftphoneBar />
              <div className="flex-1 p-6">
                <div className="max-w-7xl mx-auto h-full">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    <div className="xl:col-span-2">
                      <Customer360Card />
                    </div>
                    <div className="xl:col-span-1">
                      <DispositionPanel />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUPERVISOR FLOOR */}
          {activeView === "floor" && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <SupervisorFloorTabs />
              </div>
            </div>
          )}

          {/* LEADS */}
          {activeView === "leads" && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <CustomerLeadsDirectory />
              </div>
            </div>
          )}

          {/* RECORDINGS */}
          {activeView === "recordings" && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="mb-5">
                  <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    Call Recordings
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    Playback recorded calls, review audio quality, and export audit files.
                  </p>
                </div>
                <CallRecordingsTab />
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeView === "analytics" && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <AnalyticsDashboard />
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeView === "settings" && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <SettingsTab />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
