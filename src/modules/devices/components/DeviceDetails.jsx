import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { ClipboardList, CreditCard, Terminal } from 'lucide-react';
import React, { useState } from 'react';
import DeviceOperations from './DeviceOperations';
import DeviceEvents from './DeviceEvents';
import DeviceCommands from './DeviceCommands';
import DeviceCommandsTypes from './DeviceCommandsTypes';
import DeviceCommandsFilter from './DeviceCommandsFilter';

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
        <div className="flex flex-row justify-between">
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
