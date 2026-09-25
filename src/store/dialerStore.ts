import { create } from "zustand";

export type AgentStatus = "IDLE" | "RINGING" | "ON_CALL" | "PAUSED" | "MANUAL_DIAL";
export type PauseReason = "LUNCH" | "TEA" | "TRAINING" | "WRAP_UP" | null;
export type SupervisionMode = "LISTEN" | "WHISPER" | "BARGE" | null;

export interface PastInteraction {
  id: string;
  date: string;
  agent: string;
  disposition: string;
  ptpDate?: string;
  ptpAmount?: number;
  notes: string;
}

export interface BankingCustomer {
  id: string;
  loanAccountNo: string;
  customerName: string;
  maskedPhone: string;
  dpdBucket: "Bucket 0 (Current)" | "Bucket 1 (1-30 DPD)" | "Bucket 2 (31-60 DPD)" | "Bucket 3 (61-90 DPD)" | "Bucket 4+ (90+ DPD)";
  totalOutstanding: number;
  overdueEmi: number;
  emiDueDate: string;
  tenureRemaining: string;
  productType: string;
  mandateStatus: string;
  employer: string;
  assignedQueue: string;
  pastInteractions: PastInteraction[];
}

export interface CallRecording {
  id: string;
  leadId: string;
  customerName: string;
  maskedPhone: string;
  agentName: string;
  agentExt: string;
  disposition: string;
  ptpAmount?: number;
  duration: string;
  date: string;
  notes?: string;
  dispositionType: "ptp" | "refused" | "callback" | "dispute";
}

export const INITIAL_RECORDINGS: CallRecording[] = [
  { id: "REC-0925-1042", leadId: "BLR-PL-94812", customerName: "Rameshwar K. Sharma", maskedPhone: "+91 98765 XXXXX", agentName: "Amit Verma",    agentExt: "1042", disposition: "Promise to Pay (PTP)", ptpAmount: 14250, duration: "03:42", date: "Today, 11:28 AM", dispositionType: "ptp", notes: "Customer cited salary delayed by HR. Committed to clear overdue amount on 22nd morning." },
  { id: "REC-0925-1018", leadId: "MUM-CC-83109", customerName: "Sunil S. Deshmukh",   maskedPhone: "+91 98201 XXXXX", agentName: "Priya Nair",     agentExt: "1018", disposition: "Refused to Pay",       duration: "02:18", date: "Today, 11:15 AM", dispositionType: "refused", notes: "Disputed penalty fees charged on statement." },
  { id: "REC-0925-1089", leadId: "DEL-AL-72910", customerName: "Harish C. Gupta",     maskedPhone: "+91 99112 XXXXX", agentName: "Rahul Sharma",    agentExt: "1089", disposition: "Call Back",             duration: "01:05", date: "Today, 10:52 AM", dispositionType: "callback", notes: "Driving on highway. Requested call back in evening." },
  { id: "REC-0925-1033", leadId: "BLR-PL-10928", customerName: "Vikram Malhotra",     maskedPhone: "+91 97410 XXXXX", agentName: "Sneha Patel",     agentExt: "1033", disposition: "Promise to Pay (PTP)", ptpAmount: 22000, duration: "04:12", date: "Today, 10:30 AM", dispositionType: "ptp", notes: "Customer agreed to pay via NetBanking link." },
  { id: "REC-0925-1102", leadId: "HYD-CC-91823", customerName: "K. Venkatesh Rao",   maskedPhone: "+91 98490 XXXXX", agentName: "Karan Mehta",     agentExt: "1102", disposition: "Dispute",               duration: "05:40", date: "Today, 09:48 AM", dispositionType: "dispute", notes: "Transaction fraud claim registered with bank." },
];

export interface FloorAgent {
  id: string;
  name: string;
  extension: string;
  campaign: string;
  queue: string;
  status: AgentStatus;
  pauseReason: PauseReason;
  callDuration: number; // in seconds
  currentCustomer?: string;
  dpdBucket?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: "agent" | "supervisor";
  extension?: string;
  campaign?: string;
  queue?: string;
  department?: string;
  avatarInitials: string;
  loginTime: string;
}

