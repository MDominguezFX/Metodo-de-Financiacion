
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="flex-1 bg-gradient-to-b from-[#0f141a] to-[#0c1117] border border-[#1a1f27] rounded-2xl p-3">
      <div className="text-xs text-[#b1bcc7]">{label}</div>
      <div className="text-xl font-bold tracking-wide break-words text-[#e6e7ea]">{value}</div>
    </div>
  );
};

export default StatCard;
