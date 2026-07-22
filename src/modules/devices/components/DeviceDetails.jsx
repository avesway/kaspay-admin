import React, { useState } from 'react';
import { ClipboardList, CreditCard, Terminal } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import DeviceCommands from './DeviceCommands';
import DeviceCommandsFilter from './DeviceCommandsFilter';
import DeviceCommandsTypes from './DeviceCommandsTypes';
import DeviceEvents from './DeviceEvents';
import DeviceOperations from './DeviceOperations';

const tabs = [
  {
    id: 1,
    tab: 'operations',
    icon: CreditCard,
    className: 'text-primary',
    nameTab: 'Последние операции',
    content: <DeviceOperations />,
  },
  {
    id: 2,
    tab: 'events',
    icon: ClipboardList,
    className: 'text-primary',
    nameTab: 'События',
    content: <DeviceEvents />,
  },
  {
    id: 3,
    tab: 'commands',
    icon: Terminal,
    className: 'text-primary',
    nameTab: 'Команды',
    content: (
      <>
        <DeviceCommandsFilter />
        <div className="flex flex-row justify-between max-sm:flex-col max-sm:gap-5">
          <DeviceCommandsTypes />
          <DeviceCommands />
        </div>
      </>
    ),
  },
];

const DeviceDetails = () => {
  const [activeTab, setActiveTab] = useState('operations');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.tab}>
            {<tab.icon />}
            {tab.nameTab}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.tab}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DeviceDetails;
