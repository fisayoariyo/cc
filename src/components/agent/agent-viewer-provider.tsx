'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { AgentViewer } from '@/lib/agent-viewer-types';

const AgentViewerContext = createContext<AgentViewer | null>(null);

export function AgentViewerProvider({
  viewer,
  children,
}: {
  viewer: AgentViewer;
  children: ReactNode;
}) {
  return <AgentViewerContext.Provider value={viewer}>{children}</AgentViewerContext.Provider>;
}

export function useAgentViewer() {
  const viewer = useContext(AgentViewerContext);
  if (!viewer) {
    throw new Error('useAgentViewer must be used within AgentViewerProvider');
  }
  return viewer;
}

export function useAgentViewerOptional() {
  return useContext(AgentViewerContext);
}
