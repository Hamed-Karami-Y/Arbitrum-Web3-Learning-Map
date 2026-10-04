// src/context/LearningContext.jsx
// Central learning progression, localStorage persistence, and gamification state

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { STAGES } from '../data/stages.js';
import { APP_CONFIG } from '../config/environment.js';

const LearningContext = createContext(null);

const STORAGE_KEY = `${APP_CONFIG.storagePrefix}_state`;

const DEFAULT_SANDBOX_STATE = {
  simulatedAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  simulatedBalance: "10.00",
  simulatedTokens: "500",
  signedMessages: [],
  history: [
    {
      id: "sim-1",
      action: "Genesis Simulation Account",
      type: "Simulation Setup",
      timestamp: "Sandbox Init",
      amount: "10.00 SIM-ETH",
      status: "Verified",
    },
  ],
};

export function LearningProvider({ children }) {
  // Load initial state from versioned localStorage
  const [completedStages, setCompletedStages] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_completed`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_xp`);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [txHistory, setTxHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_txs`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sandboxState, setSandboxState] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sandbox`);
      return saved ? JSON.parse(saved) : DEFAULT_SANDBOX_STATE;
    } catch {
      return DEFAULT_SANDBOX_STATE;
    }
  });

  const [activeStageId, setActiveStageId] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'map' | 'security' | 'quests' | 'profile' | 'settings'
  const [recentNotification, setRecentNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_completed`, JSON.stringify(completedStages));
    } catch (e) {
      console.warn("Could not save completed stages to localStorage", e);
    }
  }, [completedStages]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_xp`, xp.toString());
    } catch (e) {
      console.warn("Could not save XP to localStorage", e);
    }
  }, [xp]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_txs`, JSON.stringify(txHistory));
    } catch (e) {
      console.warn("Could not save transactions to localStorage", e);
    }
  }, [txHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sandbox`, JSON.stringify(sandboxState));
    } catch (e) {
      console.warn("Could not save sandbox to localStorage", e);
    }
  }, [sandboxState]);

  // Check stage unlock status
  const isStageUnlocked = (stageId) => {
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return false;
    if (!stage.prerequisites || stage.prerequisites.length === 0) return true;
    return stage.prerequisites.every(prereqId => completedStages.includes(prereqId));
  };

  const isStageCompleted = (stageId) => {
    return completedStages.includes(stageId);
  };

  // Complete a stage and award XP
  const completeStage = (stageId, txData = null) => {
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;

    const isAlreadyDone = completedStages.includes(stageId);

    if (!isAlreadyDone) {
      setCompletedStages(prev => [...prev, stageId]);
      setXp(prev => prev + stage.xp);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#818cf8', '#34d399', '#f59e0b']
        });
      } catch (err) {
        // ignore confetti errors
      }

      setRecentNotification({
        title: `Stage Completed!`,
        message: `${stage.title} (+${stage.xp} XP)`,
        type: 'success',
      });

      setTimeout(() => setRecentNotification(null), 5000);
    }

    if (txData) {
      addTxRecord({
        stageId,
        stageTitle: stage.title,
        ...txData,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  const addTxRecord = (record) => {
    setTxHistory(prev => [
      {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ...record,
      },
      ...prev.slice(0, 49), // retain last 50 transactions
    ]);
  };

  const updateSandbox = (updater) => {
    setSandboxState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  const resetProgress = () => {
    setCompletedStages([]);
    setXp(0);
    setTxHistory([]);
    setSandboxState(DEFAULT_SANDBOX_STATE);
    setActiveStageId(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_completed`);
      localStorage.removeItem(`${STORAGE_KEY}_xp`);
      localStorage.removeItem(`${STORAGE_KEY}_txs`);
      localStorage.removeItem(`${STORAGE_KEY}_sandbox`);
    } catch {
      // ignore
    }
    setRecentNotification({
      title: "Progress Reset",
      message: "Your learning map and XP have been reset to zero.",
      type: "info",
    });
    setTimeout(() => setRecentNotification(null), 4000);
  };

  // Gamification metrics
  const coreStages = STAGES.filter(s => s.isCore);
  const coreCompletedCount = coreStages.filter(s => completedStages.includes(s.id)).length;
  const progressPercent = Math.round((coreCompletedCount / Math.max(coreStages.length, 1)) * 100);

  // Level computation
  let journeyLevel = 1;
  let levelTitle = "Explorer";
  if (xp >= 1600) { journeyLevel = 7; levelTitle = "Mainnet Master"; }
  else if (xp >= 1200) { journeyLevel = 6; levelTitle = "DeFi Architect"; }
  else if (xp >= 800) { journeyLevel = 5; levelTitle = "Smart Contract Pilot"; }
  else if (xp >= 500) { journeyLevel = 4; levelTitle = "Onchain Pioneer"; }
  else if (xp >= 250) { journeyLevel = 3; levelTitle = "Arbitrum Voyager"; }
  else if (xp >= 100) { journeyLevel = 2; levelTitle = "Cadet"; }

  return (
    <LearningContext.Provider
      value={{
        completedStages,
        xp,
        txHistory,
        sandboxState,
        activeStageId,
        currentView,
        recentNotification,
        journeyLevel,
        levelTitle,
        progressPercent,
        coreCompletedCount,
        totalCoreStages: coreStages.length,
        setCurrentView,
        setActiveStageId,
        isStageUnlocked,
        isStageCompleted,
        completeStage,
        addTxRecord,
        updateSandbox,
        resetProgress,
        openStage: (id) => setActiveStageId(id),
        closeStage: () => setActiveStageId(null),
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
}
