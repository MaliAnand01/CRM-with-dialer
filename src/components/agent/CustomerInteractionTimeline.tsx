"use client";

import React from "react";
import { useDialerStore } from "@/store/dialerStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, PhoneIncoming, CheckCircle } from "lucide-react";

export function CustomerInteractionTimeline() {
  const { activeLead } = useDialerStore();

  if (!activeLead) return null;

  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="py-2.5 px-4 bg-slate-50/70 border-b border-slate-200 flex flex-row items-center justify-between">
        <CardTitle className="text-xs uppercase tracking-wider text-slate-700 font-semibold">
          Interaction & Collections History
        </CardTitle>
        <span className="text-2xs text-slate-500 font-mono">
          {activeLead.pastInteractions.length} Past Records
        </span>
      </CardHeader>

      <CardContent className="p-4 space-y-3 overflow-y-auto max-h-75">
        {activeLead.pastInteractions.map((item, idx) => (
          <div
            key={item.id}
            className="relative border-l-2 border-slate-200 pl-3.5 pb-2"
          >
            {/* Timeline bullet */}
            <div className="absolute -left-1.25 top-1.5 h-2 w-2 rounded-full bg-slate-400" />

            <div className="flex items-center justify-between">
              <span className="text-2xs font-semibold text-slate-600 font-mono">
                {item.date}
              </span>
              <Badge variant="outline" className="text-2xs py-0">
                {item.disposition}
              </Badge>
            </div>

            <div className="text-xs font-medium text-slate-800 mt-1">
              Handled by: <span className="text-slate-600">{item.agent}</span>
            </div>

            {item.ptpAmount && (
              <div className="text-2xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5 mt-1 inline-block">
                PTP Commitment: ₹{item.ptpAmount.toLocaleString("en-IN")} on {item.ptpDate}
              </div>
            )}

            <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
              {item.notes}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
