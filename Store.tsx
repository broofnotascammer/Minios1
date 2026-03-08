import { Search, Star, Download } from 'lucide-react';

interface App {
  name: string;
  category: string;
  rating: number;
  icon: string;
}

export default function Store() {
  const apps: App[] = [
    { name: 'Spotify', category: 'Music', rating: 4.5, icon: '🎵' },
    { name: 'Netflix', category: 'Entertainment', rating: 4.3, icon: '🎬' },
    { name: 'Discord', category: 'Social', rating: 4.7, icon: '💬' },
    { name: 'Visual Studio Code', category: 'Developer Tools', rating: 4.8, icon: '💻' },
    { name: 'Adobe Photoshop', category: 'Photo & Video', rating: 4.6, icon: '🎨' },
    { name: 'Zoom', category: 'Productivity', rating: 4.2, icon: '📹' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-14 border-b border-gray-200 flex items-center px-6 gap-4">
        <h1 className="text-xl font-semibold">Microsoft Store</h1>
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search apps, games, movies, and more"
            className="w-full h-10 pl-10 pr-4 bg-gray-100 rounded text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Apps</h2>
          <div className="grid grid-cols-3 gap-4">
            {apps.map((app, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center text-3xl">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{app.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{app.category}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="currentColor" className="text-yellow-500" />
                        <span className="text-xs">{app.rating}</span>
                      </div>
                      <button className="ml-auto px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 flex items-center gap-1">
                        <Download size={12} />
                        Get
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
