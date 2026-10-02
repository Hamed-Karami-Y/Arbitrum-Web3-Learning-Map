// src/components/Stages/StageFirstTx.jsx
// Stage 4: First Onchain Transaction - Full real testnet transaction lifecycle

import React, { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { DEMO_RECIPIENTS } from '../../config/demoAddresses.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageFirstTx({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  
  const [recipient, setRecipient] = useState(address || DEMO_RECIPIENTS[0].address);
  const [amount, setAmount] = useState("0.0001");
  const [txSubmitted, setTxSubmitted] = useState(false);

  const completed = isStageCompleted(stage.id);

  // Wagmi send transaction hooks
  const { 
    sendTransaction, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: sendError 
  } = useSendTransaction();

  const { 
    data: receipt, 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // When confirmed, award XP and record transaction
  useEffect(() => {
    if (isConfirmed && receipt && txHash) {
      completeStage(stage.id, {
        hash: txHash,
        type: "First Onchain Transaction",
        amount: `${amount} ETH`,
        recipient,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        status: "Confirmed",
      });
    }
  }, [isConfirmed, receipt, txHash]);

  const handleSend = () => {
    if (!recipient || !amount) return;
    try {
      sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
      setTxSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Celebration Banner if already completed */}
      {completed ? (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">
            Milestone Achieved: You are officially Onchain!
          </h4>
          <p className="text-xs text-emerald-200/90 max-w-md mx-auto">
            “You just performed your first real onchain action.” Your transaction has been permanently etched into the Arbitrum Sepolia ledger.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-cyan-300 font-mono uppercase tracking-wide">
              The First Onchain Step
            </div>
            <p className="text-slate-300 leading-relaxed">
              Send a tiny real testnet transaction of <strong>0.0001 test ETH</strong>. You can send it back to your own address or to your study partner.
            </p>
          </div>
        </div>
      )}

      {/* Transaction Setup Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <span>Prepare Transaction</span>
        </h4>

        {/* Recipient Selection */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">Recipient Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              placeholder="0x..."
            />
            {address && (
              <button
                type="button"
                onClick={() => setRecipient(address)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors whitespace-nowrap"
              >
                Self
              </button>
            )}
          </div>

          {/* Quick Demo Choices */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 font-mono mr-1">Demo Peers:</span>
            {DEMO_RECIPIENTS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRecipient(demo.address)}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-blue-950 border border-slate-800 text-[10px] text-cyan-300 font-mono transition-colors"
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Amount (ETH)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || completed}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAwaitingSignature ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Confirm in your Wallet...</span>
            </>
          ) : isPendingBroadcast ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>Confirming on Arbitrum Nitro...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send 0.0001 ETH Onchain</span>
            </>
          )}
        </button>

        {sendError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{sendError.message.includes("User rejected") ? "Transaction signature was cancelled in your wallet." : sendError.message}</span>
          </div>
        )}
      </div>

      {/* Transaction Details & Lifecycle Viewer */}
      {txHash && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-cyan-300 uppercase font-mono">
              Onchain Receipt Details
            </h5>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              isConfirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300 animate-pulse'
            }`}>
              {isConfirmed ? 'Finalized' : 'Pending Confirmation'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Hash:</span>
              <ExplorerLink type="tx" value={txHash} />
            </div>
            {receipt?.blockNumber && (
              <div className="flex justify-between">
                <span className="text-slate-500">Block:</span>
                <span className="text-white">#{receipt.blockNumber.toString()}</span>
              </div>
            )}
            {receipt?.gasUsed && (
              <div className="flex justify-between">
                <span className="text-slate-500">Gas Used:</span>
                <span className="text-emerald-400">{receipt.gasUsed.toString()} units</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Network:</span>
              <span className="text-blue-400">Arbitrum Sepolia</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <ExplorerLink 
              type="tx" 
              value={txHash} 
              label="View on Arbiscan Block Explorer" 
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-xs" 
            />
          </div>
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 5: ERC-20 Tokens</span>
          </span>
        )}
      </div>

    </div>
  );
}
