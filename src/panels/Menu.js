import React, { useState } from 'react';
import { Panel, CellButton, Group, Tabs, HorizontalScroll, TabsItem } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { PANEL_START, PAGE_PRESET } from '../router';


const Menu = ({ id, group, desktop }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(group.Categories[0].id);

  return (
    <Panel id={id}>
      <CellButton onClick={() => router.popPage()}>
        Назад
      </CellButton>
      {group.Categories && group.Categories.length > 1 &&
        <Group>
          <Tabs>
            <HorizontalScroll>
              {group.Categories.map(category => {
                return (
                  <TabsItem key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    selected={activeTab === category.id}
                  >
                    {category.title}
                  </TabsItem>
                );
              })}
            </HorizontalScroll>
          </Tabs>
        </Group>
      }
    </Panel>
  );
}

export default Menu;