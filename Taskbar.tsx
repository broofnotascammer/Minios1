import { useState, useEffect } from 'react';
import { Volume2, Wifi, Battery } from 'lucide-react';
import type { WindowState } from '../types';

interface TaskbarProps {
  windows: WindowState[];
  onStartClick: (e: React.MouseEvent) => void;
  onWindowClick: (id: string) => void;
  isStartOpen: boolean;
}

export default function Taskbar({
  windows,
  onStartClick,
  onWindowClick,
  isStartOpen,
}: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-gray-900 bg-opacity-80 backdrop-blur-md border-t border-gray-700 flex items-center px-2 gap-2">
      <button
        onClick={onStartClick}
        className={`p-2 hover:bg-gray-700 rounded-md transition-colors ${
          isStartOpen ? 'bg-gray-700' : ''
        }`}
        title="Start"
      >
        <span className="text-2xl">⊞</span>
      </button>

      <div className="w-px h-6 bg-gray-600" />

      <div className="flex gap-1 flex-1">
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => onWindowClick(window.id)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center gap-2 max-w-xs truncate"
          >
            <span>{window.icon}</span>
            <span className="truncate">{window.title}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="p-1 hover:bg-gray-700 rounded text-gray-300" title="Volume">
          <Volume2 size={18} />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded text-gray-300" title="WiFi">
          <Wifi size={18} />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded text-gray-300" title="Battery">
          <Battery size={18} />
        </button>
        <div className="px-3 py-1 text-gray-300 text-sm hover:bg-gray-700 rounded transition-colors cursor-pointer">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
