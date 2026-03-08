import { Folder as FolderIcon, File as FileIcon } from 'lucide-react';
import { useState } from 'react';

interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified?: string;
}

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('C:\\Users\\Desktop');
  const [items] = useState<FolderItem[]>([
    { name: 'Documents', type: 'folder', modified: '3/1/2026' },
    { name: 'Pictures', type: 'folder', modified: '2/28/2026' },
    { name: 'Videos', type: 'folder', modified: '2/20/2026' },
    { name: 'Downloads', type: 'folder', modified: '3/5/2026' },
    { name: 'Music', type: 'folder', modified: '1/15/2026' },
    { name: 'project.txt', type: 'file', size: '4.2 KB', modified: '3/8/2026' },
    { name: 'budget.xlsx', type: 'file', size: '125 KB', modified: '2/28/2026' },
    { name: 'presentation.pptx', type: 'file', size: '2.5 MB', modified: '3/1/2026' },
  ]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2 bg-gray-50">
        <button className="p-1 hover:bg-gray-200 rounded">◀</button>
        <button className="p-1 hover:bg-gray-200 rounded">▶</button>
        <button className="p-1 hover:bg-gray-200 rounded">⬆</button>
        <div className="flex-1 bg-white border border-gray-300 rounded px-3 py-1 text-sm">
          {currentPath}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 border-r border-gray-200 bg-gray-50 p-4 overflow-auto">
          <div className="space-y-1">
            <div className="p-2 hover:bg-blue-100 rounded cursor-pointer text-sm">
              🏠 Quick Access
            </div>
            <div className="p-2 hover:bg-blue-100 rounded cursor-pointer text-sm">
              📁 This PC
            </div>
            <div className="p-2 hover:bg-blue-100 rounded cursor-pointer text-sm">
              📄 Desktop
            </div>
            <div className="p-2 hover:bg-blue-100 rounded cursor-pointer text-sm">
              📁 Documents
            </div>
            <div className="p-2 hover:bg-blue-100 rounded cursor-pointer text-sm">
              ⬇ Downloads
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors group"
                onDoubleClick={() => {
                  if (item.type === 'folder') {
                    setCurrentPath(`${currentPath}\\${item.name}`);
                  }
                }}
              >
                {item.type === 'folder' ? (
                  <FolderIcon size={48} className="text-blue-400" />
                ) : (
                  <FileIcon size={48} className="text-gray-400" />
                )}
                <span className="text-xs text-center line-clamp-2 group-hover:text-blue-600">
                  {item.name}
                </span>
                {item.size && <span className="text-xs text-gray-500">{item.size}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-6 border-t border-gray-200 px-4 flex items-center text-xs text-gray-600 bg-gray-50">
        {items.length} items
      </div>
    </div>
  );
}
