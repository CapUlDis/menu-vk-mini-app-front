import React, { useState, useEffect } from 'react';
import { BridgePlus } from "@happysanta/bridge-plus";
import { Panel, FixedLayout, Group, Tabs, HorizontalScroll, TabsItem, Header, List, RichCell, Avatar, Text, Caption, Title, Subhead, Spacing } from '@vkontakte/vkui';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import { PAGE_FILL_MENU } from '../router';
import units from '../utils/units';
import './Menu.css';


const Menu = ({ id, group, desktop, admin }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(group.Categories[0].id);
  const [groupInfo, setGroupInfo] = useState({
    name: '', 
    avatar: '', 
    cover: '', 
    timetable: '', 
    close: true,
  });

  const fetchGroupInfo = async () => {
    const response = await BridgePlus.api("groups.getById", { group_id: group.vkGroupId, fields: "addresses,cover,has_photo" })
      .then(({ response: [groupInfo] }) => { return groupInfo });
    
    let cloneGroupInfo = {...groupInfo};
    console.log(response);

    cloneGroupInfo.name = response.name;

    if (response.has_photo + response.cover.enabled === 2) {
      cloneGroupInfo.avatar = response.photo_200;
      cloneGroupInfo.cover = response.cover.images[4].url;
    }

    if (response.addresses.is_enabled) {
      const mainAdress = await BridgePlus.api("groups.getAddresses", { group_id: group.vkGroupId, address_ids: response.addresses.main_address_id, fields: "timetable" })
        .then(({ response }) => { return response.items[0] });

      const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const today = new Date();
      const currentMinutes = 60 * today.getHours() + today.getMinutes();
      const day = daysOfWeek[today.getDay()];
      
      if (mainAdress.timetable[day]) {
        
        if (currentMinutes < mainAdress.timetable[day].open_time) {
          const minutes = mainAdress.timetable[day].open_time % 60;
          const hours = (mainAdress.timetable[day].open_time - minutes) / 60;
          cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open"><span style={{ color: 'var(--dynamic_red)'}}>Закрыто</span> · откроется в {hours}:{('0' + minutes).slice(-2)}</Subhead>;

        } else if (currentMinutes >= mainAdress.timetable[day].open_time && currentMinutes < mainAdress.timetable[day].close_time) {
          const minutes = mainAdress.timetable[day].close_time % 60;
          const hours = (mainAdress.timetable[day].close_time - minutes) / 60;
          cloneGroupInfo.close = false;
          cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open">открыто до {hours}:{('0' + minutes).slice(-2)}</Subhead>;

        } else if (currentMinutes >= mainAdress.timetable[day].close_time) {
          const nextDay = today.getDay() === 6 ? daysOfWeek[0] : daysOfWeek[today.getDay() + 1];

          if (mainAdress.timetable[nextDay]) {
            const minutes = mainAdress.timetable[nextDay].open_time % 60;
            const hours = (mainAdress.timetable[nextDay].open_time - minutes) / 60;
            cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open"><span style={{ color: 'var(--dynamic_red)'}}>Закрыто</span> · откроется в {hours}:{('0' + minutes).slice(-2)}</Subhead>;
          }
        }
      }
    }

    setGroupInfo(cloneGroupInfo);
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
      <FixedLayout id="header" vertical='top' filled>
        {admin && <Icon28SettingsOutline className="header__settings" fill={groupInfo.avatar ? '#FFFFFF' : '#000000'} onClick={() =>{
          router.pushPage(PAGE_FILL_MENU);
        }}/>}
        {groupInfo.avatar &&
          <div className="header__images">
            <div className="header__cover" style={{ background: `url(${groupInfo.cover}) no-repeat center`, backgroundSize: 'cover' }}/>
            <Avatar size={80} src={groupInfo.avatar} className="header__avatar"/>
          </div>
        }
        <div className="header__text">
          <Title level='1' weight='heavy' className="header__title">{groupInfo.name}</Title>
          {groupInfo.timetable}
        </div>
        {group.Categories &&
          <Tabs>
            <HorizontalScroll>
              {group.Categories.map(category => {
                return (
                  <TabsItem key={category.id}
                    onClick={() => {
                      setActiveTab(category.id);
                      window.scrollTo(0, document.getElementById('group' + category.id).offsetTop - document.getElementById('header').offsetHeight + 16);
                    }}
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
      <Group id='main' className="main" style={{ 
        paddingTop: !groupInfo.avatar ? (!groupInfo.timetable ? '97px' : '129px') : (!groupInfo.timetable ? '309px' : '341px'),
        paddingBottom: !groupInfo.avatar 
          ? (document.documentElement.clientHeight - 44 - (!groupInfo.timetable ? 97 : 129)) + 'px'
          : (document.documentElement.clientHeight - 44 - (!groupInfo.timetable ? 309 : 341)) + 'px'
      }}>
        {group.Categories &&
          <List>
            {group.Categories.map(category => {
              return (
                <Group key={'group' + category.id} 
                  id={'group' + category.id}
                  header={
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
      </Group>
    </Panel>
  );
}

export default Menu;