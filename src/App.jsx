// src/App.jsx
// Main Application Container for Arbitrum Web3 Learning Map

import React from 'react';
import { useLearning } from './context/LearningContext.jsx';
import { TopHUD } from './components/HUD/TopHUD.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { LearningMap } from './components/Map/LearningMap.jsx';
import { StageDetailModal } from './components/Stages/StageDetailModal.jsx';
import { ProfileModal } from './components/Profile/ProfileModal.jsx';
import { SponsoredQuestsModal } from './components/Quests/SponsoredQuestsModal.jsx';
import { SettingsModal } from './components/Settings/SettingsModal.jsx';
import { StageSecurityLab } from './components/Stages/StageSecurityLab.jsx';
import { XPNotification } from './components/Common/XPNotification.jsx';
import { STAGES } from './data/stages.js';

export function App() {
  const { currentView } = useLearning();

  const securityStage = STAGES.find(s => s.id === 'stage-13') || STAGES[13];

  return (
    <div className="min-h-screen bg-[#070b14] bg-cartography-grid bg-radial-vignette text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Top HUD Persistent Navigation */}
      <TopHUD />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'map' && <LearningMap />}
        {currentView === 'profile' && <ProfileModal />}
        {currentView === 'quests' && <SponsoredQuestsModal />}
        {currentView === 'settings' && <SettingsModal />}
        {currentView === 'security' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <StageSecurityLab stage={securityStage} />
          </div>
        )}
      </main>

      {/* Persistent Global Modals & Notifications */}
      <StageDetailModal />
      <XPNotification />
    </div>
  );
}

export default App;
