"use client";

import React, { useEffect, useState } from "react";
import { Joyride, Step, STATUS } from "react-joyride";
import { useDialerStore } from "@/store/dialerStore";

export function DemoTour() {
  const { isAuthenticated, currentRole } = useDialerStore();
  const [run, setRun] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasSeenWelcome) {
      setShowWelcome(true);
      setHasSeenWelcome(true);
      
      if (currentRole === "agent") {
        setSteps([
          {
            target: ".tour-sidebar",
            content: "The main navigation. Let's look at the tabs available to you.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-agent",
            content: "Your calling desk. This is where you handle live calls.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-leads",
            content: "Leads & Accounts. Search and view all assigned customer files.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-recordings",
            content: "Access your call recordings for QA and review.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-analytics",
            content: "Track your personal PTPs, Connect Rate, and Quality Scores.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-agent-softphone",
            content: "This is the integrated softphone. It automatically pops up the customer profile when a call connects.",
            placement: "bottom",
            disableBeacon: true,
          },
          {
            target: ".tour-agent-customer-360",
            content: "The Customer 360 view shows all banking details (overdue amount, DPD bucket) in one place.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-agent-disposition",
            content: "After the call, capture the Promise to Pay (PTP) amount, date, and trigger an automated WhatsApp link.",
            placement: "left",
            disableBeacon: true,
          },
          {
            target: ".tour-role-switcher",
            content: "Switch between Agent and Supervisor views to see different capabilities.",
            placement: "bottom",
            disableBeacon: true,
          }
        ]);
      } else {
        setSteps([
          {
            target: ".tour-sidebar",
            content: "Supervisor sidebar navigation.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-floor",
            content: "Floor Management. See real-time metrics and agent statuses.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-analytics",
            content: "Floor Analytics. Monitor overall PTP recovery and agent leaderboards.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-nav-settings",
            content: "Campaign Settings. Configure Lead Ingestion APIs and DLP security policies.",
            placement: "right",
            disableBeacon: true,
          },
          {
            target: ".tour-supervisor-metrics",
            content: "Live metrics track the floor's overall PTP recovery, connect rate, and utilization.",
            placement: "bottom",
            disableBeacon: true,
          },
          {
            target: ".tour-supervisor-wallboard",
            content: "Switch to the Wallboard tab to see all 200 agents in real-time.",
            placement: "bottom",
            disableBeacon: true,
          },
          {
            target: ".tour-role-switcher",
            content: "Switch back to the Agent view to see the calling interface.",
            placement: "bottom",
            disableBeacon: true,
          }
        ]);
      }
    }
  }, [isAuthenticated, currentRole, hasSeenWelcome]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  const startTour = () => {
    setShowWelcome(false);
    setRun(true);
  };

  const skipTour = () => {
    setShowWelcome(false);
    setRun(false);
  };

  const JoyrideComponent = Joyride as any;

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000]" style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Welcome to the CRM!</h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Would you like a quick guided tour of the {currentRole === "agent" ? "Agent Console" : "Supervisor Dashboard"}? It highlights all the key predictive dialer features and standard modern UI patterns.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={skipTour}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "var(--text-secondary)", background: "#f1f5f9" }}
              >
                Skip for now
              </button>
              <button
                onClick={startTour}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ background: "var(--brand-primary)" }}
              >
                Start Tour
              </button>
            </div>
          </div>
        </div>
      )}

      <JoyrideComponent
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "#1d4ed8",
            textColor: "#0f172a",
            backgroundColor: "#ffffff",
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: "left"
          },
          buttonNext: {
            backgroundColor: "#1d4ed8",
            fontSize: "12px",
            padding: "8px 12px",
            borderRadius: "6px",
          },
          buttonBack: {
            color: "#64748b",
            fontSize: "12px",
          },
          buttonSkip: {
            color: "#64748b",
            fontSize: "12px",
          }
        } as any}
      />
    </>
  );
}
