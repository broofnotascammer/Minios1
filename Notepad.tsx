import { useState } from 'react';
import { Save, Plus } from 'lucide-react';

export default function Notepad() {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('Untitled');

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-10 bg-white border-b border-gray-300 flex items-center px-2 gap-1 text-sm">
        <div className="flex gap-0.5">
          <button className="px-3 py-1 hover:bg-gray-100 rounded">File</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Edit</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Format</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">View</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">Help</button>
        </div>
      </div>

      <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-2 gap-2">
        <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
          <Plus size={16} />
          New
        </button>
        <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm">
          <Save size={16} />
          Save
        </button>
      </div>

      <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-2">
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="text-xs px-2 py-1 border border-gray-300 rounded flex-1 max-w-xs"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm bg-white"
        placeholder="Start typing..."
        spellCheck="false"
      />

      <div className="h-6 bg-gray-50 border-t border-gray-200 px-2 flex items-center text-xs text-gray-600">
        Line {content.split('\n').length} | Column {content.split('\n').pop()?.length || 0}
      </div>
    </div>
  );
}
