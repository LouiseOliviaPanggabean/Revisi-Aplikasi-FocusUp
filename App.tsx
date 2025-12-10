
import React, { useState, useMemo } from 'react';
import { SessionSettings, UserProgress, User, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Settings from './components/Settings';
import Timer from './components/Timer';
import Progress from './components/Progress';
import Auth from './components/auth/Auth';
import TipsAndTricks from './components/TipsAndTricks';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import { useTheme } from './hooks/useTheme';
import Notes from './components/Notes';

const App: React.FC = () => {
  useTheme(); // Initialize and apply theme from local storage
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('focusup-currentUser', null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Mobile T2

  const userProgressKey = useMemo(() => 
    currentUser ? `userProgress_${currentUser.id}` : 'userProgress_guest',
    [currentUser]
  );
  
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>(
    userProgressKey,
    { sessions: [], totalFocusMinutes: 0, dailyTargetMinutes: 180 }
  );
  
  const [settings, setSettings] = useState<SessionSettings | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSessionActive(false);
    setIsTimerRunning(false);
    setSettings(null);
    setActiveView('dashboard');
    setIsSidebarOpen(false);
  };

  const startSession = (newSettings: SessionSettings) => {
    setSettings(newSettings);
    setUserProgress(prev => ({
      ...prev,
      dailyTargetMinutes: newSettings.targetMinutes,
    }));
    setIsSessionActive(true);
    setIsTimerRunning(true);
  };

  const endSession = (focusMinutes: number) => {
    if (settings) {
      const targetMinutes = settings.targetMinutes;
      const newSession = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        durationMinutes: focusMinutes,
        targetMet: focusMinutes >= targetMinutes,
        targetDuration: targetMinutes, // Fix T8: Save target minutes
      };

      setUserProgress(prev => ({
        ...prev,
        sessions: [...prev.sessions, newSession],
        totalFocusMinutes: prev.totalFocusMinutes + focusMinutes,
      }));
    }
    setIsSessionActive(false);
    setIsTimerRunning(false);
    setSettings(null);
    setActiveView('dashboard'); // Return to dashboard after session
  };
  
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={currentUser!} progress={userProgress} setActiveView={setActiveView} />;
      case 'start-focus':
        return <Settings onStart={startSession} />;
      case 'statistics':
        return <Progress userProgress={userProgress} user={currentUser!} />;
      case 'tips-tricks':
        return <TipsAndTricks />;
      case 'notes':
        return <Notes user={currentUser!} />;
      default:
        return <Dashboard user={currentUser!} progress={userProgress} setActiveView={setActiveView} />;
    }
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark-bg text-dark dark:text-dark-text font-sans p-4 sm:p-8 flex items-center justify-center">
        <Auth onLoginSuccess={setCurrentUser} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark-bg text-dark dark:text-dark-text font-sans overflow-hidden">
      {notification && (
        <div className="fixed top-5 right-5 bg-danger text-white p-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 bg-white dark:bg-dark-card rounded-md shadow-md"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
      </div>

      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => { setActiveView(view); setIsSidebarOpen(false); }}
        onLogout={handleLogout}
        isSessionActive={isTimerRunning}
        onNavAttempt={showNotification}
        isOpen={isSidebarOpen} // Pass open state to sidebar
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto w-full pt-16 md:pt-10">
        {isSessionActive && settings ? (
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <Timer 
              settings={settings} 
              onEndSession={endSession}
              isRunning={isTimerRunning}
              setIsRunning={setIsTimerRunning}
            />
          </div>
        ) : (
          renderView()
        )}
      </main>
    </div>
  );
};

export default App;
