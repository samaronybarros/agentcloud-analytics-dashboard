import type { Agent } from '@/lib/types';

// ---------------------------------------------------------------------------
// 10 agents across 4 teams, using a mix of models and types.
// Hardcoded for full determinism and easy review.
// ---------------------------------------------------------------------------

export const agents: readonly Agent[] = [
  {
    id: 'agent-01',
    name: 'CodeReviewer',
    team: 'Platform',
    owner: 'user-01',
    type: 'code-gen',
    model: 'claude-sonnet-4-20250514',
  },
  {
    id: 'agent-02',
    name: 'DataSync',
    team: 'Data',
    owner: 'user-03',
    type: 'data-pipeline',
    model: 'gpt-4o',
  },
  {
    id: 'agent-03',
    name: 'TestRunner',
    team: 'Platform',
    owner: 'user-01',
    type: 'qa-testing',
    model: 'claude-haiku-4-5-20251001',
  },
  {
    id: 'agent-04',
    name: 'DeployBot',
    team: 'Backend',
    owner: 'user-04',
    type: 'deployment',
    model: 'gpt-4o-mini',
  },
  {
    id: 'agent-05',
    name: 'AlertMonitor',
    team: 'Platform',
    owner: 'user-02',
    type: 'monitoring',
    model: 'claude-haiku-4-5-20251001',
  },
  {
    id: 'agent-06',
    name: 'ChatAssistant',
    team: 'Frontend',
    owner: 'user-06',
    type: 'chat',
    model: 'claude-sonnet-4-20250514',
  },
  {
    id: 'agent-07',
    name: 'PipelineOrchestrator',
    team: 'Data',
    owner: 'user-03',
    type: 'data-pipeline',
    model: 'gpt-4o',
  },
  {
    id: 'agent-08',
    name: 'CodeGenerator',
    team: 'Backend',
    owner: 'user-05',
    type: 'code-gen',
    model: 'claude-sonnet-4-20250514',
  },
  {
    id: 'agent-09',
    name: 'SecurityScanner',
    team: 'Platform',
    owner: 'user-02',
    type: 'qa-testing',
    model: 'gpt-4o',
  },
  {
    id: 'agent-10',
    name: 'DocWriter',
    team: 'Frontend',
    owner: 'user-07',
    type: 'code-gen',
    model: 'gpt-4o-mini',
  },
] as const;
