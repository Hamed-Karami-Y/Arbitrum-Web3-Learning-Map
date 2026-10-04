// src/components/Common/ExplorerLink.jsx
// Reusable link to Arbiscan block explorer for transactions, addresses, and contracts

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getExplorerTxUrl, getExplorerAddressUrl } from '../../config/contracts.js';

export function ExplorerLink({ type = 'tx', value, label, className = '' }) {
  if (!value) return null;

  const url = type === 'tx' ? getExplorerTxUrl(value) : getExplorerAddressUrl(value);
  const displayLabel = label || (type === 'tx' 
    ? `${value.slice(0, 10)}...${value.slice(-8)}` 
    : `${value.slice(0, 6)}...${value.slice(-4)}`
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ${className}`}
      title="View on Arbiscan"
    >
      <span>{displayLabel}</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}
