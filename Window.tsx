import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { X, Minus, Square } from 'lucide-react';
import type { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WindowState>) => void;
  children: ReactNode;
}

export default function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdate,
  children,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  if (window.isMinimized) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    });
    onFocus(window.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      onUpdate(window.id, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.width,
      height: window.height,
    });
    onFocus(window.id);
  };

  const handleMouseMoveResize = (e: React.MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      onUpdate(window.id, {
        width: Math.max(300, resizeStart.width + deltaX),
        height: Math.max(200, resizeStart.height + deltaY),
      });
    }
  };

  const handleMouseUpResize = () => {
    setIsResizing(false);
  };

  return (
    <div
      ref={windowRef}
      className="absolute bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all"
      style={{
        left: window.isMaximized ? 0 : `${window.x}px`,
        top: window.isMaximized ? 0 : `${window.y}px`,
        width: window.isMaximized ? '100%' : `${window.width}px`,
        height: window.isMaximized ? '100%' : `${window.height}px`,
        zIndex: window.zIndex,
      }}
      onMouseMove={isDragging || isResizing ? handleMouseMove : handleMouseMoveResize}
      onMouseUp={isDragging || isResizing ? handleMouseUp : handleMouseUpResize}
      onMouseLeave={isDragging || isResizing ? handleMouseUp : handleMouseUpResize}
      onClick={() => onFocus(window.id)}
    >
      <div
        className="h-10 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between px-4 cursor-move hover:from-gray-100 hover:to-gray-150 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{window.icon}</span>
          <span className="text-sm font-medium text-gray-800">{window.title}</span>
        </div>
        <div className="flex items-center gap-2" data-no-drag>
          <button
            onClick={() => onMinimize(window.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Minimize"
          >
            <Minus size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onMaximize(window.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Maximize"
          >
            <Square size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onClose(window.id)}
            className="p-1 hover:bg-red-200 rounded transition-colors"
            title="Close"
          >
            <X size={16} className="text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>

      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-gray-200 cursor-se-resize hover:bg-gray-300 transition-colors"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}
