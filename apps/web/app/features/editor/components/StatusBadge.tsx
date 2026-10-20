import { CircleCheck, CircleDashed, CircleX, TriangleAlert } from "lucide-react";
import React from "react";

type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed';

interface StatusBadgeProps {
  status: ExecutionStatus;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: TriangleAlert,
    bgColor: 'bg-orange-50',
    textColor: 'text-[#EAA65D]',
  },
  running: {
    label: 'Running',
    icon: CircleDashed,
    bgColor: 'bg-sky-100',
    textColor: 'text-[#008AF5]',
  },
  completed: {
    label: 'Completed',
    icon: CircleCheck,
    bgColor: 'bg-emerald-50',
    textColor: 'text-[#57BC6C]',
  },
  failed: {
    label: 'Failed',
    icon: CircleX,
    bgColor: 'bg-rose-50',
    textColor: 'text-[#D57463]',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor}`}>
      <Icon className="w-4 h-4" strokeWidth={3} />
      <span className={`font-semibold text-sm ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
