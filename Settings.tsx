import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: 'System', icon: '⚙️' },
    { id: 'display', label: 'Display', icon: '🖥️' },
    { id: 'sound', label: 'Sound', icon: '🔊' },
    { id: 'network', label: 'Network & Internet', icon: '🌐' },
    { id: 'bluetooth', label: 'Bluetooth', icon: '📡' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'accounts', label: 'Accounts', icon: '👤' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="flex h-full bg-white">
      <div className="w-56 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        </div>
        <div className="space-y-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'system' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">System</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Device name</h3>
                <input type="text" defaultValue="DESKTOP-PC" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Processor</h3>
                <p className="text-gray-600">Intel Core i7-11700K @ 3.60GHz</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Installed RAM</h3>
                <p className="text-gray-600">16.0 GB</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'display' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Display</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Brightness</h3>
                <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Night light</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={false} />
                  <span>Turn on night light</span>
                </label>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Resolution</h3>
                <p className="text-gray-600">1920 x 1080 (recommended)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Network & Internet</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Wi-Fi</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Connected to: HomeNetwork</p>
                  <p className="text-xs text-gray-500">Signal strength: Excellent</p>
                </div>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Ethernet</h3>
                <p className="text-gray-600 text-sm">Connected</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">VPN</h3>
                <p className="text-gray-600 text-sm">Not connected</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Accounts</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Your info
                </h3>
                <p className="text-gray-600 text-sm">User@example.com</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Linked accounts</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Add Microsoft account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Storage</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Local Disk (C:)</h3>
                <div className="bg-gray-100 rounded-full h-4 overflow-hidden mb-2">
                  <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                </div>
                <p className="text-sm text-gray-600">650 GB of 1 TB used</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-2">Storage sense</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={true} />
                  <span>Turn on Storage sense</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">About</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-1">Device name</h3>
                <p className="text-gray-600">DESKTOP-PC</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-1">Windows Edition</h3>
                <p className="text-gray-600">Windows 11 Pro</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-1">Version</h3>
                <p className="text-gray-600">22H2</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-1">OS Build</h3>
                <p className="text-gray-600">22621.1555</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
