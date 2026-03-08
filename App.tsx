import { useState } from 'react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import type { WindowState, AppDefinition } from './types';
import FileExplorer from './apps/FileExplorer';
import Browser from './apps/Browser';
import Settings from './apps/Settings';
import Calculator from './apps/Calculator';
import Photos from './apps/Photos';
import Notepad from './apps/Notepad';
import Store from './apps/Store';

const apps: AppDefinition[] = [
  { id: 'edge', name: 'Microsoft Edge', icon: '🌐', component: 'Browser' },
  { id: 'explorer', name: 'File Explorer', icon: '📁', component: 'FileExplorer' },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: 'Settings' },
  { id: 'store', name: 'Microsoft Store', icon: '🛍️', component: 'Store' },
  { id: 'photos', name: 'Photos', icon: '🖼️', component: 'Photos' },
  { id: 'calculator', name: 'Calculator', icon: '🔢', component: 'Calculator' },
  { id: 'notepad', name: 'Notepad', icon: '📝', component: 'Notepad' },
  { id: 'mail', name: 'Mail', icon: '📧', component: 'Browser' },
  { id: 'calendar', name: 'Calendar', icon: '📅', component: 'Browser' },
  { id: 'music', name: 'Music', icon: '🎵', component: 'Browser' },
  { id: 'video', name: 'Movies & TV', icon: '🎬', component: 'Browser' },
  { id: 'weather', name: 'Weather', icon: '🌤️', component: 'Browser' },
  { id: 'news', name: 'News', icon: '📰', component: 'Browser' },
  { id: 'maps', name: 'Maps', icon: '🗺️', component: 'Browser' },
  { id: 'clock', name: 'Clock', icon: '⏰', component: 'Browser' },
  { id: 'terminal', name: 'Terminal', icon: '💻', component: 'Notepad' },
  { id: 'paint', name: 'Paint', icon: '🎨', component: 'Browser' },
  { id: 'camera', name: 'Camera', icon: '📷', component: 'Photos' },
];

function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(100);

  const getAppComponent = (componentName: string) => {
    switch (componentName) {
      case 'FileExplorer': return <FileExplorer />;
      case 'Browser': return <Browser />;
      case 'Settings': return <Settings />;
      case 'Calculator': return <Calculator />;
      case 'Photos': return <Photos />;
      case 'Notepad': return <Notepad />;
      case 'Store': return <Store />;
      default: return <div className="p-8">App not implemented</div>;
    }
  };

  const openApp = (app: AppDefinition) => {
    const existingWindow = windows.find(w => w.component === app.component && w.title === app.name);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        updateWindow(existingWindow.id, { isMinimized: false });
      }
      focusWindow(existingWindow.id);
    } else {
      const newWindow: WindowState = {
        id: `window-${Date.now()}`,
        title: app.name,
        icon: app.icon,
        component: app.component,
        x: 100 + windows.length * 30,
        y: 50 + windows.length * 30,
        width: 900,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
      };
      setWindows([...windows, newWindow]);
      setNextZIndex(nextZIndex + 1);
    }
    setIsStartOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    updateWindow(id, { isMinimized: true });
  };

  const maximizeWindow = (id: string) => {
    const window = windows.find(w => w.id === id);
    if (window) {
      updateWindow(id, { isMaximized: !window.isMaximized });
    }
  };

  const focusWindow = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(nextZIndex + 1);
  };

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows(windows.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const handleWindowClick = (id: string) => {
    const window = windows.find(w => w.id === id);
    if (window?.isMinimized) {
      updateWindow(id, { isMinimized: false });
    }
    focusWindow(id);
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => setIsStartOpen(false)}
    >
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onUpdate={updateWindow}
        >
          {getAppComponent(window.component)}
        </Window>
      ))}

      <StartMenu
        apps={apps}
        onAppClick={openApp}
        isOpen={isStartOpen}
      />

      <Taskbar
        windows={windows}
        onStartClick={(e) => {
          e.stopPropagation();
          setIsStartOpen(!isStartOpen);
        }}
        onWindowClick={handleWindowClick}
        isStartOpen={isStartOpen}
      />
    </div>
  );
}

export default App;
