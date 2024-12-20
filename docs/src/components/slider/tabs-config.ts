export const TABS = [
  { id: 'basic', label: 'Simple' },
  { id: 'advanced', label: 'Custom' },
  { id: 'player', label: 'Media' },
] as const;

export type TabId = (typeof TABS)[number]['id'];
