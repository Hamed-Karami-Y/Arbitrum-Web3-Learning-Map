// src/components/Stages/StageTransfer.jsx
// Stage 6: Token Transfer - Execute ERC-20 transfers and inspect emitted Transfer events

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../../config/contracts.js';
import { DEMO_RECIPIENTS } from '../../config/demoAddresses.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';
import { ARBITRUM_SAFE_FEES } from '../../config/chain.js';

export function StageTransfer({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [recipient, setRecipient] = useState(DEMO_RECIPIENTS[0].address);
  const [amount, setAmount] = useState("50");

  // Read Token Balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Transfer contract write
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: transferError 
  } = useWriteContract();

  const { 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed, 
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed && txHash) {
      refetchBalance();
      completeStage(stage.id, {
        hash: txHash,
        type: `Transfer ${amount} LEARN`,
        recipient,
        amount: `${amount} LEARN`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "Confirmed"
      });
    }
  }, [isConfirmed, txHash]);

  const handleTransfer = () => {
    if (!recipient || !amount) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'transfer',
        args: [recipient, parseUnits(amount, 18)],
        maxFeePerGas: ARBITRUM_SAFE_FEES.maxFeePerGas,
        maxPriorityFeePerGas: ARBITRUM_SAFE_FEES.maxPriorityFeePerGas,
        gas: 100000n,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const userBalance = balance ? parseFloat(formatUnits(balance, 18)) : 0;

  return (
    <div className="space-y-6">
      
      {/* Educational Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
        <ArrowRightLeft className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-mono uppercase tracking-wide">
            How Token Transfers Work Under The Hood
          </div>
          <p className="text-slate-300 leading-relaxed">
            When you call <code className="text-cyan-300 font-mono">transfer(to, amount)</code>, the token contract updates its internal mapping ledger: decreasing your balance, crediting the recipient, and emitting the standard <code className="text-cyan-300 font-mono">Transfer(from, to, value)</code> event.
          </p>
        </div>
      </div>

      {/* Transfer Form Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>Send LEARN Tokens</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">
            Available: <strong className="text-white">{userBalance.toLocaleString()} LEARN</strong>
          </span>
        </div>

        {/* Recipient Picker */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            placeholder="0x..."
          />

          {/* Quick Demo Peer Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 font-mono mr-1">Demo Recipients:</span>
            {DEMO_RECIPIENTS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRecipient(demo.address)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border ${
                  recipient === demo.address 
                    ? 'bg-blue-600/30 text-cyan-300 border-cyan-500/40 font-bold' 
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Amount to Transfer</span>
            <button 
              type="button" 
              onClick={() => setAmount("50")} 
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Set 50 LEARN
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            min="1"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleTransfer}
          disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || userBalance < parseFloat(amount || "0")}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAwaitingSignature ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Confirm transfer() in Wallet...</span>
            </>
          ) : isPendingBroadcast ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-amber-300" />
              <span>Submitting Transfer to Arbitrum...</span>
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer {amount} LEARN</span>
            </>
          )}
        </button>

        {transferError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{transferError.message.includes("User rejected") ? "Transfer was rejected in wallet." : transferError.message}</span>
          </div>
        )}
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Transfer Receipt:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">Reward: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked Stage 7: Approvals & Allowances</span>
          </span>
        )}
      </div>

    </div>
  );
}
