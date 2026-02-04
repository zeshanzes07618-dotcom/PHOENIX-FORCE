
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Settings, 
  Plus, 
  User, 
  Sword, 
  Calendar, 
  ChevronRight,
  LayoutDashboard,
  Users,
  Target,
  BarChart3,
  Bot,
  History,
  Clock,
  Menu
} from 'lucide-react';
import { Player, Match, AppState, HistoryEntry } from './types';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import MatchSchedule from './components/MatchSchedule';
import UpdateStatsModal from './components/UpdateStatsModal';
import AddMatchModal from './components/AddMatchModal';
import SettingsModal from './components/SettingsModal';
import AIInsights from './components/AIInsights';
import LandingPage from './components/LandingPage';
import HistoryView from './components/HistoryView';
import AddHistoryModal from './components/AddHistoryModal';
import Sidebar from './components/Sidebar';
import UpcomingBattlesView from './components/UpcomingBattlesView';

const INITIAL_STATE: AppState = {
  clanName: "PHOENIX FORCE",
  players: [
    { id: '1', name: 'Phoenix_Alpha', kills: 450, matchesPlayed: 120, avatar: 'https://picsum.photos/seed/p1/200' },
    { id: '2', name: 'Inferno_Ghost', kills: 380, matchesPlayed: 115, avatar: 'https://picsum.photos/seed/p2/200' },
    { id: '3', name: 'Flame_Viper', kills: 290, matchesPlayed: 90, avatar: 'https://picsum.photos/seed/p3/200' },
    { id: '4', name: 'Ash_Reaper', kills: 520, matchesPlayed: 130, avatar: 'https://picsum.photos/seed/p4/200' }
  ],
  matches: [
    { id: '1', date: '2024-05-20', time: '18:00', opponent: 'Shadow Reapers', tournament: 'Global Elite Series' },
    { id: '2', date: '2024-05-22', time: '20:30', opponent: 'Quantum Chaos', tournament: 'Cyber Invitational' }
  ],
  history: [
    { id: 'h1', date: '2024-05-15', tournament: 'Spring Qualifiers', opponent: 'Titan Slayers', result: 'VICTORY', score: '16 - 12', mvp: 'Phoenix_Alpha' },
    { id: 'h2', date: '2024-05-12', tournament: 'Community Cup', opponent: 'Frost Bites', result: 'DEFEAT', score: '14 - 16', mvp: 'Ash_Reaper' }
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('phoenix_force_data');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [hasEntered, setHasEntered] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'upcoming'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('phoenix_force_data', JSON.stringify(state));
  }, [state]);

  const updatePlayer = (playerId: string, kills: number, matches: number, name?: string, avatar?: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { 
          ...p, 
          kills: p.kills + kills, 
          matchesPlayed: p.matchesPlayed + matches,
          name: name || p.name,
          avatar: avatar || p.avatar
        } : p
      )
    }));
  };

  const addMatch = (newMatch: Omit<Match, 'id'>) => {
    setState(prev => ({
      ...prev,
      matches: [...prev.matches, { ...newMatch, id: Date.now().toString() }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }));
  };

  const addHistoryEntry = (newEntry: Omit<HistoryEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      history: [{ ...newEntry, id: Date.now().toString() }, ...prev.history]
    }));
  };

  const updateClanName = (name: string) => {
    setState(prev => ({ ...prev, clanName: name }));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-left duration-500">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-gaming font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 uppercase italic">
                    PHOENIX SQUAD
                  </h2>
                  <div className="hidden sm:flex items-center gap-1 bg-orange-600/10 border border-orange-500/20 px-3 py-1 rounded-full">
                    <Trophy size={12} className="text-orange-500" />
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Global Leaderboard</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500/30"
                >
                  <Plus size={18} /> EDIT SQUAD & STATS
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {state.players.map(player => {
                  const rank = state.players.filter(p => p.kills > player.kills).length + 1;
                  return <StatsCard key={player.id} player={player} rank={rank} />;
                })}
              </div>

              <AIInsights players={state.players} />
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-gaming font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 uppercase italic cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('upcoming')}>
                  UPCOMING BATTLES
                </h2>
                <button 
                  onClick={() => setIsMatchModalOpen(true)}
                  className="p-2 bg-green-600/20 hover:bg-green-600/40 rounded-lg text-green-400 transition-all border border-green-500/30"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {state.matches.length > 0 ? (
                  state.matches.slice(0, 3).map(match => (
                    <MatchSchedule key={match.id} match={match} />
                  ))
                ) : (
                  <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 border-dashed border-2">
                    No matches on radar
                  </div>
                )}
                {state.matches.length > 3 && (
                  <button 
                    onClick={() => setCurrentView('upcoming')}
                    className="w-full py-3 glass-panel rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all border-dashed border-2 border-white/5"
                  >
                    VIEW ALL MISSIONS ({state.matches.length})
                  </button>
                )}
              </div>
              
              <div className="glass-panel p-6 rounded-2xl border-orange-500/20">
                <h3 className="font-gaming text-sm text-orange-400 mb-4 flex items-center gap-2">
                  <BarChart3 size={16} /> CORE PERFORMANCE
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-400">Squad Kills</span>
                      <span className="text-lg font-gaming text-white">
                        {state.players.reduce((acc, p) => acc + p.kills, 0)}
                      </span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 h-full w-[82%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return <HistoryView history={state.history} onAddClick={() => setIsHistoryModalOpen(true)} />;
      case 'upcoming':
        return <UpcomingBattlesView matches={state.matches} onAddClick={() => setIsMatchModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200">
      {!hasEntered && (
        <LandingPage clanName={state.clanName} onEnter={() => setHasEntered(true)} />
      )}
      
      {hasEntered && (
        <div className="flex min-h-screen overflow-hidden">
          <Sidebar 
            currentView={currentView} 
            onViewChange={(view) => {
              setCurrentView(view as any);
              setIsSidebarOpen(false);
            }}
            onOpenSettings={() => {
              setIsSettingsModalOpen(true);
              setIsSidebarOpen(false);
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col min-w-0 transition-all duration-500">
            <Header 
              clanName={state.clanName} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 pb-32">
              <div className="relative">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <UpdateStatsModal 
          players={state.players} 
          onClose={() => setIsUpdateModalOpen(false)} 
          onUpdate={updatePlayer} 
        />
      )}
      {isMatchModalOpen && (
        <AddMatchModal 
          onClose={() => setIsMatchModalOpen(false)} 
          onAdd={addMatch} 
        />
      )}
      {isHistoryModalOpen && (
        <AddHistoryModal 
          players={state.players}
          onClose={() => setIsHistoryModalOpen(false)} 
          onAdd={addHistoryEntry} 
        />
      )}
      {isSettingsModalOpen && (
        <SettingsModal 
          currentName={state.clanName}
          onClose={() => setIsSettingsModalOpen(false)} 
          onSave={updateClanName} 
        />
      )}
    </div>
  );
};

export default App;
