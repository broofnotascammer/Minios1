export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: string;
}
