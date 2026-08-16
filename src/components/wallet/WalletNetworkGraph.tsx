import React, { useState } from 'react';
import { ConnectedWalletNode } from '../../types/crypto';
import { RiskBadge } from '../common/RiskBadge';
import { shortenAddress, formatCurrency } from '../../utils/formatters';
import { Network, Wallet, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface WalletNetworkGraphProps {
  targetAddress: string;
  connectedWallets: ConnectedWalletNode[];
  onSelectNode?: (address: string) => void;
}

export const WalletNetworkGraph: React.FC<WalletNetworkGraphProps> = ({
  targetAddress,
  connectedWallets,
  onSelectNode,
}) => {
  const [selectedNode, setSelectedNode] = useState<ConnectedWalletNode | null>(null);

  // Layout math for SVG node placement
  const width = 640;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 130;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          Interactive Graph Neural Network Relationship Map
        </h3>
        <span className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-md">
          {connectedWallets.length} Connected Cluster Nodes
        </span>
      </div>

      <div className="relative flex justify-center overflow-x-auto">
        <svg width={width} height={height} className="overflow-visible max-w-full">
          {/* Background Grid Lines */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#1e293b" strokeDasharray="4 4" />
          <circle cx={centerX} cy={centerY} r={radius / 2} fill="none" stroke="#0f172a" strokeDasharray="2 2" />

          {/* Connection Lines */}
          {connectedWallets.map((node, i) => {
            const angle = (i * 2 * Math.PI) / connectedWallets.length;
            const nodeX = centerX + radius * Math.cos(angle);
            const nodeY = centerY + radius * Math.sin(angle);

            const isHighRisk = node.riskScore >= 55;

            return (
              <g key={node.address}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={nodeX}
                  y2={nodeY}
                  stroke={isHighRisk ? '#f43f5e' : '#06b6d4'}
                  strokeWidth={isHighRisk ? 2.5 : 1.5}
                  strokeDasharray={node.type === 'mixer' ? '4 4' : undefined}
                  opacity={0.8}
                />
                <circle
                  cx={(centerX + nodeX) / 2}
                  cy={(centerY + nodeY) / 2}
                  r="3"
                  fill={isHighRisk ? '#f43f5e' : '#06b6d4'}
                />
              </g>
            );
          })}

          {/* Center Target Node */}
          <g transform={`translate(${centerX}, ${centerY})`} className="cursor-pointer">
            <circle r="28" fill="#020617" stroke="#06b6d4" strokeWidth="3" className="animate-pulse" />
            <circle r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text textAnchor="middle" dy="4" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              TARGET
            </text>
          </g>

          {/* Connected Peripheral Nodes */}
          {connectedWallets.map((node, i) => {
            const angle = (i * 2 * Math.PI) / connectedWallets.length;
            const nodeX = centerX + radius * Math.cos(angle);
            const nodeY = centerY + radius * Math.sin(angle);

            const isHighRisk = node.riskScore >= 55;
            const strokeColor = isHighRisk ? '#f43f5e' : node.riskScore >= 50 ? '#f59e0b' : '#10b981';

            return (
              <g
                key={node.address}
                transform={`translate(${nodeX}, ${nodeY})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedNode(node);
                  if (onSelectNode) onSelectNode(node.address);
                }}
              >
                <circle r="18" fill="#0f172a" stroke={strokeColor} strokeWidth="2" />
                <text textAnchor="middle" dy="3" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  {node.type === 'mixer' ? 'MIX' : node.type === 'exchange' ? 'OTC' : 'NODE'}
                </text>
                {/* Address Label */}
                <text textAnchor="middle" dy="28" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  {node.label.substring(0, 10)}...
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{selectedNode.label}</span>
              <RiskBadge score={selectedNode.riskScore} size="sm" />
            </div>
            <p className="text-[11px] text-slate-400">
              Relation: {selectedNode.relation} | Volume: {formatCurrency(selectedNode.volumeUSD)}
            </p>
          </div>
          <button
            onClick={() => onSelectNode && onSelectNode(selectedNode.address)}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold text-[11px] transition-colors flex items-center gap-1"
          >
            Inspect Node <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
