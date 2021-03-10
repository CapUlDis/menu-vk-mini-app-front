import React, { useState, useEffect } from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, CellButton, Group, Tabs, HorizontalScroll, TabsItem, Header, List, RichCell, Avatar, Text, Caption } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { PANEL_START, PAGE_PRESET } from '../router';
import units from '../utils/units';
import './Menu.css';


const Menu = ({ id, group, desktop }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(group.Categories[0].id);
  const [cover, setCover] = useState('');
  const [avatar, setAvatar] = useState('');

  const fetchGroupInfo = async () => {
    // const responseVk = await bridge.send("VKWebAppGetGroupInfo", { group_id: group.vkGroupId });
    // console.log(responseVk);

    const res2 = await bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": group.vkGroupId, "v": "5.130", "access_token": "504f96ca504f96ca504f96ca6d503a697d5504f504f96ca3049211346c9c52f82d4db83", "fields": "addresses,cover,has_photo"}});
    // const res2 = await bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": group.vkGroupId, "v": "5.130", "access_token": "504f96ca504f96ca504f96ca6d503a697d5504f504f96ca3049211346c9c52f82d4db83", "fields": "place,cover,has_photo"}});

    console.log(res2);
    setCover(res2.response[0].cover.images[4].url);
    setAvatar(res2.response[0].photo_200);
  };

  useEffect(() => {
    try {
      fetchGroupInfo();
    } catch (error) {
      console.log(err);
    }
  }, []);

  return (
    <Panel id={id}>
      <CellButton onClick={() => router.popPage()}>
        Назад
      </CellButton>
      <header className="header">
        <div className="header__container">
          {/* <img src={cover} className="header__cover"/> */}
          <div className="header__cover" style={{ background: `url(${cover}) no-repeat center`, backgroundSize: 'cover' }}/>
          <Avatar size={80} src={avatar} className="header__avatar"/>
        </div>
      </header>
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
      {group.Categories &&
        <List>
          {group.Categories.map(category => {
            return (
              <Group key={'group' + category.id} header={
                <Header mode='primary'>
                  {category.title}
                </Header>
              }>
                {category.Positions &&
                  <List>
                    {category.Positions.map(position => {
                      return (
                        <RichCell key={'richCell' + position.id}
                          disabled
                          multiline
                          before={<Avatar size={72} mode='app' src={position.imageUrl}/>}
                          text={position.description}
                          // caption={'·' + position.value + units[position.unitId].nick}
                          bottom={
                            <div>
                              <Text>{position.price + '₽'}</Text>
                              <Caption level='1' weight='regular'>{'· ' + position.value + units[position.unitId].nick}</Caption>
                            </div>
                          }
                        >
                          {position.title}
                        </RichCell>
                      );
                    })}
                  </List>
                }
              </Group>
            );
          })}
        </List>
      }
    </Panel>
  );
}

export default Menu;