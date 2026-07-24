export type DecisionSource = 'anarix' | 'aan' | 'meeting' | 'slack' | 'teams' | 'email';

export interface SourceMeta {
  key: DecisionSource;
  label: string;
  icon: string;
  description: string;
}

export const SOURCE_REGISTRY: Record<DecisionSource, SourceMeta> = {
  anarix: {
    key: 'anarix',
    label: 'Anarix',
    icon: 'lightning',
    description: 'Anarix platform monitor',
  },
  aan: {
    key: 'aan',
    label: 'Aan',
    icon: 'robot',
    description: "My own inference",
  },
  meeting: {
    key: 'meeting',
    label: 'Meeting',
    icon: 'calendar',
    description: 'Captured from a meeting',
  },
  slack: {
    key: 'slack',
    label: 'Slack',
    icon: 'chat-circle',
    description: 'Slack channel or DM',
  },
  teams: {
    key: 'teams',
    label: 'Teams',
    icon: 'users',
    description: 'Microsoft Teams',
  },
  email: {
    key: 'email',
    label: 'Email',
    icon: 'envelope',
    description: 'Inbox thread',
  },
};

export function getSourceMeta(source: DecisionSource): SourceMeta {
  return SOURCE_REGISTRY[source];
}
