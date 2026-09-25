import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "oncall"
    | "ringing"
    | "idle"
    | "paused"
    | "manual"
    | "bucket0"
    | "bucket1"
    | "bucket2"
    | "bucket3";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-slate-900 text-white",
    secondary: "border-transparent bg-slate-100 text-slate-900",
    destructive: "border-rose-200 bg-rose-50 text-rose-700",
    outline: "text-slate-800 border-slate-300",
    // Telephony specific status styles (Enterprise)
    oncall: "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium",
    ringing: "border-amber-200 bg-amber-50 text-amber-800 font-medium",
    idle: "border-blue-200 bg-blue-50 text-blue-800 font-medium",
    paused: "border-rose-200 bg-rose-50 text-rose-800 font-medium",
    manual: "border-slate-300 bg-slate-100 text-slate-800 font-medium",
    // Banking DPD Buckets
    bucket0: "border-emerald-200 bg-emerald-50 text-emerald-800",
    bucket1: "border-yellow-200 bg-yellow-50 text-yellow-800",
    bucket2: "border-orange-200 bg-orange-50 text-orange-800",
    bucket3: "border-red-200 bg-red-50 text-red-800 font-semibold",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors select-none",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
