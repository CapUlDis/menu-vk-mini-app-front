import React, { useState, useEffect } from 'react';
import { BridgePlus } from "@happysanta/bridge-plus";
import { Panel, Placeholder, FixedLayout, Group, Tabs, HorizontalScroll, TabsItem, Header, List, RichCell, Headline, Avatar, Text, Caption, Title, Subhead, Spacing } from '@vkontakte/vkui';
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
      console.log(document.getElementById("main").firstChild.lastChild.firstChild.lastChild.clientHeight);
    } catch (error) {
      console.log(err);
    }
  }, []);

  return (
    <Panel id={id}>
      <FixedLayout id="header" vertical='top' >
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
              {group.Categories.map((category, index) => {
                return (
                  <TabsItem key={category.id}
                    onClick={() => {
                      setActiveTab(category.id);
                      const verPos = document.getElementById('group' + category.id).offsetTop 
                        - document.getElementById('header').offsetHeight 
                        + (index !== 0 ? 8 : 0)
                        - (desktop && 15);
                      window.scrollTo(0, verPos);
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
      {group.Categories && group.Categories.length > 0 
        ? <Group id='main' style={{ 
          paddingTop: !groupInfo.avatar ? (!groupInfo.timetable ? '87px' : '119px') : (!groupInfo.timetable ? '299px' : '331px'),
          paddingBottom: !groupInfo.avatar 
            ? (document.documentElement.clientHeight - 8 - (!groupInfo.timetable ? 87 : 119)) + 'px'
            : (document.documentElement.clientHeight - 16 - document.getElementById(`group${group.Categories[group.Categories.length - 1].id}__main`).clientHeight - (!groupInfo.timetable ? 299 : 331)) + 'px'
        }}>
          {group.Categories.map((category, index) => {
            return (
              <Group className="category-group"
                key={'group' + category.id} 
                id={'group' + category.id}
                header={
                  <Header className="category-group__header" mode='primary'>
                    {category.title}
                  </Header>
              }>
                {category.Positions &&
                  <List id={'group' + category.id + '__main'}
                    className={desktop && 'position-list_desktop'}
                  >
                    {category.Positions.map(position => {
                      if (desktop) {
                        return (
                          <div className="position-desktop" key={'position-desktop' + position.id}>
                            <Avatar size={190} mode='image' src={position.imageUrl}/>
                            <Text className="position-desktop__title">{position.title}</Text>
                            <Caption className="position-desktop__description" level='1' weight='regular'>{position.description}</Caption>
                            <div className="position__bottom position__bottom_desktop">
                              <Text>{position.price + '₽'}</Text>
                              <Caption className="position__value" level='1' weight='regular'>{'· ' + position.value + units[position.unitId].nick}</Caption>
                            </div>
                          </div>
                        )
                      } else {
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
                      }
                    })}
                  </List>
                }
              </Group>
            );
          })}
        </Group>
        : <Placeholder style={{
          paddingTop: !groupInfo.avatar ? (!groupInfo.timetable ? '97px' : '129px') : (!groupInfo.timetable ? '309px' : '341px'),
        }}>
          Меню еще не составлено
        </Placeholder>
      }
    </Panel>
  );
}

export default Menu;