export interface SupervisorAccount {
  id: string;
  name: string;
  email: string;
  role: "supervisor";
  department: string;
  passwordHint: string;
}

export const SUPERVISOR_ACCOUNTS: SupervisorAccount[] = [
  {
    id: "SUP-2001",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@fintel.internal",
    role: "supervisor",
    department: "Operations Floor Director (200 Seats)",
    passwordHint: "supervisor123",
  },
  {
    id: "SUP-2002",
    name: "Pooja Mehta",
    email: "pooja.mehta@fintel.internal",
    role: "supervisor",
    department: "Collections QA & Floor Supervisor",
    passwordHint: "supervisor123",
  },
];

export type DashboardView = "agent" | "floor" | "recordings" | "leads" | "analytics" | "settings";

interface DialerState {
  // Authentication & Station State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loginAgent: (agentIdOrExt: string, password: string, queue?: string) => { success: boolean; error?: string };
  loginSupervisor: (supervisorId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  restoreSession: () => void;

  currentRole: "agent" | "supervisor";
  setRole: (role: "agent" | "supervisor") => void;
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;

  // Agent State
  agentStatus: AgentStatus;
  pauseReason: PauseReason;
  callDuration: number;
  isMuted: boolean;
  isOnHold: boolean;
  isDialpadOpen: boolean;
  activeLead: BankingCustomer | null;

  // Disposition
  dispositionStatus: string;
  ptpAmount: string;
  ptpDate: string;
  remarks: string;
  sendWhatsAppNotice: boolean;
  dispositionSubmitted: boolean;
  dispositionToast: string | null;

  // Supervisor State
  agentsList: FloorAgent[];
  activeSupervisionMode: SupervisionMode;
  monitoredAgentId: string | null;
  supervisorSearchQuery: string;
  supervisorQueueFilter: string;
  supervisorStatusFilter: string;

  // Actions - Agent
  simulateIncomingCall: () => void;
  acceptCall: () => void;
  hangupCall: () => void;
  setAgentStatus: (status: AgentStatus, reason?: PauseReason) => void;
  toggleMute: () => void;
  toggleHold: () => void;
  toggleDialpad: () => void;
  setDispositionField: (key: string, value: any) => void;
  submitDisposition: () => void;
  clearToast: () => void;

  // Call Recordings Spool
  callRecordings: CallRecording[];
  addCallRecording: (recording: CallRecording) => void;

  // Lead Profile Viewer
  viewingLeadProfile: BankingCustomer | null;
  openLeadProfile: (lead: BankingCustomer) => void;
  closeLeadProfile: () => void;

  // Actions - Supervisor
  setSupervisionMode: (agentId: string, mode: SupervisionMode) => void;
  stopSupervision: () => void;
  setSupervisorSearch: (query: string) => void;
  setSupervisorQueueFilter: (queue: string) => void;
  setSupervisorStatusFilter: (status: string) => void;
  remoteForcePause: (agentId: string, reason: PauseReason) => void;
  remoteForceLogout: (agentId: string) => void;
  remoteReassignQueue: (agentId: string, newQueue: string) => void;

  // Tick simulation
  tick: () => void;

  // Guided Tour
  isTourOpen: boolean;
  tourTrigger: number;
  openTour: () => void;
  closeTour: () => void;
}

const mockDefaultLead: BankingCustomer = {
  id: "LEAD-78921",
  loanAccountNo: "BLR-PL-94812",
  customerName: "Rameshwar K. Sharma",
  maskedPhone: "+91 98765 XXXXX",
  dpdBucket: "Bucket 2 (31-60 DPD)",
  totalOutstanding: 184500,
  overdueEmi: 14250,
  emiDueDate: "10-Sep-2026",
  tenureRemaining: "18 of 36 Months",
  productType: "Personal Loan (Unsecured)",
  mandateStatus: "Bounced (Insufficient Funds)",
  employer: "Infosys Technologies Ltd, Bengaluru",
  assignedQueue: "Collections_Tier_2",
  pastInteractions: [
    {
      id: "INT-1",
      date: "18-Sep-2026 11:30 AM",
      agent: "Amit Verma (Ext 1024)",
      disposition: "PTP (Promise to Pay)",
      ptpDate: "22-Sep-2026",
      ptpAmount: 14250,
      notes: "Customer cited salary delayed by HR. Committed to clear overdue amount on 22nd morning.",
    },
    {
      id: "INT-2",
      date: "14-Sep-2026 04:15 PM",
      agent: "Priya Nair (Ext 1018)",
      disposition: "Call Back",
      notes: "Customer driving on highway. Requested call back after 6 PM.",
    },
    {
      id: "INT-3",
      date: "10-Sep-2026 10:05 AM",
      agent: "Automated IVR",
      disposition: "Ringing / Unanswered",
      notes: "System predictive dial attempt. No agent bridge established.",
    },
  ],
};

export function generate200Agents(): FloorAgent[] {
  const firstNames = [
    "Rahul", "Pooja", "Vikram", "Sneha", "Karan", "Ananya", "Rohan", "Deepa",
    "Manish", "Sunita", "Arjun", "Kavita", "Sanjay", "Meera", "Abhishek", "Shweta",
    "Aditya", "Neha", "Vivek", "Tanvi", "Gaurav", "Nisha", "Harsh", "Divya",
    "Rajesh", "Jyoti", "Naveen", "Swati", "Suresh", "Ritu", "Alok", "Preeti"
  ];
  const lastNames = [
    "Sharma", "Verma", "Gupta", "Patel", "Mehta", "Reddy", "Iyer", "Nair",
    "Singh", "Chauhan", "Joshi", "Bhatia", "Saxena", "Malhotra", "Kulkarni", "Das"
  ];
  const queues = [
    "PL_Bucket_2",
    "CreditCard_DPD_30",
    "AutoLoan_Delinquency",
    "PL_Bucket_1",
    "NPA_PreRecovery"
  ];
  const campaigns = [
    "H1_Retail_Loans_Recovery",
    "Card_Collections_West",
    "Auto_Secured_Outreach"
  ];

  const agents: FloorAgent[] = [];

  for (let i = 1; i <= 200; i++) {
    const ext = 1000 + i;
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const queue = queues[i % queues.length];
    const campaign = campaigns[i % campaigns.length];

    // Distribute states deterministically for SSR hydration safety: ~70% on call, 15% idle, 10% paused, 5% ringing
    let status: AgentStatus = "ON_CALL";
    let pauseReason: PauseReason = null;
    let callDuration = ((i * 37) % 320) + 15;
    let customerName = undefined;
    let dpdBucket = undefined;

    const mod = i % 20;
    if (mod < 14) {
      status = "ON_CALL";
      customerName = `${firstNames[(i * 3) % firstNames.length]} ${lastNames[(i * 2) % lastNames.length]}`;
      dpdBucket = `Bucket ${(i % 3) + 1}`;
    } else if (mod < 17) {
      status = "IDLE";
      callDuration = ((i * 13) % 45) + 5;
    } else if (mod < 19) {
      status = "PAUSED";
      pauseReason = i % 2 === 0 ? "LUNCH" : "TEA";
      callDuration = ((i * 47) % 600) + 60;
    } else {
      status = "RINGING";
      callDuration = ((i * 7) % 15) + 2;
      customerName = `${firstNames[(i * 5) % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
      dpdBucket = "Bucket 1";
    }

    agents.push({
      id: `AGT-${ext}`,
      name,
      extension: `${ext}`,
      campaign,
      queue,
      status,
      pauseReason,
      callDuration,
      currentCustomer: customerName,
      dpdBucket,
    });
  }

  return agents;
}

export const ALL_200_AGENTS: FloorAgent[] = generate200Agents();

export const useDialerStore = create<DialerState>((set, get) => ({
  // Authentication state
  currentUser: null,
  isAuthenticated: false,

  // Guided Tour
  isTourOpen: false,
  tourTrigger: 0,
  openTour: () => set((s) => ({ isTourOpen: true, tourTrigger: s.tourTrigger + 1 })),
  closeTour: () => set({ isTourOpen: false }),

  // Call Recordings Spool
  callRecordings: INITIAL_RECORDINGS,
  addCallRecording: (recording) => set((s) => ({ callRecordings: [recording, ...s.callRecordings] })),

  restoreSession: () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("fintel_dialer_auth_session");
      if (saved) {
        const user: AuthUser = JSON.parse(saved);
        set({
          currentUser: user,
          isAuthenticated: true,
          currentRole: user.role,
          activeView: user.role === "supervisor" ? "floor" : "agent",
        });
      }
    } catch {}
  },

  loginAgent: (agentIdOrExt, password, queue) => {
    const trimmed = agentIdOrExt.trim().toUpperCase();
    const cleanExt = trimmed.replace(/^AGT-/, "").trim();

    const agent = get().agentsList.find(
      (a) => a.id.toUpperCase() === trimmed || a.extension === cleanExt || a.id === `AGT-${cleanExt}`
    );

    if (!agent) {
      return {
        success: false,
        error: `Agent ID / Extension "${agentIdOrExt}" not found in PBX cluster. Valid range: AGT-1001 to AGT-1200 (Ext 1001 - 1200).`,
      };
    }

    if (!password || password.trim().length < 3) {
      return {
        success: false,
        error: "Password required. Default demo station password is 'agent123'.",
      };
    }

    const assignedQueue = queue || agent.queue;
    const user: AuthUser = {
      id: agent.id,
      name: agent.name,
      role: "agent",
      extension: agent.extension,
      campaign: agent.campaign,
      queue: assignedQueue,
      avatarInitials: agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2),
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fintel_dialer_auth_session", JSON.stringify(user));
      } catch {}
    }

    set((state) => ({
      currentUser: user,
      isAuthenticated: true,
      currentRole: "agent",
      activeView: "agent",
      agentStatus: "IDLE",
      pauseReason: null,
      callDuration: 0,
      agentsList: state.agentsList.map((a) =>
        a.id === agent.id ? { ...a, status: "IDLE", pauseReason: null, queue: assignedQueue } : a
      ),
    }));

    return { success: true };
  },

  loginSupervisor: (supervisorId, password) => {
    const trimmed = supervisorId.trim().toUpperCase();
    const matched = SUPERVISOR_ACCOUNTS.find(
      (s) => s.id.toUpperCase() === trimmed || s.email.toUpperCase() === trimmed || trimmed === "SUPERVISOR" || trimmed === "ADMIN"
    );

    if (!matched && trimmed !== "SUPERVISOR" && trimmed !== "ADMIN") {
      return {
        success: false,
        error: "Supervisor ID not recognized. Use demo ID 'SUP-2001' or 'supervisor'.",
      };
    }

    if (!password || password.trim().length < 3) {
      return {
        success: false,
        error: "Password required. Default demo password is 'supervisor123'.",
      };
    }

    const sup = matched || SUPERVISOR_ACCOUNTS[0];
    const user: AuthUser = {
      id: sup.id,
      name: sup.name,
      role: "supervisor",
      department: sup.department,
      avatarInitials: sup.name.split(" ").map((n) => n[0]).join("").slice(0, 2),
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fintel_dialer_auth_session", JSON.stringify(user));
      } catch {}
    }

    set({
      currentUser: user,
      isAuthenticated: true,
      currentRole: "supervisor",
      activeView: "floor",
    });

    return { success: true };
  },

  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("fintel_dialer_auth_session");
      } catch {}
    }
    set({
      currentUser: null,
      isAuthenticated: false,
      activeSupervisionMode: null,
      monitoredAgentId: null,
    });
  },

  currentRole: "agent",
  setRole: (role) => {
    const current = get().currentUser;
    let updatedUser: AuthUser | null = null;
    if (current) {
      updatedUser = {
        ...current,
        role,
        name:
          role === "supervisor"
            ? (current.name.includes("Verma") || current.name.includes("Pooja") ? "Pooja Mehta" : "Vikram Malhotra")
            : (current.name.includes("Mehta") || current.name.includes("Pooja") ? "Pooja Verma" : "Vikram Gupta"),
        department:
          role === "supervisor"
            ? "Operations Floor Director (200 Seats)"
            : "Collections Agent (Station 1002)",
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("fintel_dialer_auth_session", JSON.stringify(updatedUser));
        } catch {}
      }
    }
    set({
      currentRole: role,
      currentUser: updatedUser ?? current,
      activeView: role === "supervisor" ? "floor" : "agent",
    });
  },
  activeView: "agent",
  setActiveView: (view) => set({ activeView: view }),

  // Agent State
  agentStatus: "ON_CALL",
  pauseReason: null,
  callDuration: 142,
  isMuted: false,
  isOnHold: false,
  isDialpadOpen: false,
  activeLead: mockDefaultLead,

  // Disposition
  dispositionStatus: "PTP",
  ptpAmount: "14250",
  ptpDate: "2026-09-28",
  remarks: "Customer acknowledged overdue EMI. Confirmed payment scheduled for next Monday via NetBanking/UPI.",
  sendWhatsAppNotice: true,
  dispositionSubmitted: false,
  dispositionToast: null,

  // Lead Profile Viewer
  viewingLeadProfile: null,
  openLeadProfile: (lead) => set({ viewingLeadProfile: lead }),
  closeLeadProfile: () => set({ viewingLeadProfile: null }),

  // Supervisor State
  agentsList: generate200Agents(),
  activeSupervisionMode: null,
  monitoredAgentId: null,
  supervisorSearchQuery: "",
  supervisorQueueFilter: "ALL",
  supervisorStatusFilter: "ALL",

  // Agent Actions
  simulateIncomingCall: () => {
    set({
      agentStatus: "RINGING",
      callDuration: 0,
      activeLead: mockDefaultLead,
      dispositionSubmitted: false,
      dispositionToast: null,
    });
  },

  acceptCall: () => {
    set({
      agentStatus: "ON_CALL",
      callDuration: 1,
    });
  },

  hangupCall: () => {
    set({
      agentStatus: "PAUSED",
      pauseReason: "WRAP_UP",
      callDuration: 0,
    });
  },

  setAgentStatus: (status, reason = null) => {
    set({
      agentStatus: status,
      pauseReason: status === "PAUSED" ? reason : null,
      callDuration: 0,
      activeLead: status === "IDLE" ? null : get().activeLead,
    });
  },

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleHold: () => set((state) => ({ isOnHold: !state.isOnHold })),
  toggleDialpad: () => set((state) => ({ isDialpadOpen: !state.isDialpadOpen })),

  setDispositionField: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
  },

  submitDisposition: () => {
    const {
      dispositionStatus,
      ptpAmount,
      ptpDate,
      activeLead,
      sendWhatsAppNotice,
      callDuration,
      currentUser,
      currentRole,
      callRecordings,
      remarks,
    } = get();

    const lead = activeLead || mockDefaultLead;
    const agentName = currentUser?.name || (currentRole === "agent" ? "Vikram Gupta" : "Vikram Malhotra");
    const agentExt = currentUser?.id?.replace("AGT-", "").replace("SUP-", "") || "1002";

    const durSec = callDuration || 142;
    const durStr = `${Math.floor(durSec / 60).toString().padStart(2, "0")}:${(durSec % 60).toString().padStart(2, "0")}`;

    const dispMap: Record<string, { label: string; type: "ptp" | "refused" | "callback" | "dispute" }> = {
      PTP: { label: "Promise to Pay (PTP)", type: "ptp" },
      PAID: { label: "Customer Paid", type: "ptp" },
      CALL_BACK: { label: "Call Back", type: "callback" },
      DISPUTE: { label: "Dispute", type: "dispute" },
      RTP: { label: "Refused to Pay", type: "refused" },
      WRONG_NUMBER: { label: "Wrong Number", type: "refused" },
      RINGING_NO_ANSWER: { label: "No Answer", type: "callback" },
    };

    const dispInfo = dispMap[dispositionStatus] || { label: dispositionStatus, type: "callback" };
    const numPtp = ptpAmount ? Number(ptpAmount) : (dispositionStatus === "PTP" ? 14250 : undefined);
    const resolvedDate = ptpDate || (dispositionStatus === "PTP" ? "2026-09-28" : undefined);
    const resolvedNotes =
      remarks ||
      (dispositionStatus === "PTP"
        ? `Customer committed ₹${numPtp?.toLocaleString("en-IN") || "14,250"} by ${resolvedDate}. Automated payment link sent via WhatsApp.`
        : `Call completed. Outcome recorded as ${dispInfo.label}.`);

    const newInteraction: PastInteraction = {
      id: `INT-${Date.now()}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      agent: `${agentName} (Ext ${agentExt})`,
      disposition: dispInfo.label,
      ptpAmount: numPtp,
      ptpDate: resolvedDate,
      notes: resolvedNotes,
    };

    const newRecording: CallRecording = {
      id: `REC-${new Date().toISOString().slice(5, 10).replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId: lead.loanAccountNo,
      customerName: lead.customerName,
      maskedPhone: lead.maskedPhone,
      agentName,
      agentExt,
      disposition: dispInfo.label,
      ptpAmount: numPtp,
      duration: durStr,
      date: "Just now",
      notes: resolvedNotes,
      dispositionType: dispInfo.type,
    };

    const updatedLead: BankingCustomer = {
      ...lead,
      pastInteractions: [newInteraction, ...lead.pastInteractions],
    };

    const message = sendWhatsAppNotice
      ? `Call saved. PTP committed ₹${numPtp?.toLocaleString("en-IN") || "14,250"}. WhatsApp payment link sent to ${lead.customerName}.`
      : `Call saved. Outcome [${dispInfo.label}] logged to CRM audit trail & recordings.`;

    set({
      dispositionSubmitted: true,
      dispositionToast: message,
      agentStatus: "IDLE",
      pauseReason: null,
      callDuration: 0,
      activeLead: updatedLead,
      callRecordings: [newRecording, ...callRecordings],
    });
  },

  clearToast: () => set({ dispositionToast: null }),

  // Supervisor Actions
  setSupervisionMode: (agentId, mode) => {
    set({
      monitoredAgentId: agentId,
      activeSupervisionMode: mode,
    });
  },

  stopSupervision: () => {
    set({
      monitoredAgentId: null,
      activeSupervisionMode: null,
    });
  },

  setSupervisorSearch: (query) => set({ supervisorSearchQuery: query }),
  setSupervisorQueueFilter: (queue) => set({ supervisorQueueFilter: queue }),
  setSupervisorStatusFilter: (status) => set({ supervisorStatusFilter: status }),

  remoteForcePause: (agentId, reason) => {
    set((state) => ({
      agentsList: state.agentsList.map((agent) =>
        agent.id === agentId
          ? { ...agent, status: "PAUSED", pauseReason: reason, callDuration: 0 }
          : agent
      ),
    }));
  },

  remoteForceLogout: (agentId) => {
    set((state) => ({
      agentsList: state.agentsList.map((agent) =>
        agent.id === agentId
          ? { ...agent, status: "PAUSED", pauseReason: "WRAP_UP", callDuration: 0 }
          : agent
      ),
    }));
  },

  remoteReassignQueue: (agentId, newQueue) => {
    set((state) => ({
      agentsList: state.agentsList.map((agent) =>
        agent.id === agentId ? { ...agent, queue: newQueue } : agent
      ),
    }));
  },

  // Simulating realistic contact center ticks
  tick: () => {
    set((state) => {
      // 1. Tick current agent call duration
      let nextAgentDuration = state.callDuration;
      if (state.agentStatus === "ON_CALL" || state.agentStatus === "RINGING" || state.agentStatus === "PAUSED") {
        nextAgentDuration = state.callDuration + 1;
      }

      // 2. Tick supervisor agents list
      const updatedAgents = state.agentsList.map((agent) => {
        let dur = agent.callDuration + 1;
        // Occasionally cycle state if duration is long to simulate live turnover
        if (agent.status === "RINGING" && dur > 18) {
          return {
            ...agent,
            status: "ON_CALL" as AgentStatus,
            callDuration: 1,
            currentCustomer: agent.currentCustomer || "Rameshwar Sharma",
            dpdBucket: "Bucket 2",
          };
        }
        return {
          ...agent,
          callDuration: dur,
        };
      });

      return {
        callDuration: nextAgentDuration,
        agentsList: updatedAgents,
      };
    });
  },
}));
