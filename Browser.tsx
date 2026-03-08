import { ChevronLeft, ChevronRight, RotateCcw, Hop as Home, MapPin } from 'lucide-react';

export default function Browser() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2 bg-gray-50">
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <RotateCcw size={18} className="text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <Home size={18} className="text-gray-600" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded px-3 h-8">
          <MapPin size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search or enter website name"
            className="flex-1 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-8">
        <div className="text-6xl mb-6">🌐</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Google</h1>
        <div className="w-full max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search Google or type a URL"
              className="flex-1 h-12 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
              Google Search
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm">
              I'm Feeling Lucky
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p className="mb-2">Popular websites</p>
          <div className="flex gap-6 justify-center flex-wrap">
            {['YouTube', 'Facebook', 'Wikipedia', 'Twitter', 'Reddit', 'LinkedIn'].map((site) => (
              <a key={site} href="#" className="text-blue-600 hover:underline">
                {site}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
