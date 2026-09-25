"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Joyride, STATUS, EVENTS } from "react-joyride";
import { useDialerStore } from "@/store/dialerStore";
import { Compass, Sparkles, X } from "lucide-react";

export function DemoTour() {
  const { isAuthenticated, currentRole, isTourOpen, openTour, closeTour } = useDialerStore();
  const [run, setRun] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasPromptedWelcome, setHasPromptedWelcome] = useState(false);

  // Auto-show welcome modal upon initial login session
  useEffect(() => {
    if (isAuthenticated && !hasPromptedWelcome) {
      setShowWelcome(true);
      setHasPromptedWelcome(true);
    }
  }, [isAuthenticated, hasPromptedWelcome]);

  // Sync external openTour trigger from Header button or store
  useEffect(() => {
    if (isTourOpen) {
      setShowWelcome(false);
      setRun(true);
      setTourKey((prev) => prev + 1);
    }
  }, [isTourOpen]);

  // Steps configuration per role
  const steps = useMemo(() => {
    if (currentRole === "agent") {
      return [
        {
          target: ".tour-sidebar",
          title: "Agent Navigation Menu",
          content: "Welcome to your calling workspace. Navigate seamlessly between your active calling desk, assigned borrower leads, call recordings, and personal performance.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-agent",
          title: "My Calling Desk",
          content: "Your central workspace. Connected calls automatically stream the customer's full loan profile, DPD bucket, and disposition workflow.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-leads",
          title: "Leads & Accounts Directory",
          content: "Quickly lookup borrower loan files, search by phone number or account ID, filter by delinquency bucket, and add new borrower records.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-recordings",
          title: "My Call Recordings",
          content: "Review audio recordings of your past calls to inspect borrower commitments and supervisor QA feedback.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-analytics",
          title: "Personal Performance",
          content: "Track your personal Promise to Pay (PTP) commitments, hourly connect rate, talk time vs idle time, and daily collection goals.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-agent-softphone",
          title: "Integrated WebRTC Softphone",
          content: "Your complete telephony bar. Answer calls, mute, hold, initiate warm transfers, and select break reasons with live call timers.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-agent-customer-360",
          title: "Customer 360 Banking Profile",
          content: "Instant pop-up of the borrower's total outstanding balance, overdue EMI, DPD bucket, loan account number, and prior repayment history.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-agent-disposition",
          title: "Disposition & PTP Workflow",
          content: "Record call outcomes (PTP, Callback, Dispute, RNR), log commitment amounts and dates, and automatically send an instant payment link via WhatsApp.",
          placement: "left",
          skipBeacon: true,
        },
        {
          target: ".tour-agent-simulate",
          title: "Simulate Live Call",
          content: "Click this button anytime during a demo to simulate an incoming borrower call and experience the automatic profile pop-up.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-role-switcher",
          title: "Supervisor / Agent Switcher",
          content: "Switch between Agent and Supervisor views seamlessly to demonstrate full operational oversight.",
          placement: "bottom",
          skipBeacon: true,
        },
      ];
    } else {
      return [
        {
          target: ".tour-sidebar",
          title: "Supervisor Control Center",
          content: "Comprehensive floor management suite. Oversee live caller activity, review QA recordings, monitor recovery analytics, and adjust dialing campaigns.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-floor",
          title: "Live Floor Overview",
          content: "Real-time command center for monitoring all 200 caller seats, floor utilization, and audio supervision.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-leads",
          title: "Leads & Account Ingestion",
          content: "Access central borrower records categorized by DPD buckets, trigger manual single-lead creation, and inspect API sync status.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-recordings",
          title: "Call Audits & Compliance",
          content: "Review 100% of recorded customer conversations, audio waveforms, QA sentiment scores, and regulatory compliance flags.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-analytics",
          title: "Floor Analytics & Recovery Trends",
          content: "Deep dive into recovery rates, hourly collections volume, agent connect performance, and conversion funnels.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-nav-settings",
          title: "Campaign & DLP Settings",
          content: "Configure automated Lead Ingestion webhooks, dial pacing multipliers (1:1 to 3:1), and Data Loss Prevention masking rules.",
          placement: "right",
          skipBeacon: true,
        },
        {
          target: ".tour-role-switcher",
          title: "Role Switching",
          content: "Instantly toggle between Supervisor and Agent views with one click to demonstrate both viewpoints during client walkthroughs.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-agent-simulate",
          title: "Simulate Inbound Call",
          content: "Test live call arrival anytime to demonstrate predictive dialer popups and instant lead matching.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-metrics",
          title: "Floor Health & Real-Time KPIs",
          content: "Real-time floor summary: Today's PTP Recovery (₹18.45 Lakhs), live Connect Rate (68.4%), active seat utilization (138 of 200 callers), and Average Handle Time.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-charts",
          title: "Hourly Volume & Disposition Trends",
          content: "Visual charts tracking dialed vs connected calls hour-by-hour, alongside today's shift dispositions (PTP, Callback, Dispute, RNR).",
          placement: "top",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-leaderboard",
          title: "Agent Shift Leaderboard",
          content: "Live rankings of top floor performers ordered by PTP volume recovered, connect percentage, and quality ratings.",
          placement: "top",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-overview",
          title: "Performance Tab",
          content: "The primary dashboard summarizing floor-wide collection performance and operational throughput.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-wallboard",
          title: "200-Seat Agent Wallboard",
          content: "Switch here to monitor all 200 agents in real-time (On Call, Ringing, Idle, Break), filter by queue, and trigger 1-click Silent Listen, Whisper Coaching, or 3-Way Barge-in.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-recordings",
          title: "Floor Recordings Audit",
          content: "Rapidly inspect and playback live calls right from the floor tab.",
          placement: "bottom",
          skipBeacon: true,
        },
        {
          target: ".tour-supervisor-queues",
          title: "Queue & Campaign Health",
          content: "Live SLA tracking: Average wait time (12s), Abandon rate (2.1%, SLA < 5%), and Service Level (94%).",
          placement: "bottom",
          skipBeacon: true,
        },
      ];
    }
  }, [currentRole]);

  const handleJoyrideCallback = (data: any) => {
    const { status, type } = data;
    const isFinished = status === STATUS.FINISHED || status === STATUS.SKIPPED || type === EVENTS.TOUR_END;
    
    if (isFinished) {
      setRun(false);
      closeTour();
    }
  };

  const handleStartTour = () => {
    setShowWelcome(false);
    setTourKey((prev) => prev + 1);
    setRun(true);
  };

  const handleSkipTour = () => {
    setShowWelcome(false);
    setRun(false);
    closeTour();
  };

  const JoyrideComponent = Joyride as any;

  return (
    <>
      {showWelcome && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[10000] p-4"
          style={{ background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#eff6ff", color: "var(--brand-primary)" }}
                >
                  <Compass size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Welcome to FinTel CRM
                  </h2>
                  <p className="text-xs font-medium" style={{ color: "var(--brand-primary)" }}>
                    {currentRole === "agent" ? "Agent Console Walkthrough" : "Supervisor Operations Floor Walkthrough"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSkipTour}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Take a quick 2-minute interactive tour of the {currentRole === "agent" ? "Agent Cockpit" : "Supervisor Dashboard"}. 
              Discover all key predictive dialer capabilities, lead management, and live QA features.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-6 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span><strong>Role-Specific Views:</strong> Switch between Agent & Supervisor at any time.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span><strong>Live Simulation:</strong> Test incoming calls and audio barge-in on 200 agents.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleSkipTour}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)", background: "#f1f5f9" }}
              >
                Skip for now
              </button>
              <button
                onClick={handleStartTour}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                style={{ background: "var(--brand-primary)" }}
              >
                <Sparkles size={14} />
                Start Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {run && (
        <JoyrideComponent
          key={`tour-${currentRole}-${tourKey}`}
          steps={steps}
          run={run}
          continuous
          scrollToFirstStep
          onEvent={handleJoyrideCallback}
          options={{
            skipBeacon: true,
            primaryColor: "#1d4ed8",
            textColor: "#0f172a",
            backgroundColor: "#ffffff",
            zIndex: 10000,
            showProgress: true,
            buttons: ["back", "close", "primary", "skip"],
          }}
          locale={{
            back: "Back",
            close: "Close",
            last: "Finish Tour",
            next: "Next",
            skip: "Skip Tour",
          }}
          styles={{
            options: {
              primaryColor: "#1d4ed8",
              textColor: "#0f172a",
              backgroundColor: "#ffffff",
              zIndex: 10000,
            },
            tooltip: {
              borderRadius: "14px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              padding: "18px 20px",
              maxWidth: "420px",
            },
            tooltipContainer: {
              textAlign: "left",
              fontSize: "13px",
              lineHeight: "1.55",
            },
            tooltipTitle: {
              fontSize: "15px",
              fontWeight: 600,
              color: "#0f172a",
              marginBottom: "6px",
            },
            tooltipContent: {
              color: "#475569",
              padding: "4px 0 12px 0",
            },
            buttonPrimary: {
              backgroundColor: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "8px",
              color: "#ffffff",
              cursor: "pointer",
            },
            buttonBack: {
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 500,
              marginRight: "10px",
              cursor: "pointer",
            },
            buttonSkip: {
              color: "#94a3b8",
              fontSize: "12px",
              fontWeight: 400,
              cursor: "pointer",
            },
            buttonClose: {
              color: "#94a3b8",
              cursor: "pointer",
            },
          } as any}
        />
      )}
    </>
  );
}
