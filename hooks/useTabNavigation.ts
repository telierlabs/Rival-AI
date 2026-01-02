import { useState } from 'react';

export type TabType = 'chat' | 'profile' | 'gallery';

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  return { activeTab, setActiveTab };
};
