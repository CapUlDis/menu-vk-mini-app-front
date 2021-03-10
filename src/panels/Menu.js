import React, { useState, useEffect } from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, CellButton, FixedLayout, Group, Tabs, HorizontalScroll, TabsItem, Header, List, RichCell, Avatar, Text, Caption, Title, Subhead, Spacing } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { PANEL_START, PAGE_PRESET } from '../router';
import units from '../utils/units';
import './Menu.css';


const Menu = ({ id, group, desktop }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(group.Categories[0].id);
  const [cover, setCover] = useState('');
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');

  const fetchGroupInfo = async () => {
    // const responseVk = await bridge.send("VKWebAppGetGroupInfo", { group_id: group.vkGroupId });
    // console.log(responseVk);

    const res2 = await bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": group.vkGroupId, "v": "5.130", "access_token": "504f96ca504f96ca504f96ca6d503a697d5504f504f96ca3049211346c9c52f82d4db83", "fields": "addresses,cover,has_photo"}});
    // const res2 = await bridge.send("VKWebAppCallAPIMethod", {"method": "groups.getById", "params": {"group_id": group.vkGroupId, "v": "5.130", "access_token": "504f96ca504f96ca504f96ca6d503a697d5504f504f96ca3049211346c9c52f82d4db83", "fields": "addresses,cover,has_photo"}});

    console.log(res2);
    setCover(res2.response[0].cover.images[4].url);
    setAvatar(res2.response[0].photo_200);
    setName(res2.response[0].name);
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
      <FixedLayout vertical='top' filled>
          {avatar &&
            <div className="header__images">
              <div className="header__cover" style={{ background: `url(${cover}) no-repeat center`, backgroundSize: 'cover' }}/>
              <Avatar size={80} src={avatar} className="header__avatar"/>
            </div>
          }
          <div className="header__text">
            <Title level='1' weight='heavy' className="header__title">{name}</Title>
            <Subhead weight='regular' className="header__open">открыто до 22:00</Subhead>
          </div>
          {group.Categories &&
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
          }
          <Spacing separator size={8}/>
      </FixedLayout>
      <Group className="main" style={{ paddingTop: !avatar ? '50px' : '325px' }}>
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
                          <RichCell className="position"
                            key={'richCell' + position.id}
                            disabled
                            multiline
                            before={<Avatar size={72} mode='app' src={position.imageUrl}/>}
                            text={position.description}
                            bottom={
                              <div className="position__bottom">
                                <Text>{position.price + '₽'}</Text>
                                <Caption className="position__value" level='1' weight='regular'>{'· ' + position.value + units[position.unitId].nick}</Caption>
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
        <CellButton onClick={() => router.popPage()}>
          Назад
        </CellButton>
      </Group>
    </Panel>
  );
}

export default Menu;