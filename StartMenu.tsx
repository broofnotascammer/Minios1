import { useState } from 'react';
import { Search } from 'lucide-react';
import type { AppDefinition } from '../types';

interface StartMenuProps {
  apps: AppDefinition[];
  onAppClick: (app: AppDefinition) => void;
  isOpen: boolean;
}

export default function StartMenu({ apps, onAppClick, isOpen }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedApps = apps.slice(0, 6);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-14 left-4 w-96 bg-gray-950 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Type here to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {searchQuery ? (
          <div className="max-h-96 overflow-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onAppClick(app)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">{app.icon}</span>
                  <span className="text-xs text-gray-300 text-center line-clamp-2">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xs font-semibold text-gray-400 mb-3 px-2">PINNED</h2>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {pinnedApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onAppClick(app)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">{app.icon}</span>
                  <span className="text-xs text-gray-300 text-center line-clamp-2">{app.name}</span>
                </button>
              ))}
            </div>

            <h2 className="text-xs font-semibold text-gray-400 mb-3 px-2">ALL APPS</h2>
            <div className="grid grid-cols-4 gap-3 max-h-96 overflow-auto">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onAppClick(app)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">{app.icon}</span>
                  <span className="text-xs text-gray-300 text-center line-clamp-2">{app.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
