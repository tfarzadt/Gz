export interface ProblemItem {
  id: string;
  subsystem: 'Memory' | 'Simulation' | 'Rendering' | 'Build' | 'Networking' | 'File System';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  legacyCode: string;
  issue: string;
  modernFix: string;
}

export interface RiskItem {
  id: string;
  category: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface PatchFile {
  filepath: string;
  status: 'modified' | 'added';
  description: string;
  unifiedDiff: string;
  fullContent?: string;
  fileType: 'cpp' | 'h' | 'cmake' | 'ini' | 'xml';
}

export interface SimMetrics {
  originalFps: number;
  optimizedFps: number;
  originalFrametime: number[];
  optimizedFrametime: number[];
  originalMemory: number;
  optimizedMemory: number;
  originalDrawCalls: number;
  optimizedDrawCalls: number;
  originalCacheMisses: number;
  optimizedCacheMisses: number;
}
